// সম্পূর্ণ অথেন্টিকেশন সার্ভিস (Firebase Authentication + Firestore + Local Sync)
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, isFirebaseConfigured } from '../config/firebaseConfig.js';

const LOCAL_USER_KEY = 'novashop_current_user';
const LOCAL_USERS_DB = 'novashop_registered_users';

// Firebase Auth Error Translator
export const getFriendlyErrorMessage = (error) => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে। অনুগ্রহ করে লগইন করুন। (Email is already registered)';
    case 'auth/invalid-email':
      return 'ইমেইল অ্যাড্রেসটি সঠিক নয়। (Invalid email address)';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। (Incorrect email or password)';
    case 'auth/weak-password':
      return 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters)';
    case 'auth/popup-closed-by-user':
      return 'গুগল সাইন-ইন উইন্ডো বন্ধ করা হয়েছে। (Google popup closed)';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট কানেকশন চেক করুন। (Network request failed)';
    case 'auth/too-many-requests':
      return 'অনেকবার চেষ্টা করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন। (Too many attempts. Try again later)';
    default:
      return error?.message || 'লগইন বা রেজিস্ট্রেশন সম্পন্ন করা যায়নি।';
  }
};

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_DB) || '[]');
  } catch {
    return [];
  }
};

const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(LOCAL_USERS_DB, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users locally:', err);
  }
};

// ১. ইউজার রেজিস্ট্রেশন করা (Firebase Auth + Firestore)
export const registerUser = async (email, password, userName, phone = '') => {
  try {
    if (!email || !password || !userName) {
      return { success: false, error: 'নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক।' };
    }

    if (isFirebaseConfigured && auth) {
      // 1. Create user in Firebase Authentication (only blocking security step)
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const cleanName = userName.trim();
      const cleanPhone = phone ? phone.trim() : '';

      const userData = {
        uid: user.uid,
        email: user.email,
        name: cleanName,
        userName: cleanName,
        displayName: cleanName,
        phone: cleanPhone,
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=7C3AED&color=fff`,
        createdAt: new Date().toISOString(),
        role: 'customer'
      };

      // Save locally immediately for instant session readiness
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      // 2. Perform profile update and Firestore document creation asynchronously in background
      // This eliminates 3-5 seconds of network blocking latency!
      Promise.allSettled([
        updateProfile(user, { displayName: cleanName }).catch((err) =>
          console.warn('Profile name update notice:', err.message)
        ),
        db
          ? setDoc(
              doc(db, 'users', user.uid),
              {
                uid: user.uid,
                name: cleanName,
                email: email.trim(),
                phone: cleanPhone,
                createdAt: new Date().toISOString(),
                role: 'customer',
                userName: cleanName,
                displayName: cleanName,
                address: { street: '', city: '', country: '', zipCode: '' }
              },
              { merge: true }
            ).catch((err) => console.warn('Firestore user doc sync notice:', err.message))
          : Promise.resolve()
      ]);

      return {
        success: true,
        user: userData,
        message: 'রেজিস্ট্রেশন সফল হয়েছে!'
      };
    } else {
      // Local fallback mode (if Firebase not configured)
      const users = getStoredUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে। অনুগ্রহ করে লগইন করুন।' };
      }

      const newUser = {
        uid: 'demo-user-' + Date.now(),
        email: email.trim(),
        userName: userName.trim(),
        displayName: userName.trim(),
        phone: phone.trim(),
        password: password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7C3AED&color=fff`,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveStoredUsers(users);

      const sessionUser = { ...newUser };
      delete sessionUser.password;
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));

      return {
        success: true,
        user: sessionUser,
        message: 'রেজিস্ট্রেশন সফল হয়েছে!'
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error)
    };
  }
};

