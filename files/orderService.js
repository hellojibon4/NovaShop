// অর্ডার ম্যানেজমেন্ট সার্ভিস
// src/services/orderService.js এ রাখুন

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// অর্ডার স্ট্যাটাস:
// pending - অপেক্ষমান
// processing - প্রসেসিং হচ্ছে
// shipped - পাঠানো হয়েছে
// delivered - ডেলিভার হয়েছে
// cancelled - বাতিল করা হয়েছে

// ১. নতুন অর্ডার তৈরি করা
export const createOrder = async (userId, cartItems, shippingInfo, paymentMethod) => {
  try {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // অর্ডার টোটাল ক্যালকুলেট করা
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // শিপিং চার্জ (বাংলাদেশে)
    const shippingCharge = totalAmount > 2000 ? 0 : 150;
    const finalTotal = totalAmount + shippingCharge;

    const orderData = {
      orderId: orderId,
      userId: userId,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingInfo: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode
      },
      paymentMethod: paymentMethod,
      subtotal: totalAmount,
      shippingCharge: shippingCharge,
      totalAmount: finalTotal,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [
        {
          status: 'pending',
          timestamp: new Date(),
          message: 'অর্ডার গ্রহণ করা হয়েছে'
        }
      ]
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);

    // ইনভেন্টরি আপডেট করা
    for (let item of cartItems) {
      await updateProductInventory(item.id, item.quantity);
    }

    // অর্ডার কনফার্মেশন ইমেইল পাঠানো
    await sendOrderConfirmationEmail(orderData);

    return {
      success: true,
      orderId: orderId,
      message: 'অর্ডার সফলভাবে তৈরি হয়েছে। পেমেন্ট প্রসেস করুন।'
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'অর্ডার তৈরিতে সমস্যা হয়েছে'
    };
  }
};

