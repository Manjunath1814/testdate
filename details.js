import { auth, db, storage } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const form = document.getElementById("profileForm");

const imageInput = document.getElementById("profileImage");

const preview = document.getElementById("previewImage");

const nameInput = document.getElementById("name");

const locationBtn = document.getElementById("locationBtn");

const locationText = document.getElementById("locationText");

const continueBtn = document.getElementById("continueBtn");

let currentUser = null;

let latitude = "";

let longitude = "";

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(file){

        preview.src = URL.createObjectURL(file);

    }

});

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href="index.html";

        return;

    }

    currentUser=user;

    nameInput.value=user.displayName || "";

});

locationBtn.addEventListener("click",()=>{

    if(!navigator.geolocation){

        alert("Geolocation not supported");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        (position)=>{

            latitude=position.coords.latitude;

            longitude=position.coords.longitude;

            locationText.innerHTML="✅ Location Added";

        },

        ()=>{

            alert("Location permission denied");

        }

    );

});

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    if(!currentUser){

        alert("Please login again");

        return;

    }

    const gender=document.querySelector("input[name='gender']:checked");

    if(!gender){

        alert("Select Gender");

        return;

    }

    const file=imageInput.files[0];

    if(!file){

        alert("Upload Profile Picture");

        return;

    }

    continueBtn.disabled=true;

    continueBtn.innerHTML="Saving...";

    try{

        const storageRef=ref(storage,"profiles/"+currentUser.uid+".jpg");

        await uploadBytes(storageRef,file);

        const photoURL=await getDownloadURL(storageRef);

        await setDoc(doc(db,"users",currentUser.uid),{

            uid:currentUser.uid,

            name:nameInput.value,

            email:currentUser.email,

            photo:photoURL,

            gender:gender.value,

            dob:document.getElementById("dob").value,

            lookingFor:document.getElementById("lookingFor").value,

            latitude:latitude,

            longitude:longitude,

            profileCompleted:true,

            updatedAt:serverTimestamp()

        },{merge:true});

        window.location.href="home.html";

    }

    catch(error){

        console.log(error);

        alert(error.message);

        continueBtn.disabled=false;

        continueBtn.innerHTML="Continue";

    }

});
