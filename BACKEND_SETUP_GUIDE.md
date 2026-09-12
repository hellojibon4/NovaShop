# Backend API Setup গাইড - Node.js + Express

আপনার ই-কমার্স সাইটের জন্য একটি ব্যাকএন্ড সার্ভার সেটআপ করার সম্পূর্ণ গাইড।

## ১. প্রজেক্ট সেটআপ

### প্রয়োজনীয় সফটওয়্যার:
- Node.js (v14 বা উপরে)
- npm বা yarn

### প্রজেক্ট ইনিশিয়ালাইজ করা:

```bash
# নতুন ফোল্ডার তৈরি করুন
mkdir novashop-backend
cd novashop-backend

# Node প্রজেক্ট ইনিশিয়ালাইজ করুন
npm init -y

# প্রয়োজনীয় প্যাকেজ ইনস্টল করুন
npm install express cors dotenv @sendgrid/mail firebase-admin axios
npm install -D nodemon
```

## ২. প্যাকেজ.json কনফিগারেশন

আপনার `package.json` এ এই স্ক্রিপ্ট যোগ করুন:

```json
{
  "name": "novashop-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "@sendgrid/mail": "^7.7.0",
    "firebase-admin": "^11.5.0",
    "axios": "^1.3.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

## ৩. Environment Variables (.env ফাইল)

প্রজেক্ট রুটে একটি `.env` ফাইল তৈরি করুন:

```env
# সার্ভার কনফিগ
PORT=5000
NODE_ENV=development

# SendGrid ইমেইল সার্ভিস
SENDGRID_API_KEY=your_sendgrid_api_key_here
ADMIN_EMAIL=your-email@gmail.com

# Firebase Admin সেটআপ (Service Account Key)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Stripe (যদি পেমেন্ট গেটওয়ে হিসেবে ব্যবহার করেন)
STRIPE_SECRET_KEY=your_stripe_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## ৪. মূল সার্ভার ফাইল (server.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Express এপ্লিকেশন সেটআপ
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Firebase Admin ইনিশিয়ালাইজ করা
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.log('Firebase already initialized');
}

// SendGrid সেটআপ
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ========================
// ইমেইল পাঠানোর রুট
// ========================

