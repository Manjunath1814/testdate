import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("googleBtn");

googleBtn.addEventListener("click", async () => {

  googleBtn.disabled = true;
  googleBtn.innerHTML = "Signing in...";

  try {

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (!snap.exists()) {

      await setDoc(userRef, {

        uid: user.uid,

        name: user.displayName,

        email: user.email,

        photo: user.photoURL,

        createdAt: serverTimestamp(),

        bio: "",

        age: "",

        gender: "",

        location: ""

      });

    }

    window.location.href = "details.html";

  }

  catch (error) {

    alert(error.message);

    googleBtn.disabled = false;

    googleBtn.innerHTML = "Continue with Google";

  }

});
