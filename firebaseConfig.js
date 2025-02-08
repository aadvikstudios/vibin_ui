// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJBl9LTEWGSfFHAj9_1euH4vRcktf2HHo",
  authDomain: "vibin-ui.firebaseapp.com",
  projectId: "vibin-ui",
  storageBucket: "vibin-ui.firebasestorage.app",
  messagingSenderId: "874321282922",
  appId: "1:874321282922:web:34027df41a318a7a864713",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };