// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoCswY9pMUTjaogaj7RljDiq6XyYqa5Z0",
  authDomain: "teacher-student-b71ee.firebaseapp.com",
  projectId: "teacher-student-b71ee",
  storageBucket: "teacher-student-b71ee.appspot.com",
  messagingSenderId: "149187570084",
  appId: "1:149187570084:web:09cfdc40028565a4963931",
  measurementId: "G-Y44NYNHPJQ",
  databaseURL: "https://teacher-student-b71ee-default-rtdb.firebaseio.com" // fixed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);   
export const db = getFirestore(app);    //Firestore instance
export const storage = getStorage(app);
export const firestore = getFirestore(app); 
const analytics = getAnalytics(app);

