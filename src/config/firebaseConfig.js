// Firebase Configuration & Service Initialization
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Static import.meta.env access is required by Vite for production bundling
const apiKey = import.meta.env?.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_API_KEY : '') || '';
const authDomain = import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || (typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_AUTH_DOMAIN : '') || '';
const projectId = import.meta.env?.VITE_FIREBASE_PROJECT_ID || (typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_PROJECT_ID : '') || '';
const storageBucket = import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || (typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_STORAGE_BUCKET : '') || '';
const messagingSenderId = import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || (typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID : '') || '';
const appId = import.meta.env?.VITE_FIREBASE_APP_ID || (typeof process !== 'undefined' ? process.env?.REACT_APP_FIREBASE_APP_ID : '') || '';
const measurementId = import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || '';

export const isFirebaseConfigured = Boolean(
  apiKey && 
  apiKey !== 'your_api_key_here' && 
  projectId && 
  projectId !== 'your_project_id_here'
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length
      ? initializeApp({
          apiKey,
          authDomain,
          projectId,
          storageBucket,
          messagingSenderId,
          appId,
          ...(measurementId ? { measurementId } : {})
        })
      : getApp();

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.info('✅ NovaShop: Firebase successfully connected to project:', projectId);
  } catch (error) {
    console.warn('⚠️ NovaShop: Firebase initialization error, falling back to local mode:', error.message);
  }
} else {
  console.info('ℹ️ NovaShop: Running in Local Demo Mode (Configure .env with your Firebase keys to connect live database)');
}

export { app, auth, db, storage };
export default app;
