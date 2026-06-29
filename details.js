import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const username=document.getElementById("username");
const dob=document.getElementById("dob");

const maleCard=document.getElementById("maleCard");
const femaleCard=document.getElementById("femaleCard");

const lookingCards=document.querySelectorAll("#lookingForOptions .gender-card");

let selectedGender="";
let lookingFor="";
let currentUser=null;

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href="index.html";
return;

}

currentUser=user;

const snap=await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data=snap.data();

if(data.detailsCompleted===true){

window.location.href="home.html";
return;

}

}

});

maleCard.onclick=()=>{

selectedGender="Man";

maleCard.classList.add("active");
femaleCard.classList.remove("active");

};

femaleCard.onclick=()=>{

selectedGender="Woman";

femaleCard.classList.add("active");
maleCard.classList.remove("active");

};

lookingCards.forEach(card=>{

card.onclick=()=>{

lookingCards.forEach(c=>c.classList.remove("active"));

card.classList.add("active");

lookingFor=card.dataset.value;

};

});
import {
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const locationBtn=document.getElementById("locationBtn");
const saveBtn=document.getElementById("saveBtn");
const loading=document.getElementById("loading");

let latitude=null;
let longitude=null;

locationBtn.onclick=()=>{

if(!navigator.geolocation){

alert("Location is not supported.");

return;

}

locationBtn.innerText="Getting Location...";

navigator.geolocation.getCurrentPosition(

(position)=>{

latitude=position.coords.latitude;

longitude=position.coords.longitude;

locationBtn.innerHTML="✅ Location Added";

},

()=>{

alert("Please allow location access.");

locationBtn.innerHTML="📍 Allow Location";

}

);

};

saveBtn.onclick=async()=>{

if(username.value.trim()==""){

alert("Enter Username");

return;

}

if(dob.value==""){

alert("Select Date of Birth");

return;

}

if(selectedGender==""){

alert("Select Gender");

return;

}

if(lookingFor==""){

alert("Select Interested In");

return;

}

if(latitude===null){

alert("Please allow location.");

return;

}

loading.style.display="block";

saveBtn.disabled=true;

try{

await setDoc(doc(db,"users",currentUser.uid),{

uid:currentUser.uid,

username:username.value.trim(),

dob:dob.value,

gender:selectedGender,

lookingFor:lookingFor,

latitude:latitude,

longitude:longitude,

detailsCompleted:true

},{merge:true});

window.location.href="home.html";

}catch(error){

console.error(error);

alert("Something went wrong.");

loading.style.display="none";

saveBtn.disabled=false;

}

};