// ২. ইউজার লগইন করা (Firebase Auth + Firestore Profile fetch)
export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'ইমেইল এবং পাসওয়ার্ড আবশ্যক।' };
    }

    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      const cachedUser = getCurrentUser();
      const displayName =
        user.displayName ||
        (cachedUser?.uid === user.uid ? (cachedUser.name || cachedUser.displayName) : '') ||
        user.email.split('@')[0];

      const userData = {
        uid: user.uid,
        email: user.email,
        name: displayName,
        userName: displayName,
        displayName: displayName,
        phone: (cachedUser?.uid === user.uid ? cachedUser.phone : '') || user.phoneNumber || '',
        country: (cachedUser?.uid === user.uid ? cachedUser.country : '') || '',
        avatar:
          user.photoURL ||
          (cachedUser?.uid === user.uid ? cachedUser.avatar : null) ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7C3AED&color=fff`
      };

      // Save locally immediately so UI can update in milliseconds
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      // Asynchronously fetch extra Firestore profile fields in background (NON-BLOCKING)
      if (db) {
        getDoc(doc(db, 'users', user.uid))
          .then((userDoc) => {
            if (userDoc.exists()) {
              const data = userDoc.data();
              const updatedName = data.name || data.displayName || data.userName || displayName;
              const enriched = {
                ...userData,
                name: updatedName,
                displayName: updatedName,
                userName: updatedName,
                phone: data.phone || userData.phone,
                country: data.country || userData.country,
                avatar: data.avatar || userData.avatar
              };
              localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(enriched));
            }
          })
          .catch((e) => console.warn('Background profile enrichment notice:', e.message));
      }

      return {
        success: true,
        user: userData,
        message: 'লগইন সফল হয়েছে!'
      };
    } else {
      // Local fallback mode
      const users = getStoredUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matched) {
        if (email.toLowerCase() === 'alina.putri@novashop.com' || email.toLowerCase() === 'demo@novashop.com') {
          const demoUser = {
            uid: 'demo-alina-1',
            email: email,
            userName: 'Alina Putri',
            displayName: 'Alina Putri',
            phone: '+1 (555) 234-5678',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
          };
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
          return { success: true, user: demoUser, message: 'লগইন সফল হয়েছে!' };
        }
        return { success: false, error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' };
      }

      const sessionUser = { ...matched };
      delete sessionUser.password;
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));

      return {
        success: true,
        user: sessionUser,
        message: 'লগইন সফল হয়েছে!'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error)
    };
  }
};

// ৩. গুগল লগইন করা (Firebase Auth Google Popup + Firestore Sync)
export const loginWithGoogle = async () => {
  try {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        userName: user.displayName || user.email.split('@')[0],
        displayName: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL,
        phone: user.phoneNumber || ''
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      // Sync user doc to Firestore in the background (NON-BLOCKING)
      if (db) {
        setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            name: userData.displayName,
            displayName: userData.displayName,
            userName: userData.userName,
            email: user.email,
            phone: user.phoneNumber || '',
            avatar: user.photoURL,
            role: 'customer',
            lastLoginAt: new Date().toISOString()
          },
          { merge: true }
        ).catch((err) => console.warn('Firestore Google user doc sync notice:', err.message));
      }

      return { success: true, user: userData };
    } else {
      const demoUser = {
        uid: 'google-demo-' + Date.now(),
        email: 'google.user@novashop.com',
        userName: 'Google Shopper',
        displayName: 'Google Shopper',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
};

// ৪. ইউজার লগআউট করা
export const logoutUser = async () => {
  try {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
  } catch (error) {
    console.warn('Firebase signOut notice:', error.message);
  } finally {
    // 1. Purge active user, session, cart, wishlist, addresses, orders, and coupon data
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
      localStorage.removeItem('novashop_cart');
      localStorage.removeItem('novashop_wishlist');
      localStorage.removeItem('novashop_coupon');
      localStorage.removeItem('novashop_user_addresses');
      localStorage.removeItem('novashop_user_orders');
    } catch (e) {
      console.warn('localStorage clear warning:', e.message);
    }

    // 2. Clear all sessionStorage
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }

    // 3. Broadcast global logout event to all in-memory context stores
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('novashop:logout'));
    }
  }
  return { success: true, message: 'সফলভাবে লগআউট হয়েছে' };
};

// ৫. বর্তমান ইউজার পাওয়া
export const getCurrentUser = () => {
  try {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }

  if (isFirebaseConfigured && auth && auth.currentUser) {
    const u = auth.currentUser;
    return {
      uid: u.uid,
      email: u.email,
      userName: u.displayName || u.email.split('@')[0],
      displayName: u.displayName || u.email.split('@')[0],
      avatar: u.photoURL
    };
  }

  return null;
};

// ৬. প্রোফাইল আপডেট করা
export const updateUserProfile = async (userId, data) => {
  try {
    const current = getCurrentUser() || {};
    const updated = { ...current, ...data };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured && auth && auth.currentUser && data.displayName) {
      try {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
      } catch (e) {
        console.warn('Auth displayName update warning:', e.message);
      }
    }

    if (isFirebaseConfigured && db && userId) {
      try {
        await setDoc(doc(db, 'users', userId), data, { merge: true });
      } catch (err) {
        console.warn('Firestore profile update warning:', err.message);
      }
    }

    return { success: true, user: updated, message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ৭. পাসওয়ার্ড রিসেট করা
export const resetPassword = async (email) => {
  try {
    if (!email) return { success: false, error: 'অনুগ্রহ করে আপনার ইমেইল লিখুন।' };
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।' };
    }
    return { success: true, message: 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।' };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
};

// ৮. অথ স্টেট চেঞ্জ লিসেনার
export const onAuthChange = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cached = getCurrentUser();
        const baseName =
          user.displayName ||
          (cached?.uid === user.uid ? (cached.name || cached.displayName) : '') ||
          user.email.split('@')[0];

        // 1. Immediately provide authenticated user state to React so UI loads with 0ms delay
        const immediateUser = (cached && cached.uid === user.uid)
          ? cached
          : {
              uid: user.uid,
              email: user.email,
              name: baseName,
              userName: baseName,
              displayName: baseName,
              phone: user.phoneNumber || '',
              country: '',
              role: 'customer',
              createdAt: user.metadata?.creationTime || new Date().toISOString(),
              creationTime: user.metadata?.creationTime || new Date().toISOString(),
              avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(baseName)}&background=7C3AED&color=fff`
            };

        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(immediateUser));
        callback(immediateUser);

        // 2. Asynchronously enrich user profile from Firestore in background (NON-BLOCKING)
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const profile = userDoc.data();
              const finalName = profile.name || profile.displayName || profile.userName || baseName;
              const enrichedUser = {
                ...immediateUser,
                name: finalName,
                userName: finalName,
                displayName: finalName,
                phone: profile.phone || immediateUser.phone || '',
                country: profile.country || immediateUser.country || '',
                role: profile.role || immediateUser.role || 'customer',
                avatar: profile.avatar || profile.photoURL || immediateUser.avatar
              };
              localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(enrichedUser));
              callback(enrichedUser);
            }
          } catch (err) {
            console.warn('Background Firestore profile sync note:', err.message);
          }
        }
      } else {
        // Firebase auth user is null -> Clear local storage & notify callback with null
        localStorage.removeItem(LOCAL_USER_KEY);
        callback(null);
      }
    });
  } else {
    callback(getCurrentUser());
    return () => {};
  }
};

