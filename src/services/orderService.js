// অর্ডার ম্যানেজমেন্ট সার্ভিস
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
import { db, isFirebaseConfigured } from '../config/firebaseConfig';

const LOCAL_ORDERS_KEY = 'novashop_user_orders';

const DEFAULT_ORDERS = [
  {
    id: 'NV-82914',
    orderId: 'NV-82914',
    date: 'May 10, 2026',
    total: 413.07,
    totalAmount: 413.07,
    status: 'In Transit',
    statusColor: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
    step: 3,
    items: [
      { id: 'p1', name: 'Air Max 270 React', quantity: 1, qty: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80' },
      { id: 'p2', name: 'Chanel Chance Eau Tendre EDP', quantity: 1, qty: 1, price: 135.00, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=150&auto=format&fit=crop&q=80', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=150&auto=format&fit=crop&q=80' },
      { id: 'p3', name: 'Minimalist Shoulder Bag', quantity: 1, qty: 1, price: 79.00, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=80', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=80' },
    ],
    shippingInfo: {
      fullName: 'Alina Putri',
      name: 'Alina Putri',
      address: '42 Orchid Boulevard, Suite 300',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      email: 'alina.putri@novashop.com'
    }
  },
  {
    id: 'NV-79402',
    orderId: 'NV-79402',
    date: 'April 22, 2026',
    total: 349.99,
    totalAmount: 349.99,
    status: 'Delivered',
    statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
    step: 4,
    items: [
      { id: 'p4', name: 'Sony WH-1000XM5 Wireless Headphones', quantity: 1, qty: 1, price: 349.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80' },
    ],
    shippingInfo: {
      fullName: 'Alina Putri',
      name: 'Alina Putri',
      address: '42 Orchid Boulevard, Suite 300',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      email: 'alina.putri@novashop.com'
    }
  }
];

const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_ORDERS;
  }
};

const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders locally:', err);
  }
};

// ১. নতুন অর্ডার তৈরি করা
export const createOrder = async (userId, cartItems, shippingInfo, paymentMethod, totals = {}) => {
  try {
    const orderId = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = totals.subtotal || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
      subtotal: subtotal,
      shippingCharge: shipping,
      total: totalAmount,
      totalAmount: totalAmount,
      status: 'Processing',
      statusColor: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
      step: 2
    };

    // Save locally first for instant user view
    const localOrders = getStoredOrders();
    const updated = [orderData, ...localOrders];
    saveStoredOrders(updated);

    // Save to Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'orders'), orderData);
      } catch (err) {
        console.warn('Could not save order to Firestore, cached locally:', err.message);
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

// ২. ব্যবহারকারীর সব অর্ডার লোড করা
export const getUserOrders = async (userId) => {
  try {
    let ordersList = [];

    if (isFirebaseConfigured && db && userId) {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          ordersList.push({ id: docSnap.id, ...docSnap.data() });
        });
      } catch (err) {
        console.warn('Firestore query failed, using local orders:', err.message);
      }
    }

    if (!ordersList.length) {
      ordersList = getStoredOrders();
    }

    return {
      success: true,
      orders: ordersList
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
    const local = getStoredOrders().find(o => o.id === orderId || o.orderId === orderId);
    if (local) {
      return { success: true, order: local };
    }

    if (isFirebaseConfigured && db) {
      const docSnap = await getDoc(doc(db, 'orders', orderId));
      if (docSnap.exists()) {
        return { success: true, order: { id: docSnap.id, ...docSnap.data() } };
      }
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
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Cancelled',
        cancelReason: reason
      });
    }

    return { success: true, message: 'Order has been cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
