import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const user = auth.currentUser;

const imageInput = document.getElementById("profileImage");

const preview = document.getElementById("previewImage");

const locationBtn = document.getElementById("locationBtn");

const locationText = document.getElementById("locationText");

let latitude = "";

let longitude = "";

imageInput.onchange = () => {

    const file = imageInput.files[0];

    if(file){

        preview.src = URL.createObjectURL(file);

    }

};

if(user){

    document.getElementById("name").value = user.displayName || "";

}

locationBtn.onclick = ()=>{

    navigator.geolocation.getCurrentPosition(

        (position)=>{

            latitude = position.coords.latitude;

            longitude = position.coords.longitude;

            locationText.innerHTML = "Location Added ✓";

        },

        ()=>{

            alert("Location permission denied");

        }

    );

};

document.getElementById("profileForm").addEventListener("submit",async(e)=>{

e.preventDefault();

if(!user){

alert("Please login again");

return;

}

const file = imageInput.files[0];

if(!file){

alert("Please upload profile photo");

return;

}

const storageRef = ref(storage,"profiles/"+user.uid);

await uploadBytes(storageRef,file);

const photoURL = await getDownloadURL(storageRef);

const gender = document.querySelector("input[name='gender']:checked");

if(!gender){

alert("Select gender");

return;

}

await updateDoc(doc(db,"users",user.uid),{

name:document.getElementById("name").value,

photo:photoURL,

gender:gender.value,

dob:document.getElementById("dob").value,

lookingFor:document.getElementById("lookingFor").value,

latitude:latitude,

longitude:longitude,

profileCompleted:true

});

window.location.href="home.html";

});
