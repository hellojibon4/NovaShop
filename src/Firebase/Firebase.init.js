// Firebase initialized instance export (safely referencing environment configuration)
import app, { auth, db, storage, isFirebaseConfigured } from '../config/firebaseConfig';

export { auth, db, storage, isFirebaseConfigured };
export default app;
