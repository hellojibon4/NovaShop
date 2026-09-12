// মেসেজিং সার্ভিস - যোগাযোগ ফর্ম থেকে আসা সব মেসেজ ম্যানেজ করার জন্য
// src/services/messageService.js এ রাখুন

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// ১. নতুন মেসেজ পাঠানো
export const sendMessage = async (messageData) => {
  try {
    // ভ্যালিডেশন
    if (!messageData.name || !messageData.email || !messageData.message) {
      return {
        success: false,
        error: 'সব ফিল্ড পূরণ করুন'
      };
    }

    // স্প্যাম চেক (একই ইমেইল থেকে ৫ মিনিটে একাধিক মেসেজ)
    const recentMessages = await checkSpam(messageData.email);
    if (recentMessages.length >= 3) {
      return {
        success: false,
        error: 'খুব দ্রুত অনেক মেসেজ পাঠাচ্ছেন। কয়েক মিনিট অপেক্ষা করুন।'
      };
    }

    // Firestore এ মেসেজ সংরক্ষণ করা
    const docRef = await addDoc(collection(db, 'messages'), {
      name: messageData.name.trim(),
      email: messageData.email.trim(),
      phone: messageData.phone || '',
      subject: messageData.subject || 'No Subject',
      message: messageData.message.trim(),
      timestamp: new Date(),
      status: 'unread', // unread, read, replied
      isRead: false,
      adminNotes: ''
    });

    // ইমেইল নোটিফিকেশন পাঠানো (Backend এ পাঠাতে হবে)
    await sendEmailNotification(messageData, docRef.id);

    return {
      success: true,
      messageId: docRef.id,
      message: 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করা হবে।'
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: 'মেসেজ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
    };
  }
};

// ২. সব মেসেজ ফেচ করা (Admin এর জন্য)
export const getAllMessages = async () => {
  try {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// ৩. একটি মেসেজ পড়া হিসাবে মার্ক করা
export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      isRead: true,
      status: 'read'
    });

    return {
      success: true,
      message: 'মেসেজ পড়া হিসাবে চিহ্নিত করা হয়েছে'
    };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ৪. মেসেজ ডিলিট করা (Admin)
export const deleteMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, 'messages', messageId));

    return {
      success: true,
      message: 'মেসেজ ডিলিট করা হয়েছে'
    };
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ৫. মেসেজে নোট যোগ করা (Admin)
export const addAdminNote = async (messageId, note) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      adminNotes: note,
      status: 'replied'
    });

    return {
      success: true,
      message: 'নোট যোগ করা হয়েছে'
    };
  } catch (error) {
    console.error('Error adding note:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ৬. পড়া হয়নি এমন মেসেজের সংখ্যা পাওয়া
export const getUnreadMessagesCount = async () => {
  try {
    const q = query(collection(db, 'messages'), where('isRead', '==', false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// ৭. স্প্যাম চেক - গত ৫ মিনিটে একই ইমেইল থেকে আসা মেসেজ
const checkSpam = async (email) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const q = query(
      collection(db, 'messages'),
      where('email', '==', email),
      where('timestamp', '>=', fiveMinutesAgo)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
  } catch (error) {
    console.error('Error checking spam:', error);
    return [];
  }
};

// ৮. ইমেইল নোটিফিকেশন পাঠানো (Backend API কল করা)
const sendEmailNotification = async (messageData, messageId) => {
  try {
    // আপনার backend এ এই এন্ডপয়েন্ট তৈরি করতে হবে
    const response = await fetch('/api/send-message-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone,
        subject: messageData.subject,
        message: messageData.message,
        messageId: messageId
      })
    });

    if (!response.ok) {
      console.error('Failed to send email notification');
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
    // ইমেইল না পাঠালেও মেসেজ সংরক্ষণ হয়েছে, তাই এরর ফেলবো না
  }
};

// ৯. নির্দিষ্ট সময়ের মেসেজ ফিল্টার করা
export const getMessagesByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching messages by date range:', error);
    return [];
  }
};

// ১০. মেসেজ সার্চ করা
export const searchMessages = async (searchTerm) => {
  try {
    const allMessages = await getAllMessages();
    
    return allMessages.filter(msg =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.phone.includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching messages:', error);
    return [];
  }
};