// মেসেজ নোটিফিকেশন ইমেইল
app.post('/api/send-message-notification', async (req, res) => {
  try {
    const { name, email, phone, subject, message, messageId } = req.body;

    const adminMsg = {
      to: process.env.ADMIN_EMAIL,
      from: 'noreply@novashop.com',
      subject: `নতুন যোগাযোগ: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">নতুন মেসেজ পেয়েছেন</h2>
            
            <div style="margin: 20px 0; border-left: 4px solid #007bff; padding-left: 15px;">
              <p><strong>নাম:</strong> ${name}</p>
              <p><strong>ইমেইল:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>ফোন:</strong> ${phone || 'N/A'}</p>
              <p><strong>বিষয়:</strong> ${subject}</p>
              <p><strong>বার্তা:</strong></p>
              <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
                ${message}
              </p>
            </div>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                <strong>Message ID:</strong> ${messageId}<br>
                <strong>সময়:</strong> ${new Date().toLocaleString('bn-BD')}
              </p>
            </div>

            <div style="margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL}/admin/messages/${messageId}" 
                 style="background-color: #007bff; color: white; padding: 10px 20px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                Admin এ উত্তর দিন
              </a>
            </div>
          </div>
        </div>
      `
    };

    await sgMail.send(adminMsg);

    // কাস্টমারকে স্বয়ংক্রিয় উত্তর পাঠানো
    const customerMsg = {
      to: email,
      from: 'noreply@novashop.com',
      subject: 'আমরা আপনার মেসেজ পেয়েছি - NovaShop',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">ধন্যবাদ, ${name}!</h2>
            
            <p>আপনার মেসেজ আমরা সফলভাবে পেয়েছি। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>

            <div style="margin: 20px 0; background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
              <p><strong>আপনার বিষয়:</strong> ${subject}</p>
              <p><strong>আমাদের রেফারেন্স নম্বর:</strong> ${messageId}</p>
            </div>

            <p style="color: #666;">আমরা সাধারণত ২৪ ঘন্টার মধ্যে উত্তর দিই।</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #666; font-size: 12px;">
                NovaShop - আপনার পছন্দের অনলাইন স্টোর
              </p>
            </div>
          </div>
        </div>
      `
    };

    await sgMail.send(customerMsg);

    res.json({ success: true, message: 'ইমেইল পাঠানো হয়েছে' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// অর্ডার কনফার্মেশন ইমেইল
app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { orderId, customerEmail, customerName, items, totalAmount, shippingInfo } = req.body;

    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">৳${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">৳${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const msg = {
      to: customerEmail,
      from: 'orders@novashop.com',
      subject: `অর্ডার কনফার্মেশন - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; background-color: white; padding: 30px; border-radius: 8px;">
            <h1 style="color: #007bff; text-align: center;">অর্ডার কনফার্মেশন</h1>
            
            <p>হ্যালো ${customerName},</p>
            <p>আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। এখানে আপনার অর্ডার বিবরণ:</p>

            <div style="margin: 20px 0; background-color: #f0f8ff; padding: 15px; border-radius: 4px;">
              <p><strong>অর্ডার আইডি:</strong> <span style="color: #007bff;">${orderId}</span></p>
              <p><strong>অর্ডারের তারিখ:</strong> ${new Date().toLocaleDateString('bn-BD')}</p>
            </div>

            <h3>অর্ডার বিস্তারিত:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f0f8ff;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #007bff;">পণ্য</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #007bff;">পরিমাণ</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #007bff;">মূল্য</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #007bff;">মোট</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div style="margin: 20px 0; text-align: right; font-size: 16px;">
              <p><strong>মোট পরিমাণ:</strong> <span style="color: #007bff; font-size: 20px;">৳${totalAmount}</span></p>
            </div>

            <h3>ডেলিভারি ঠিকানা:</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
              <p>${shippingInfo.name}<br>
                 ${shippingInfo.address}<br>
                 ${shippingInfo.city} - ${shippingInfo.postalCode}<br>
                 ${shippingInfo.phone}
              </p>
            </div>

            <h3>পরবর্তী পদক্ষেপ:</h3>
            <ol style="color: #333;">
              <li>আপনার অর্ডার প্রসেস হচ্ছে</li>
              <li>আমরা ট্র্যাকিং তথ্য সহ আরেকটি ইমেইল পাঠাব</li>
              <li>আপনার পণ্য শীঘ্রই ডেলিভার হবে</li>
            </ol>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666;">কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
              <p style="color: #666; font-size: 12px;">
                NovaShop কাস্টমার সাপোর্ট
              </p>
            </div>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);

    res.json({ success: true, message: 'অর্ডার কনফার্মেশন ইমেইল পাঠানো হয়েছে' });
  } catch (error) {
    console.error('Order confirmation email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// স্ট্যাটাস আপডেট ইমেইল
app.post('/api/send-status-update', async (req, res) => {
  try {
    const { orderId, customerEmail, customerName, status, message } = req.body;

    const statusBangli = {
      processing: 'প্রসেসিং',
      shipped: 'পাঠানো হয়েছে',
      delivered: 'ডেলিভার হয়েছে',
      cancelled: 'বাতিল করা হয়েছে'
    };

    const msg = {
      to: customerEmail,
      from: 'orders@novashop.com',
      subject: `অর্ডার আপডেট - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333;">অর্ডার স্ট্যাটাস আপডেট</h2>
            
            <p>হ্যালো ${customerName},</p>
            <p>আপনার অর্ডারে নতুন আপডেট রয়েছে:</p>

            <div style="margin: 20px 0; background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; border-radius: 4px;">
              <h3 style="color: #155724; margin: 0;">📦 ${statusBangli[status]}</h3>
              <p style="margin: 10px 0 0 0; color: #155724;">${message}</p>
            </div>

            <div style="margin: 20px 0;">
              <p><strong>অর্ডার আইডি:</strong> ${orderId}</p>
              <p><strong>আপডেট সময়:</strong> ${new Date().toLocaleString('bn-BD')}</p>
            </div>

            <a href="${process.env.FRONTEND_URL}/orders/${orderId}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              অর্ডার ট্র্যাক করুন
            </a>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                এই স্বয়ংক্রিয় ইমেইলের উত্তর দিবেন না। কোনো প্রশ্ন থাকলে আমাদের যোগাযোগ ফর্ম ব্যবহার করুন।
              </p>
            </div>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);

    res.json({ success: true, message: 'স্ট্যাটাস আপডেট ইমেইল পাঠানো হয়েছে' });
  } catch (error) {
    console.error('Status update email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// পেমেন্ট প্রসেসিং (Stripe)
// ========================

app.post('/api/charge', async (req, res) => {
  try {
    const { orderId, token } = req.body;

    // এখানে Stripe এর সাথে পেমেন্ট প্রসেস করবেন
    // (Stripe সেটআপ টিউটোরিয়াল এর জন্য তাদের ডকুমেন্টেশন দেখুন)

    res.json({ 
      success: true, 
      orderId: orderId,
      message: 'পেমেন্ট সফল'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// স্বাস্থ্য পরীক্ষা
// ========================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'NovaShop Backend সক্রিয়'
  });
});

// ========================
// Error Handling Middleware
// ========================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'কিছু ত্রুটি হয়েছে',
    message: err.message 
  });
});

// সার্ভার শুরু করা
app.listen(PORT, () => {
  console.log(`✅ NovaShop Backend সার্ভার চলছে: http://localhost:${PORT}`);
});
```

## ৫. সার্ভার চালানো

```bash
# ডেভেলপমেন্ট মোডে চালান (Nodemon দিয়ে)
npm run dev

# প্রোডাকশন মোডে চালান
npm start
```

## ৬. Vercel এ ডিপ্লয় করা (বিনামূল্যে)

### vercel.json ফাইল তৈরি করুন:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "SENDGRID_API_KEY": "@sendgrid_api_key",
    "ADMIN_EMAIL": "@admin_email",
    "FIREBASE_PROJECT_ID": "@firebase_project_id",
    "FIREBASE_PRIVATE_KEY": "@firebase_private_key",
    "FIREBASE_CLIENT_EMAIL": "@firebase_client_email"
  }
}
```

### Vercel এ ডিপ্লয় করুন:

```bash
npm install -g vercel
vercel login
vercel
```

## ৭. Firebase Security Rules

আপনার Firebase কনসোল এ যান এবং এই Security Rules সেট করুন:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // অথেন্টিকেটেড ইউজার শুধুমাত্র তাদের নিজের ডেটা পড়তে পারবে
    match /users/{userId} {
      allow read, update, delete: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }

    // সব ইউজার অর্ডার পড়তে পারবে
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.userId || isAdmin();
    }

    // সব মেসেজ সবার দ্বারা পড়া যাবে (স্প্যাম রোধ করতে পারেন)
    match /messages/{messageId} {
      allow read: if isAdmin();
      allow create: if request.auth.uid == null; // বিনা লগইন এও মেসেজ পাঠাতে পারবে
    }

    // প্রোডাক্ট সবাই পড়তে পারবে
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Admin চেক
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

---

## ⚠️ গুরুত্বপূর্ণ টিপস:

1. **Environment Variables সুরক্ষিত রাখুন** - কখনও `.env` ফাইল GitHub এ আপলোড করবেন না
2. **SendGrid API Key** - https://app.sendgrid.com এ সাইন আপ করুন (বিনামূল্যে ৩০০ ইমেইল/মাস)
3. **Firebase Admin Key** - Firebase Console এ Project Settings → Service Accounts এ পাবেন
4. **CORS সেটিংস** - আপনার ফ্রন্টএন্ড URL যোগ করুন
5. **টেস্ট ইমেইল** - ডিপ্লয় করার আগে ইমেইল টেস্ট করুন

---

## প্রয়োজনীয় লিঙ্ক:

- SendGrid: https://sendgrid.com
- Firebase Admin Setup: https://firebase.google.com/docs/admin/setup
- Vercel Deployment: https://vercel.com
- Express.js: https://expressjs.com

এই সেটআপ সম্পন্ন করলে আপনার সম্পূর্ণ অনলাইন স্টোর কার্যকর হবে! ✅
