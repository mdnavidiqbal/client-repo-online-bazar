// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMD43iziqXohhpwH7Ypjy03dzv6TY1Yvc",
  authDomain: "online-bazaar-2a642.firebaseapp.com",
  projectId: "online-bazaar-2a642",
  storageBucket: "online-bazaar-2a642.firebasestorage.app",
  messagingSenderId: "882086920292",
  appId: "1:882086920292:web:4ed3361cdacfdc89795f71"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
