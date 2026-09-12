// মেসেজিং সার্ভিস - গ্রাহক সাপোর্ট ও যোগাযোগ ফর্ম ম্যানেজমেন্ট
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebaseConfig';

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

// ১. স্প্যাম চেক
export const checkSpam = async (email) => {
  const msgs = getStoredMessages();
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  return msgs.filter(m => m.email.toLowerCase() === email.toLowerCase() && m.timestamp > fiveMinAgo);
};

// ২. নতুন মেসেজ পাঠানো
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
        error: 'আপনি খুব দ্রুত অনেকগুলো মেসেজ পাঠিয়েছেন। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।'
      };
    }

    const messageRecord = {
      id: 'msg-' + Date.now(),
      name: messageData.name.trim(),
      email: messageData.email.trim(),
      phone: messageData.phone ? messageData.phone.trim() : '',
      subject: messageData.subject ? messageData.subject.trim() : 'Customer Inquiry',
      message: messageData.message.trim(),
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleString(),
      status: 'unread'
    };

    // Save locally
    const existing = getStoredMessages();
    saveStoredMessages([messageRecord, ...existing]);

    // Save to Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'messages'), {
          ...messageRecord,
          createdAt: new Date()
        });
        messageRecord.firestoreId = docRef.id;
      } catch (e) {
        console.warn('Firestore message save failed, cached locally:', e.message);
      }
    }

    return {
      success: true,
      messageId: messageRecord.id,
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

// ৩. ব্যবহারকারীর পূর্বের মেসেজগুলো দেখা
export const getUserMessages = async (email) => {
  try {
    const all = getStoredMessages();
    return {
      success: true,
      messages: all.filter(m => m.email.toLowerCase() === email.toLowerCase())
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      messages: []
    };
  }
};
