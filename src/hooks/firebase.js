// src/config/firebase.js (o src/hooks/firebase.js si prefieres)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuración de tu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6v2yT6GQSQk-OoYuYs7-qx4TSkxQdH30",
  authDomain: "cratecloud-bf875.firebaseapp.com",
  projectId: "cratecloud-bf875",
  storageBucket: "cratecloud-bf875.firebasestorage.app",
  messagingSenderId: "396392092738",
  appId: "1:396392092738:web:463509aa937d67e4b049db",
  measurementId: "G-0WZHGLM5MD"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que necesitas
export const auth = getAuth(app);
export const storage = getStorage(app);
