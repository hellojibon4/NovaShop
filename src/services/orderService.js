// সম্পূর্ণ অর্ডার ম্যানেজমেন্ট সার্ভিস (Firebase Firestore + Local Storage Sync)
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebaseConfig.js';

const LOCAL_ORDERS_KEY = 'novashop_user_orders';

export const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders locally:', err);
  }
};

// ১. নতুন অর্ডার তৈরি ও Firestore-এ সংরক্ষণ
export const createOrder = async (userId, cartItems, shippingInfo, paymentMethod, totals = {}) => {
  try {
    const orderId = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = totals.subtotal || cartItems.reduce((sum, item) => {
      const p = item.product || item;
      return sum + ((p.price || 0) * (item.quantity || 1));
    }, 0);
    const shipping = totals.shipping !== undefined ? totals.shipping : (subtotal > 150 ? 0 : 15);
    const totalAmount = totals.total || (subtotal + shipping);

    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const orderData = {
      id: orderId,
      orderId: orderId,
      userId: userId || 'guest',
      date: formattedDate,
      createdAt: new Date().toISOString(),
      items: cartItems.map(item => {
        const prod = item.product || item;
        return {
          id: prod.id || item.id || 'item',
          productId: prod.id || item.id || 'item',
          name: prod.name || item.name || 'Product',
          price: prod.price || item.price || 0,
          quantity: item.quantity || 1,
          qty: item.quantity || 1,
          image: prod.image || item.image || item.img || '',
          img: prod.image || item.image || item.img || ''
        };
      }),
      shippingInfo: {
        fullName: shippingInfo.fullName || shippingInfo.name || '',
        name: shippingInfo.fullName || shippingInfo.name || '',
        email: shippingInfo.email || '',
        phone: shippingInfo.phone || '',
        address: shippingInfo.address || '',
        city: shippingInfo.city || '',
        state: shippingInfo.state || '',
        zip: shippingInfo.zip || shippingInfo.postalCode || ''
      },
      paymentMethod: paymentMethod || 'card',
      subtotal: Number(subtotal),
      shippingCharge: Number(shipping),
      total: Number(totalAmount),
      totalAmount: Number(totalAmount),
      status: 'Processing',
      statusColor: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
      step: 2
    };

    // Save locally first for instant, guaranteed offline/online UI sync
    const localOrders = getStoredOrders();
    const updated = [orderData, ...localOrders.filter(o => o.id !== orderId)];
    saveStoredOrders(updated);

    // Save to Firestore Database
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', orderId), orderData);
        console.info(`✅ NovaShop: Order #${orderId} saved to Firestore successfully`);
      } catch (err) {
        console.warn('Firestore order save note (cached locally):', err.message);
      }
    }

    return {
      success: true,
      orderId: orderId,
      order: orderData,
      message: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!'
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || 'অর্ডার প্রক্রিয়া করা যায়নি।'
    };
  }
};

// ২. ব্যবহারকারীর সব অর্ডার লোড করা (Firestore + Local fallback)
export const getUserOrders = async (userId) => {
  try {
    let firestoreOrders = [];

    if (isFirebaseConfigured && db && userId && userId !== 'guest') {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          firestoreOrders.push({ id: docSnap.id, ...docSnap.data() });
        });
      } catch (err) {
        console.warn('Firestore query notice, using local orders:', err.message);
      }
    }

    const local = getStoredOrders();
    const relevantLocal = (userId && userId !== 'guest')
      ? local.filter(ord => ord.userId === userId)
      : local;
    
    // Merge Firestore orders with local orders (avoiding duplicates)
    const orderMap = new Map();
    [...firestoreOrders, ...relevantLocal].forEach(ord => {
      const key = ord.id || ord.orderId;
      if (key && !orderMap.has(key)) {
        orderMap.set(key, ord);
      }
    });

    const combined = Array.from(orderMap.values()).sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });

    return {
      success: true,
      orders: combined.length ? combined : local
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      orders: getStoredOrders(),
      error: error.message
    };
  }
};

// ৩. নির্দিষ্ট অর্ডারের তথ্য দেখা
export const getOrderById = async (orderId) => {
  try {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'orders', orderId));
        if (docSnap.exists()) {
          return { success: true, order: { id: docSnap.id, ...docSnap.data() } };
        }
      } catch (e) {
        console.warn('Firestore getOrderById error:', e.message);
      }
    }

    const local = getStoredOrders().find(o => o.id === orderId || o.orderId === orderId);
    if (local) {
      return { success: true, order: local };
    }

    return { success: false, error: 'Order not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ৪. অর্ডার বাতিল করা
export const cancelOrder = async (orderId, reason = '') => {
  try {
    const localOrders = getStoredOrders();
    const updated = localOrders.map(ord => {
      if (ord.id === orderId || ord.orderId === orderId) {
        return {
          ...ord,
          status: 'Cancelled',
          statusColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
          step: 0,
          cancelReason: reason
        };
      }
      return ord;
    });
    saveStoredOrders(updated);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Cancelled',
          cancelReason: reason
        });
      } catch (err) {
        console.warn('Firestore order cancel notice:', err.message);
      }
    }

    return { success: true, message: 'অর্ডার সফলভাবে বাতিল করা হয়েছে' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
