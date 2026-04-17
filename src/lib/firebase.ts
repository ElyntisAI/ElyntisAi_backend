// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm5iLdAyThGv35QirLGr8SyWSnW13bgR8",
  authDomain: "elyntisai-f7dcb.firebaseapp.com",
  projectId: "elyntisai-f7dcb",
  storageBucket: "elyntisai-f7dcb.firebasestorage.app",
  messagingSenderId: "819875403679",
  appId: "1:819875403679:web:1625a2a828d29b69c1cfaa",
  measurementId: "G-0VF013G1ZR"
};

// Initialize Firebase
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const storage = getStorage(app);

export { app, auth, analytics, storage };
