import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

const auth = initializeAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; 