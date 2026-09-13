import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebaseConfig.js';

const LOCAL_ADDRESSES_KEY = 'novashop_user_addresses';

export const DEFAULT_DEMO_ADDRESSES = [
  {
    id: 'addr-1',
    type: 'Home',
    name: 'Alina Putri',
    phone: '+1 (555) 234-5678',
    street: '42 Orchid Boulevard, Suite 300',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'Office',
    name: 'Alina Putri',
    phone: '+1 (555) 876-5432',
    street: '500 Howard Street, Fl 14',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    isDefault: false
  }
];

export const getStoredAddressesLocally = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ADDRESSES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveAddressesLocally = (addresses) => {
  try {
    localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(addresses));
  } catch (e) {
    console.warn('Failed to save addresses locally:', e.message);
  }
};

// ১. ব্যবহারকারীর সংরক্ষিত ঠিকানাগুলো লোড করা (Firestore + Local fallback)
export const getUserAddresses = async (userId) => {
  try {
    if (isFirebaseConfigured && db && userId && userId !== 'guest' && !userId.startsWith('demo-')) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (Array.isArray(data.addresses) && data.addresses.length > 0) {
            saveAddressesLocally(data.addresses);
            return { success: true, addresses: data.addresses };
          }
        }
      } catch (err) {
        console.warn('Firestore address fetch notice:', err.message);
      }
    }

    const local = getStoredAddressesLocally();
    if (local && local.length > 0) {
      return { success: true, addresses: local };
    }

    return { success: true, addresses: [] };
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return { success: false, addresses: [], error: error.message };
  }
};

// ২. ব্যবহারকারীর সব ঠিকানা আপডেট বা সেভ করা
export const saveUserAddresses = async (userId, addresses) => {
  try {
    saveAddressesLocally(addresses);

    if (isFirebaseConfigured && db && userId && userId !== 'guest' && !userId.startsWith('demo-')) {
      try {
        await setDoc(doc(db, 'users', userId), { addresses }, { merge: true });
        console.info(`✅ NovaShop: Addresses for user ${userId} synced to Firestore`);
      } catch (err) {
        console.warn('Firestore address save notice:', err.message);
      }
    }

    return { success: true, addresses };
  } catch (error) {
    console.error('Error saving addresses:', error);
    return { success: false, error: error.message };
  }
};
