import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzuxUhiwxAyyjDB15TQY9geaD5cjmtCXM",
  authDomain: "timed-tasks-adee5.firebaseapp.com",
  projectId: "timed-tasks-adee5",
  storageBucket: "timed-tasks-adee5.appspot.com",
  messagingSenderId: "878895444603",
  appId: "1:878895444603:web:53d3d5c74fa12a4a8ae8de",
  measurementId: "G-WXFGD6FP9X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();