// api.js - Firebase initialization
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6I_Ut8jPZ15VebkIDuJjs5cWVpRPCMAQ",
  authDomain: "frameitdb.firebaseapp.com",
  databaseURL: "https://frameitdb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "frameitdb",
  storageBucket: "frameitdb.firebasestorage.app",
  messagingSenderId: "520472828811",
  appId: "1:520472828811:web:4212c0e11593f6cc34ed8e",
  measurementId: "G-8VV0L0XV1P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