// ২. অর্ডার স্ট্যাটাস আপডেট করা
export const updateOrderStatus = async (orderId, newStatus, message = '') => {
  try {
    const q = query(collection(db, 'orders'), where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'অর্ডার খুঁজে পাওয়া যায়নি'
      };
    }

    const orderDoc = querySnapshot.docs[0];
    const currentOrder = orderDoc.data();

    // টাইমলাইন আপডেট করা
    const updatedTimeline = [
      ...currentOrder.timeline,
      {
        status: newStatus,
        timestamp: new Date(),
        message: message || `স্ট্যাটাস পরিবর্তিত হয়েছে: ${newStatus}`
      }
    ];

    await updateDoc(orderDoc.ref, {
      status: newStatus,
      updatedAt: new Date(),
      timeline: updatedTimeline
    });

    // স্ট্যাটাস পরিবর্তন ইমেইল পাঠানো
    await sendStatusUpdateEmail(currentOrder, newStatus);

    return {
      success: true,
      message: 'অর্ডার স্ট্যাটাস আপডেট হয়েছে'
    };
  } catch (error) {
    console.error('Error updating order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ৩. সব অর্ডার পাওয়া (Admin এর জন্য)
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// ৪. একজন ইউজারের সব অর্ডার পাওয়া
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

// ৫. একটি নির্দিষ্ট অর্ডার পাওয়া
export const getOrderById = async (orderId) => {
  try {
    const q = query(collection(db, 'orders'), where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

// ৬. অর্ডার ক্যান্সেল করা
export const cancelOrder = async (orderId, reason = '') => {
  try {
    const order = await getOrderById(orderId);

    if (!order) {
      return {
        success: false,
        error: 'অর্ডার খুঁজে পাওয়া যায়নি'
      };
    }

    // শুধুমাত্র pending এবং processing স্ট্যাটাসের অর্ডার ক্যান্সেল করা যায়
    if (order.status !== 'pending' && order.status !== 'processing') {
      return {
        success: false,
        error: 'এই অর্ডার ক্যান্সেল করা যায় না'
      };
    }

    // ইনভেন্টরি রিস্টোর করা
    for (let item of order.items) {
      await restoreProductInventory(item.productId, item.quantity);
    }

    // অর্ডার স্ট্যাটাস আপডেট করা
    const q = query(collection(db, 'orders'), where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const orderDoc = querySnapshot.docs[0];
      const currentOrder = orderDoc.data();

      const updatedTimeline = [
        ...currentOrder.timeline,
        {
          status: 'cancelled',
          timestamp: new Date(),
          message: reason || 'অর্ডার ক্যান্সেল করা হয়েছে'
        }
      ];

      await updateDoc(orderDoc.ref, {
        status: 'cancelled',
        cancelReason: reason,
        updatedAt: new Date(),
        timeline: updatedTimeline
      });
    }

    return {
      success: true,
      message: 'অর্ডার সফলভাবে ক্যান্সেল করা হয়েছে'
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ৭. অর্ডার স্ট্যাটাস অনুযায়ী ফিল্টার করা
export const getOrdersByStatus = async (status) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return [];
  }
};

// ৮. প্রোডাক্ট ইনভেন্টরি আপডেট করা
const updateProductInventory = async (productId, quantity) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const currentStock = productSnap.data().stock || 0;
      await updateDoc(productRef, {
        stock: currentStock - quantity
      });
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
};

// ৯. প্রোডাক্ট ইনভেন্টরি রিস্টোর করা (অর্ডার ক্যান্সেল হলে)
const restoreProductInventory = async (productId, quantity) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const currentStock = productSnap.data().stock || 0;
      await updateDoc(productRef, {
        stock: currentStock + quantity
      });
    }
  } catch (error) {
    console.error('Error restoring inventory:', error);
  }
};

// ১০. অর্ডার কনফার্মেশন ইমেইল
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    await fetch('/api/send-order-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData.orderId,
        customerEmail: orderData.shippingInfo.email,
        customerName: orderData.shippingInfo.name,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingInfo: orderData.shippingInfo
      })
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// ১১. স্ট্যাটাস পরিবর্তন ইমেইল
const sendStatusUpdateEmail = async (orderData, newStatus) => {
  try {
    const statusMessages = {
      processing: 'আপনার অর্ডার প্রসেসিং হচ্ছে',
      shipped: 'আপনার অর্ডার পাঠানো হয়েছে',
      delivered: 'আপনার অর্ডার ডেলিভার হয়েছে',
      cancelled: 'আপনার অর্ডার ক্যান্সেল করা হয়েছে'
    };

    await fetch('/api/send-status-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData.orderId,
        customerEmail: orderData.shippingInfo.email,
        customerName: orderData.shippingInfo.name,
        status: newStatus,
        message: statusMessages[newStatus] || 'আপনার অর্ডারের স্ট্যাটাস পরিবর্তিত হয়েছে'
      })
    });
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};

// ১২. আজকের অর্ডার সংখ্যা পাওয়া
export const getTodayOrdersCount = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(db, 'orders'),
      where('createdAt', '>=', today),
      where('createdAt', '<', tomorrow)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting today orders count:', error);
    return 0;
  }
};

// ১৩. মোট অর্ডার রেভিনিউ পাওয়া
export const getTotalRevenue = async () => {
  try {
    const allOrders = await getAllOrders();
    const totalRevenue = allOrders.reduce((sum, order) => {
      return order.status !== 'cancelled' ? sum + order.totalAmount : sum;
    }, 0);
    return totalRevenue;
  } catch (error) {
    console.error('Error calculating revenue:', error);
    return 0;
  }
};

// ১৪. বিক্রয় রিপোর্ট (মাসিক)
export const getMonthlySalesReport = async (year, month) => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const q = query(
      collection(db, 'orders'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<', endDate)
    );
    const querySnapshot = await getDocs(q);

    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      return order.status !== 'cancelled' ? sum + order.totalAmount : sum;
    }, 0);

    return {
      month: month,
      year: year,
      totalOrders: totalOrders,
      totalRevenue: totalRevenue,
      orders: orders
    };
  } catch (error) {
    console.error('Error fetching monthly sales report:', error);
    return null;
  }
};
