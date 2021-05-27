import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJx6mEac3aWqb1w4i5NoTwsVN9AbM8xLs",
  authDomain: "quickie-washie.firebaseapp.com",
  projectId: "quickie-washie",
  storageBucket: "quickie-washie.appspot.com",
  messagingSenderId: "888863628081",
  appId: "1:888863628081:web:8ad4c80afab400044eae10",
  measurementId: "G-ZT58RD29DF",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { db, auth, firebase, storage, timestamp };
