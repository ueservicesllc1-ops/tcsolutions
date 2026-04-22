import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVKyHkwMzGWs9U-0mPAwXde4QEST8OIvQ",
  authDomain: "tcsolutions-511d0.firebaseapp.com",
  projectId: "tcsolutions-511d0",
  storageBucket: "tcsolutions-511d0.firebasestorage.app",
  messagingSenderId: "28828466758",
  appId: "1:28828466758:web:3053858d817e66678d5447",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
