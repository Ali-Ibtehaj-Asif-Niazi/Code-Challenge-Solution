// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { /* connectFirestoreEmulator, */ getFirestore } from 'firebase/firestore';
import { /* connectStorageEmulator, */ getStorage } from 'firebase/storage';
// import { isDev } from '../isDev';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAobEOSPsXyKwYNZzyRVj1BkPmwDDvC1tM",
    authDomain: "challenge1-ffa58.firebaseapp.com",
    projectId: "challenge1-ffa58",
    storageBucket: "challenge1-ffa58.appspot.com",
    messagingSenderId: "729217842448",
    appId: "1:729217842448:web:f66c358b10c55249863995"
  };

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const baseBucketName = 'challenge1-ffa58';

/* if (isDev) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
} */
