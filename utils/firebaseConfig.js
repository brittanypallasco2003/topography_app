// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOdChbSAGxvO-oEfN0hVQ7Hbi2TnfvVfQ",
  authDomain: "proyecto-final-topography.firebaseapp.com",
  projectId: "proyecto-final-topography",
  storageBucket: "proyecto-final-topography.appspot.com",
  messagingSenderId: "60472989572",
  appId: "1:60472989572:web:961d05e4635ea946a26fd1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
