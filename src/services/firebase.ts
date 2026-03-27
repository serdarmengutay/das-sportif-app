import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD6N8MYxknxfgipKculTL5emjEEeXYW1bQ",
  authDomain: "das-sportif-a.firebaseapp.com",
  projectId: "das-sportif-a",
  storageBucket: "das-sportif-a.firebasestorage.app",
  messagingSenderId: "838797577085",
  appId: "1:838797577085:web:c47015fccda666310eda14",
  measurementId: "G-EFN3S615EH",
};

// Firebase'i yalnızca bir kez başlat
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth (React Native persistence ile)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore
export const firestore = getFirestore(app);

export const db = getFirestore(app);

export default app;
