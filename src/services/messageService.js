// মেসেজিং ও গ্রাহক সাপোর্ট সার্ভিস (Firebase Firestore + Local Storage Sync)
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  setDoc,
  doc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebaseConfig.js';

const LOCAL_MESSAGES_KEY = 'novashop_contact_messages';

const getStoredMessages = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveStoredMessages = (msgs) => {
  try {
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(msgs));
  } catch (err) {
    console.error('Failed to save messages locally:', err);
  }
};

// ১. স্প্যাম ফিল্টারিং (৫ মিনিটে ৪ টির বেশি মেসেজ পাঠানো প্রতিরোধ)
export const checkSpam = async (email) => {
  const msgs = getStoredMessages();
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  return msgs.filter(m => m.email?.toLowerCase() === email.toLowerCase() && m.timestamp > fiveMinAgo);
};

// ২. নতুন মেসেজ পাঠানো এবং Firestore-এ সেভ করা
export const sendMessage = async (messageData) => {
  try {
    if (!messageData.name || !messageData.email || !messageData.message) {
      return {
        success: false,
        error: 'অনুগ্রহ করে নাম, ইমেইল এবং মেসেজ সঠিকভাবে লিখুন।'
      };
    }

    const recent = await checkSpam(messageData.email);
    if (recent.length >= 4) {
      return {
        success: false,
        error: 'আপনি খুব দ্রুত অনেকগুলো মেসেজ পাঠিয়েছেন। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
      };
    }

    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const messageRecord = {
      id: messageId,
      name: messageData.name.trim(),
      email: messageData.email.trim(),
      phone: messageData.phone ? messageData.phone.trim() : '',
      subject: messageData.subject ? messageData.subject.trim() : 'Customer Inquiry',
      message: messageData.message.trim(),
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      status: 'unread'
    };

    // Save locally for instant UI feedback
    const existing = getStoredMessages();
    saveStoredMessages([messageRecord, ...existing]);

    // Save to Firestore Database `messages` collection
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'messages', messageId), messageRecord);
        console.info(`✅ NovaShop: Message ${messageId} saved to Firestore successfully`);
      } catch (firestoreErr) {
        console.warn('Firestore message save note (cached locally):', firestoreErr.message);
      }
    }

    return {
      success: true,
      messageId: messageId,
      message: 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে! আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
    };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return {
      success: false,
      error: error.message || 'মেসেজ পাঠানো সম্ভব হয়নি।'
    };
  }
};

// ৩. ব্যবহারকারীর পূর্বের মেসেজগুলো লোড করা
export const getUserMessages = async (email) => {
  try {
    let firestoreMsgs = [];

    if (isFirebaseConfigured && db && email) {
      try {
        const q = query(
          collection(db, 'messages'),
          where('email', '==', email.trim().toLowerCase())
        );
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
          firestoreMsgs.push(docSnap.data());
        });
      } catch (err) {
        console.warn('Firestore messages query notice:', err.message);
      }
    }

    const all = getStoredMessages();
    const localMatches = all.filter(m => m.email?.toLowerCase() === email.toLowerCase());

    const map = new Map();
    [...firestoreMsgs, ...localMatches].forEach(m => {
      if (m.id && !map.has(m.id)) map.set(m.id, m);
    });

    return {
      success: true,
      messages: Array.from(map.values())
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      messages: []
    };
  }
};
