import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOZ90OtJyPyQdygNRzITh9QgQEGl8R2KE",
    authDomain: "blog-f1cea.firebaseapp.com",
    projectId: "blog-f1cea",
    storageBucket: "blog-f1cea.appspot.com",
    messagingSenderId: "700224118800",
    appId: "1:700224118800:web:5f9832a0460c443d452a95",
    measurementId: "G-YTPB8JFN5V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();