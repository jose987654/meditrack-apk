// import firebase
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import { initializeApp } from '@react-native-firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import 'firebase/firestore';
// import auth from '@react-native-firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

import AsyncStorage from "@react-native-async-storage/async-storage";
const {
  initializeAppCheck,
  ReCaptchaV3Provider,
} = require('firebase/app-check');

export const firebaseConfig = {
  apiKey: "AIzaSyAUjDexKWECh3CxQX9KQzR_xqA1fI5223U",
  authDomain: "meditrack-solutions.firebaseapp.com",
  projectId: "meditrack-solutions",
  storageBucket: "meditrack-solutions.appspot.com",
  messagingSenderId: "141308913648",
  appId: "1:141308913648:web:ed131aeee9973a20b75f35",
  measurementId: "G-K08Z9D6DCB"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('9876543210'),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firebase storage reference
const storage = getStorage(app);

//firestore reference getAuth
const db = getFirestore(app);
// const db = app.firestore();

const authInstance = getAuth(app);

// getDocs(collection(db, 'hospitals'))
//   .then((snapshot) => {
//     console.log('Connection exists, fetched documents:', snapshot.docs);
//     snapshot.docs.forEach((doc) => {
//       console.log('Document ID:', doc.id);
//       console.log('Document data:', doc.data());
//     });
//   })
//   .catch((error) => {
//     console.error('Error fetching documents:', error);
//   });

export { storage, db, app, authInstance,auth };
