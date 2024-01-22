import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";


// Configura la información de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCP6eUU6UueorEfCX8RauWoR1_Tz7yd_P0",
  authDomain: "puestags.firebaseapp.com",
  projectId: "puestags",
  storageBucket: "puestags.appspot.com",
  messagingSenderId: "52670231863",
  appId: "1:52670231863:web:7c5d962dad77c549e916b2"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const loginForm = document.getElementById("login-form");
const userInfoContainer = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");
const container = document.querySelector(".container");
const sidebar = document.querySelector(".sidebar");


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Inicio de sesión exitoso");
    window.location.href = "inicio.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
});
