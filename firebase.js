import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpFRUQDq8aArXX0Hr1LAFqyYFbR8o3qWQ",
  authDomain: "smart-ai-hospital-system.firebaseapp.com",
  projectId: "smart-ai-hospital-system",
  storageBucket: "smart-ai-hospital-system.firebasestorage.app",
  messagingSenderId: "144108294699",
  appId: "1:144108294699:web:2c12fee078f0b95f95506e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
