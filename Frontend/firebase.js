// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb3X-EdQVinSVVmeRCsiVKWQA6g0x1ArI",
  authDomain: "login-6zsluu.firebaseapp.com",
  projectId: "login-6zsluu",
  storageBucket: "login-6zsluu.appspot.com",
  messagingSenderId: "324029620866",
  appId: "1:324029620866:web:82934d440d12d547f84a9b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
