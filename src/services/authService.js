// সম্পূর্ণ অথেন্টিকেশন সার্ভিস (Dual-mode: Firebase + Local Demo Storage Fallback)
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
import { collection, addDoc, query, where, getDocs, updateDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebaseConfig';

const LOCAL_USER_KEY = 'novashop_current_user';
const LOCAL_USERS_DB = 'novashop_registered_users';

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

// ১. ইউজার রেজিস্ট্রেশন করা
export const registerUser = async (email, password, userName, phone = '') => {
  try {
    if (!email || !password || !userName) {
      return { success: false, error: 'Name, email, and password are required' };
    }

    if (isFirebaseConfigured && auth && db) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: userName });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        userName: userName,
        phone: phone,
        createdAt: new Date().toISOString(),
        role: 'customer',
        address: { street: '', city: '', country: '', zipCode: '' }
      });

      const userData = {
        uid: user.uid,
        email: user.email,
        userName: userName,
        displayName: userName,
        phone: phone,
        avatar: user.photoURL || null
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      return {
        success: true,
        user: userData,
        message: 'Registration successful!'
      };
    } else {
      // Local fallback mode
      const users = getStoredUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Email is already registered. Please login.' };
      }

      const newUser = {
        uid: 'demo-user-' + Date.now(),
        email: email.trim(),
        userName: userName.trim(),
        displayName: userName.trim(),
        phone: phone.trim(),
        password: password, // Note: local demo only
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
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
        message: 'Registration successful! (Demo Storage)'
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'Failed to register account'
    };
  }
};

// ২. ইউজার লগইন করা
export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let firestoreProfile = {};
      try {
        if (db) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            firestoreProfile = userDoc.data();
          }
        }
      } catch (e) {
        console.warn('Could not fetch firestore profile:', e);
      }

      const userData = {
        uid: user.uid,
        email: user.email,
        userName: firestoreProfile.userName || user.displayName || user.email.split('@')[0],
        displayName: user.displayName || firestoreProfile.userName || user.email.split('@')[0],
        phone: firestoreProfile.phone || '',
        avatar: user.photoURL || null
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      return {
        success: true,
        user: userData,
        message: 'Login successful!'
      };
    } else {
      // Local fallback mode
      const users = getStoredUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matched) {
        // Allow fallback default login for demo testing if Alina Putri is requested
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
          return { success: true, user: demoUser, message: 'Logged in as Demo User' };
        }
        return { success: false, error: 'Invalid email or password' };
      }

      const sessionUser = { ...matched };
      delete sessionUser.password;
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));

      return {
        success: true,
        user: sessionUser,
        message: 'Login successful!'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Failed to login'
    };
  }
};

// ৩. গুগল লগইন করা
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
        displayName: user.displayName,
        avatar: user.photoURL
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

      return { success: true, user: userData };
    } else {
      // Demo Google login simulation
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
    return { success: false, error: error.message };
  }
};

// ৪. ইউজার লগআউট করা
export const logoutUser = async () => {
  try {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
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
      displayName: u.displayName,
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

    if (isFirebaseConfigured && db && userId) {
      await updateDoc(doc(db, 'users', userId), data);
    }

    return { success: true, user: updated, message: 'Profile updated successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ৭. পাসওয়ার্ড রিসেট করা
export const resetPassword = async (email) => {
  try {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset link sent to your email.' };
    }
    return { success: true, message: 'Password reset instructions sent (Demo mode).' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ৮. অথ স্টেট চেঞ্জ লিসেনার
export const onAuthChange = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const stored = getCurrentUser();
        callback(stored || {
          uid: user.uid,
          email: user.email,
          userName: user.displayName || user.email.split('@')[0],
          displayName: user.displayName,
          avatar: user.photoURL
        });
      } else {
        const local = getCurrentUser();
        // If not in Firebase but in local storage, pass local
        callback(local);
      }
    });
  } else {
    // In local mode, immediately notify with saved local user
    callback(getCurrentUser());
    return () => {};
  }
};
