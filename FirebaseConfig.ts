// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqXad_YK9TYYJJTMkh0Y2UgV7Muv0c-iI",
  authDomain: "piensarapido-362f2.firebaseapp.com",
  projectId: "piensarapido-362f2",
  storageBucket: "piensarapido-362f2.firebasestorage.app",
  messagingSenderId: "191044859531",
  appId: "1:191044859531:web:30e4e3a3eb89fe2684c68e"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);