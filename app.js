import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();

document.getElementById("googleBtn").onclick = async () => {

    try{

        const result = await signInWithPopup(auth,provider);

        const user = result.user;

        await setDoc(doc(db,"users",user.uid),{

            uid:user.uid,

            name:user.displayName,

            email:user.email,

            photo:user.photoURL,

            createdAt:new Date()

        },{merge:true});

        location.href="home.html";

    }

    catch(err){

        alert(err.message);

    }

}
