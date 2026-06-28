import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK8VWsNWnDFEHQa-tSY7rFxQz6zbIKVEo",
  authDomain: "testdate-64ee3.firebaseapp.com",
  projectId: "testdate-64ee3",
  storageBucket: "testdate-64ee3.firebasestorage.app",
  messagingSenderId: "212768048889",
  appId: "1:212768048889:web:468dc2026122b7b172c428",
  measurementId: "G-H7B0670KW0"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export { app, auth, db, storage };
