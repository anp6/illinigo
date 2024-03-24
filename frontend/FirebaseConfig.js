// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0Ap1uUFHhCRHMt2_531kVOg7FCgREj3M",
  authDomain: "illinigo-d848b.firebaseapp.com",
  projectId: "illinigo-d848b",
  storageBucket: "illinigo-d848b.appspot.com",
  messagingSenderId: "1098672997563",
  appId: "1:1098672997563:web:bf8f143175026b3bcc559e"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);