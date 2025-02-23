import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDOi4F01W9XSmuL_v8eNuzo_pI_wSFTWvQ",
    authDomain: "squartile.firebaseapp.com",
    projectId: "squartile",
    storageBucket: "squartile.firebasestorage.app",
    messagingSenderId: "88570758768",
    appId: "1:88570758768:web:0848a16eb8b0d35cc296b5",
    measurementId: "G-PGH54R4J33"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
