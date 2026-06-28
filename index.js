import { auth, db } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const googleBtn = document.getElementById("googleBtn");

const provider = new GoogleAuthProvider();

googleBtn.addEventListener("click", async () => {

    googleBtn.disabled = true;
    googleBtn.innerHTML = "Signing In...";

    try{

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        const userRef = doc(db,"users",user.uid);

        const snap = await getDoc(userRef);

        if(!snap.exists()){

            await setDoc(userRef,{

                uid:user.uid,

                email:user.email,

                name:user.displayName,

                photo:user.photoURL,

                profileCompleted:false,

                createdAt:serverTimestamp()

            });

            window.location.href="details.html";

            return;

        }

        const data = snap.data();

        if(data.profileCompleted){

            window.location.href="home.html";

        }else{

            window.location.href="details.html";

        }

    }

    catch(error){

        console.log(error);

        alert(error.message);

        googleBtn.disabled=false;

        googleBtn.innerHTML="Continue with Google";

    }

});
