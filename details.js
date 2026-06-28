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

const firebaseConfig = {

apiKey:"YOUR_API_KEY",

authDomain:"YOUR_AUTH_DOMAIN",

projectId:"YOUR_PROJECT_ID",

storageBucket:"YOUR_STORAGE_BUCKET",

messagingSenderId:"YOUR_SENDER_ID",

appId:"YOUR_APP_ID",

measurementId:"YOUR_MEASUREMENT_ID"

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
