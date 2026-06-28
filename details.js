import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged
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
const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

const db=getFirestore(app);

const storage=getStorage(app);

let latitude="";

let longitude="";

let imageFile=null;

onAuthStateChanged(auth,(user)=>{

if(user){

document.getElementById("name").value=user.displayName||"";

}

else{

location.href="index.html";

}

});

document.getElementById("profileImage").addEventListener("change",(e)=>{

imageFile=e.target.files[0];

if(imageFile){

document.getElementById("previewImage").src=URL.createObjectURL(imageFile);

}

});

document.getElementById("locationBtn").onclick=()=>{

navigator.geolocation.getCurrentPosition(

(position)=>{

latitude=position.coords.latitude;

longitude=position.coords.longitude;

document.getElementById("locationText").innerHTML="✅ Location Selected";

},

()=>{

alert("Please allow location permission.");

}

);

};

document.getElementById("profileForm").addEventListener("submit",async(e)=>{

e.preventDefault();

const user=auth.currentUser;

if(!user){

alert("Please login first");

return;

}

if(!imageFile){

alert("Please upload profile picture");

return;

}

const name=document.getElementById("name").value;

const gender=document.querySelector('input[name="gender"]:checked')?.value;

const dob=document.getElementById("dob").value;

const lookingFor=document.getElementById("lookingFor").value;

if(!gender){

alert("Select Gender");

return;

}

const imageRef=ref(storage,"profiles/"+user.uid);

await uploadBytes(imageRef,imageFile);

const photoURL=await getDownloadURL(imageRef);

await updateDoc(doc(db,"users",user.uid),{

name,

gender,

dob,

lookingFor,

photo:photoURL,

latitude,

longitude

});

location.href="home.html";

});
