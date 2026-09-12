// Firebase Configuration & Service Initialization
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const getEnvVar = (viteKey, legacyKey) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    return import.meta.env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env && process.env[legacyKey]) {
    return process.env[legacyKey];
  }
  return '';
};

const apiKey = getEnvVar('VITE_FIREBASE_API_KEY', 'REACT_APP_FIREBASE_API_KEY');
const authDomain = getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'REACT_APP_FIREBASE_AUTH_DOMAIN');
const projectId = getEnvVar('VITE_FIREBASE_PROJECT_ID', 'REACT_APP_FIREBASE_PROJECT_ID');
const storageBucket = getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'REACT_APP_FIREBASE_STORAGE_BUCKET');
const messagingSenderId = getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID');
const appId = getEnvVar('VITE_FIREBASE_APP_ID', 'REACT_APP_FIREBASE_APP_ID');

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
          appId
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
