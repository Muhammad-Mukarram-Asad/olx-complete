import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query, 
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIb5zkK2Kpi0CaWkJkAhPf5P7nmntQOts",
  authDomain: "olx-authentication.firebaseapp.com",
  projectId: "olx-authentication",
  storageBucket: "olx-authentication.appspot.com",
  messagingSenderId: "803883668867",
  appId: "1:803883668867:web:687226ffbefb1ea6e9d2b6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// function signInFirebase(email, password) {
//   return signInWithEmailAndPassword(auth, email, password);
// }

async function signUpFirebase(userInfo) {
  const { email, password } = userInfo;
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await addUserToDb(userInfo, userCredential.user.uid);
}

function addUserToDb(userInfo, uid) {
  const { email, name, age } = userInfo;
  return setDoc(doc(db, "users",uid), { email, name, age });
}

function postAdToDb(title, price, description, imageURL,location,contact_number) {
  const userId = auth.currentUser.uid;
  return addDoc(collection(db, "ads"), {
    title,
    price,
    description,
    imageURL,
    location,
    contact_number,
    userId,
  });
}


async function getAdsFromDb() {
  const querySnapshot = await getDocs(collection(db, "ads"));
  const ads = [];
  querySnapshot.forEach((doc) => {
    ads.push({ id: doc.id, ...doc.data() });
    // console.log(ads);
  });
  return ads; // it is returning the array of ads.
}

async function uploadImage(image) {
  const storageREf = ref(storage, `images/${image.name}`);
  const snapshot = await uploadBytes(storageREf, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

// Realtime data get krna ka method firebase ka:
function getRealtimeAds(callback) {
  //2
  onSnapshot(collection(db, "ads"), (querySnapshot) => {
      const ads = []

      querySnapshot.forEach((doc) => {
          ads.push({ id: doc.id, ...doc.data() })
      });
      //3
      callback(ads)
  })
}

// Creating a method or function for obtaining Ad details when user clicked on it.
async function clickedAdFromDB(title)
{
  
const q = query(collection(db, "ads"), where("title", "==", title));

const querySnapshot = await getDocs(q);
let ad_array = [];
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
  ad_array.push({ id: doc.id, ...doc.data() })
})
return ad_array;
};


// karnain ka btaya hua method:
async function adQuery(id)
{
  const ad = [];
  try{
    const docRef = doc(db,"ads",id);
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
      ad.push(doc.data());
    })

    return ad;
  }
  catch(e)
  {
    console.log("Error --> " + e.message);
  }
}



export { signUpFirebase, uploadImage, getAdsFromDb, postAdToDb,clickedAdFromDB,getRealtimeAds};
