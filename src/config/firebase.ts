// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeMIrP7AUt96F5b4sYaJT1thbxLL84XC0",
    authDomain: "vocabulary-app-61c25.firebaseapp.com",
    projectId: "vocabulary-app-61c25",
    storageBucket: "vocabulary-app-61c25.firebasestorage.app",
    messagingSenderId: "1054945162051",
    appId: "1:1054945162051:web:bd7a37f7bdecf17e35f5f6",
    measurementId: "G-QVCNS3HKBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();