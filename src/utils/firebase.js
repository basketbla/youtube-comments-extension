// Firebase stuff
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKhJwq5U_giAW7kLS8vzk_Wn9sUCsAiD0",
  authDomain: "comments-90a56.firebaseapp.com",
  projectId: "comments-90a56",
  storageBucket: "comments-90a56.appspot.com",
  messagingSenderId: "484252700912",
  appId: "1:484252700912:web:dbf68e93ad182250dcf235",
  measurementId: "G-F00076XK06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();