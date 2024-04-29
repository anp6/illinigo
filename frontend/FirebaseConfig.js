
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// import {
//   FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID
// } from '@env';

const FIREBASE_API_KEY="AIzaSyD0Ap1uUFHhCRHMt2_531kVOg7FCgREj3M"
const FIREBASE_AUTH_DOMAIN="illinigo-d848b.firebaseapp.com"
const FIREBASE_PROJECT_ID="illinigo-d848b"
const FIREBASE_STORAGE_BUCKET="illinigo-d848b.appspot.com"
const FIREBASE_MESSAGING_SENDER_ID="1098672997563"
const FIREBASE_APP_ID="1:1098672997563:web:bf8f143175026b3bcc559e"

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);