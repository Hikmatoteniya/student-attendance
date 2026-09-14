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

const allowedAdmins = [
  "hikmatoteniya@gmail.com", // Replace with your actual admin email
];

// 3. Listen for Auth State Changes
// If they are already logged in and are an admin, redirect them immediately
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If they are already logged in, check if they are an admin
    if (allowedAdmins.includes(user.email)) {
      // Send them straight to the dashboard
      window.location.href = "admindashboard.html";
    } else {
      // They are logged in but not an admin. Log them out.
      signOut(auth);
      alert("Unauthorized access. You are not an admin.");
    }
  }
});

// 4. Attach functions to 'window' so your HTML button onclick="" can find them
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
  // Assume the 'userId' input is now taking an Email address
  let email = document.getElementById("userId").value;
  let password = document.getElementById("inputPassword3").value;
  let errorDisId = document.getElementById("displayErrorId");
  let errorDisPass = document.getElementById("displayErrorPassword");

  errorDisId.innerHTML = "";
  errorDisPass.innerHTML = "";

  if (email.trim() === "") {
    errorDisId.innerHTML = "Enter valid email";
    return; // Stop function execution
  }
  if (password.trim() === "") {
    errorDisPass.innerHTML = "Enter password";
    return; // Stop function execution
  }

  // 5. Log in using Firebase Auth instead of just checking the array
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Verify they are in your hardcoded admin array
      if (allowedAdmins.includes(user.email)) {
        alert("Success! Logging in...");
        window.location.href = "admindashboard.html";
      } else {
        alert("Access Denied: You do not have admin privileges.");
        signOut(auth); // Immediately log them out if they aren't on the list
      }
    })
    .catch((error) => {
      // Catch Firebase errors (wrong password, user not found, etc.)
      alert("Invalid Email or Password");
      console.error(error.message);
    });
};