// ৯. ইউজারের প্রোফাইল ছবি Firebase Storage-এ আপলোড করা
// Image path: profile-images/{uid}/profile.jpg
export const uploadProfileImage = async (userId, file) => {
  try {
    if (!userId) return { success: false, error: 'User ID is required' };
    if (!file) return { success: false, error: 'No image file provided' };

    let downloadURL = '';

    if (isFirebaseConfigured && storage) {
      // Requested exact storage path: profile-images/{uid}/profile.jpg
      const imageRef = ref(storage, `profile-images/${userId}/profile.jpg`);
      const snapshot = await uploadBytes(imageRef, file, {
        contentType: file.type || 'image/jpeg'
      });
      downloadURL = await getDownloadURL(snapshot.ref);
    } else {
      // Local fallback blob URL
      downloadURL = URL.createObjectURL(file);
    }

    // 1. Update Firebase Auth user photoURL
    if (isFirebaseConfigured && auth && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
      } catch (e) {
        console.warn('Auth photoURL update warning:', e.message);
      }
    }

    // 2. Update Firestore users/{userId}
    if (isFirebaseConfigured && db && userId) {
      try {
        await setDoc(doc(db, 'users', userId), {
          avatar: downloadURL,
          photoURL: downloadURL,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore avatar update warning:', err.message);
      }
    }

    // 3. Update local session storage
    const current = getCurrentUser() || {};
    const updated = {
      ...current,
      avatar: downloadURL,
      photoURL: downloadURL
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    return {
      success: true,
      avatar: downloadURL,
      photoURL: downloadURL,
      user: updated,
      message: 'Profile image updated successfully!'
    };
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload profile image'
    };
  }
};

