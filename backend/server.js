const express = require('express');
const cors = require('cors');
require('dotenv').config();
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup for Vite frontend
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local dev
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Firebase Admin initialization (safe initialization)
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.warn('⚠️ Firebase Admin initialization failed:', error.message);
  }
} else {
  console.log('ℹ️ Running backend without Firebase Admin credentials (add keys to backend/.env to connect)');
}

// SendGrid initialization (safe initialization)
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid Mail API initialized');
} else {
  console.log('ℹ️ Running backend without SendGrid credentials (mock email mode enabled)');
}

// ========================
// 1. Health check
// ========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'NovaShop Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// ========================
// 2. Customer Support Message Notification
// ========================
app.post('/api/send-message-notification', async (req, res) => {
  try {
    const { name, email, phone, subject, message, messageId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
      const adminMsg = {
        to: process.env.ADMIN_EMAIL || 'admin@novashop.com',
        from: 'noreply@novashop.com',
        subject: `NovaShop Contact: ${subject || 'New Message'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
            <div style="max-width: 600px; background-color: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h2 style="color: #6d28d9; margin-top: 0;">New Support Inquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
              <div style="margin: 16px 0; padding: 12px; background-color: #f1f5f9; border-radius: 8px;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="font-size: 12px; color: #94a3b8;">Ref ID: ${messageId || Date.now()}</p>
            </div>
          </div>
        `
      };
      await sgMail.send(adminMsg);
    } else {
      console.log(`📧 [MOCK EMAIL] Received inquiry from ${name} (${email}): "${subject}"`);
    }

    res.json({
      success: true,
      message: 'Message received and notification queued successfully'
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 3. Order Confirmation Email
// ========================
app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { orderId, customerEmail, customerName, items, totalAmount, shippingInfo } = req.body;

    if (!orderId || !customerEmail) {
      return res.status(400).json({ error: 'orderId and customerEmail are required' });
    }

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
      const itemsHTML = (items || []).map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity || item.qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${Number(item.price).toFixed(2)}</td>
        </tr>
      `).join('');

      const msg = {
        to: customerEmail,
        from: 'orders@novashop.com',
        subject: `Order Confirmation - #${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
            <div style="max-width: 600px; background-color: white; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h1 style="color: #7c3aed; text-align: center; margin-top: 0;">Order Confirmed</h1>
              <p>Hi ${customerName || 'Valued Customer'},</p>
              <p>Thank you for your order. We are preparing it with priority care.</p>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: center;">Qty</th>
                    <th style="padding: 8px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
              </table>
              <h3 style="text-align: right; color: #7c3aed;">Total: $${Number(totalAmount).toFixed(2)}</h3>
            </div>
          </div>
        `
      };
      await sgMail.send(msg);
    } else {
      console.log(`📧 [MOCK EMAIL] Order confirmation sent for order #${orderId} to ${customerEmail}`);
    }

    res.json({ success: true, message: 'Order confirmation recorded successfully' });
  } catch (error) {
    console.error('Order confirmation email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 4. Payment Charge (Stripe stub)
// ========================
app.post('/api/charge', async (req, res) => {
  try {
    const { orderId } = req.body;
    res.json({
      success: true,
      orderId,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 NovaShop Backend Server running on http://localhost:${PORT}`);
});
