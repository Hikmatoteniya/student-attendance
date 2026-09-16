// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRYslCoqk8KCfnAE2OPoko02XLnsyNFGE",
  authDomain: "final-project-a476b.firebaseapp.com",
  projectId: "final-project-a476b",
  storageBucket: "final-project-a476b.firebasestorage.app",
  messagingSenderId: "238165221411",
  appId: "1:238165221411:web:2f1905be65942f6345d196",
  measurementId: "G-YRXL6X0LZQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

const allowedAdmins = ["hikmatoteniya@gmail.com"];

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (allowedAdmins.includes(user.email)) {
      window.location.href = "admindashboard.html";
    } else {
      signOut(auth);
      alert("Unauthorized access. You are not an admin.");
    }
  }
});

window.togglePassword = function () {
  const passwordInput = document.getElementById("inputPassword3");
  const toggleBtn = document.getElementById("toggleBtn");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "Show";
  }
};

window.goToAdmin = function () {
  let email = document.getElementById("userId").value;
  let password = document.getElementById("inputPassword3").value;
  let errorDisId = document.getElementById("displayErrorId");
  let errorDisPass = document.getElementById("displayErrorPassword");

  errorDisId.innerHTML = "";
  errorDisPass.innerHTML = "";

  if (email.trim() === "") {
    errorDisId.innerHTML = "Enter valid email";
    return;
  }
  if (password.trim() === "") {
    errorDisPass.innerHTML = "Enter password";
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (allowedAdmins.includes(user.email)) {
        alert("Success! Logging in...");
        window.location.href = "admindashboard.html";
      } else {
        alert("Access Denied: You do not have admin privileges.");
        signOut(auth);
      }
    })
    .catch((error) => {
      alert("Invalid Email or Password");
      console.error(error.message);
    });
};
