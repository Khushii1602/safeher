// firebase.js - Initializes Firebase and exports auth service

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCTnDQ8Z2crJhDRLJZdOJU87JrmDzEQZ7s",
  authDomain: "safeher-bbffa.firebaseapp.com",
  projectId: "safeher-bbffa",
  storageBucket: "safeher-bbffa.firebasestorage.app",
  messagingSenderId: "246327761120",
  appId: "1:246327761120:web:e432f2d27cefa0e8a3d885",
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Initialize Authentication service
export const auth = getAuth(app)

// Google login provider
export const googleProvider = new GoogleAuthProvider()

export default app