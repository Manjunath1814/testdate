import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const username=document.getElementById("username");
const dob=document.getElementById("dob");

const male=document.getElementById("male");
const female=document.getElementById("female");

const interestOptions=document.querySelectorAll(".interest-option");

const locationBtn=document.getElementById("locationBtn");
const continueBtn=document.getElementById("continueBtn");
const loading=document.getElementById("loading");

let currentUser=null;

let selectedGender="";
let selectedInterest="";

let latitude=null;
let longitude=null;

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href="index.html";
return;

}

currentUser=user;

const userRef=doc(db,"users",user.uid);

const snap=await getDoc(userRef);

if(snap.exists()){

const data=snap.data();

if(data.detailsCompleted===true){

window.location.href="home.html";
return;

}

}

});

male.onclick=()=>{

selectedGender="Man";

male.classList.add("active");

female.classList.remove("active");

};

female.onclick=()=>{

selectedGender="Woman";

female.classList.add("active");

male.classList.remove("active");

};

interestOptions.forEach(option=>{

option.onclick=()=>{

interestOptions.forEach(item=>{

item.classList.remove("active");

});

option.classList.add("active");

selectedInterest=option.dataset.value;

};

});
locationBtn.onclick=()=>{

if(!navigator.geolocation){

alert("Your browser doesn't support location.");

return;

}

locationBtn.innerHTML="Getting Location...";

navigator.geolocation.getCurrentPosition(

(position)=>{

latitude=position.coords.latitude;

longitude=position.coords.longitude;

locationBtn.innerHTML="✅ Location Added";

},

(error)=>{

alert("Please allow location access.");

locationBtn.innerHTML="📍 Allow Location";

console.log(error);

}

);

};

continueBtn.onclick=async()=>{

if(username.value.trim()==""){

alert("Please enter your username.");

return;

}

if(dob.value==""){

alert("Please select your Date of Birth.");

return;

}

if(selectedGender==""){

alert("Please select your gender.");

return;

}

if(selectedInterest==""){

alert("Please select who you're interested in.");

return;

}

if(latitude===null || longitude===null){

alert("Please allow your location.");

return;

}

const birthDate=new Date(dob.value);

const today=new Date();

let age=today.getFullYear()-birthDate.getFullYear();

const month=today.getMonth()-birthDate.getMonth();

if(month<0 || (month===0 && today.getDate()<birthDate.getDate())){

age--;

}

if(age<18){

alert("You must be at least 18 years old.");

return;

}

loading.style.display="block";

continueBtn.disabled=true;

try{

await setDoc(

doc(db,"users",currentUser.uid),

{

uid:currentUser.uid,

name:username.value.trim(),

dob:dob.value,

age:age,

gender:selectedGender,

lookingFor:selectedInterest,

latitude:latitude,

longitude:longitude,

detailsCompleted:true,

createdAt:new Date()

},

{merge:true}

);

window.location.replace("home.html");

}catch(error){

console.error(error);

alert(error.message);

loading.style.display="none";

continueBtn.disabled=false;

}

};
