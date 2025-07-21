import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6q7YuED_RJ8nBnJbHe94J05lFimXMkZE",
  authDomain: "moonmate-499a0.firebaseapp.com",
  projectId: "moonmate-499a0",
  storageBucket: "moonmate-499a0.appspot.com",
  messagingSenderId: "564662743404",
  appId: "1:564662743404:web:adf332db9c76f9d5ca8349",
  measurementId: "G-P55579285V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 