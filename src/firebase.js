import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// Using environment variables for security in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBeBYbSh4h340v2EL-eL16zjlhSgTFTz10",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "certi-f1b44.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "certi-f1b44",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "certi-f1b44.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "263800699154",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:263800699154:web:6f5019fe4107ddb3011bcb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C27QVCYGKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { app };
