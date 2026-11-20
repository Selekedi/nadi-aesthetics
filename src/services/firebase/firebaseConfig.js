import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCLMIYldbBoBROsETrjhR8-apHSZt8uMsI",
  authDomain: "nadi-aesthetics.firebaseapp.com",
  projectId: "nadi-aesthetics",
  storageBucket: "nadi-aesthetics.firebasestorage.app",
  messagingSenderId: "708156073340",
  appId: "1:708156073340:web:f1b9ff43f98602dc3730f9",
  measurementId: "G-2L8K6YYQV0"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const functions = getFunctions(app)

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  }),
});


export {db , auth, functions}
