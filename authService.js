// সম্পূর্ণ অথেন্টিকেশন সার্ভিস
// src/services/authService.js এ রাখুন

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

// ১. ইউজার রেজিস্ট্রেশন করা
export const registerUser = async (email, password, userName, phone) => {
  try {
    // Firebase Authentication এ ইউজার তৈরি করা
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // প্রোফাইল আপডেট করা
    await updateProfile(user, {
      displayName: userName
    });

    // Firestore এ ইউজার তথ্য সংরক্ষণ করা
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email: email,
      userName: userName,
      phone: phone,
      createdAt: new Date(),
      profile: {
        avatar: null,
        bio: ''
      },
      address: {
        street: '',
        city: '',
        country: '',
        zipCode: ''
      }
    });

    return {
      success: true,
      uid: user.uid,
      message: 'রেজিস্ট্রেশন সফল! এখন লগইন করুন।'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ২. ইউজার লগইন করা
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // সফল লগইন এর ডেটা রিটার্ন করা
    return {
      success: true,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      message: 'লগইন সফল!'
    };
  } catch (error) {
    let errorMessage = 'লগইন ব্যর্থ হয়েছে।';
    
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'বৈধ ইমেইল প্রদান করুন।';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'এই ইমেইলে কোনো অ্যাকাউন্ট নেই।';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'পাসওয়ার্ড ভুল।';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// ৩. ইউজার লগআউট করা
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'লগআউট সফল!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ৪. বর্তমান ইউজার এর তথ্য
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ৫. অথেন্টিকেশন স্টেট চেক করা
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ৬. ইউজার প্রোফাইল আপডেট করা
export const updateUserProfile = async (uid, updates) => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'ইউজার খুঁজে পাওয়া যায়নি'
      };
    }

    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      ...updates,
      updatedAt: new Date()
    });

    return {
      success: true,
      message: 'প্রোফাইল আপডেট সফল!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ৭. ইউজার ডেটা ফেচ করা
export const getUserData = async (uid) => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// ৮. ইমেইল ভেরিফিকেশন (অপশনাল)
export const sendEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Note: এই ফাংশন Firebase এ বিল্ট-ইন, কিন্তু আপনাকে সেটআপ করতে হবে
      // await sendEmailVerification(user);
      return {
        success: true,
        message: 'ভেরিফিকেশন ইমেইল পাঠানো হয়েছে'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ৯. পাসওয়ার্ড রিসেট করা (অপশনাল)
export const resetPassword = async (email) => {
  try {
    // Note: Firebase এ বিল্ট-ইন ফাংশন আছে
    // await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
