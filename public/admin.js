import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
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
  databaseURL: "https://final-project-a476b-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

const logOut = document.getElementById("logout-btn");
const addBtn = document.getElementById("add-btn");
const searchBtn = document.getElementById("search-btn");
const presentBtn = document.getElementById("present-btn"); // update
const absentBtn = document.getElementById("absent-btn"); // update
const deleteBtn = document.getElementById("delete-btn"); // delete
const idInp = document.getElementById("student-id");
const nameInp = document.getElementById("student-name");
const courseInp = document.getElementById("course-name");
const date = document.getElementById("date");
const updateBtn = document.getElementById("update-btn");
const searchIdInp = document.getElementById("search-id");

logOut.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("signed out");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.log(error);
    });
});

addBtn.addEventListener("click", () => {
  set(ref(db, "students/" + idInp.value), {
    id: idInp.value,
    name: nameInp.value,
    course: courseInp.value,
    date: date.value,
    present: 0, // Start count at 0
    absent: 0, // Start count at 0
  }).then(() => {
    alert("student added");
  });
});

// Make sure you have the ID input for the attendance section targeted
// (Assuming you changed its ID to "search-id" to avoid duplicates as discussed earlier)
// const searchIdInp = document.getElementById("search-id");

// --- MARK PRESENT ---
presentBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  if (!studentId) return alert("Please enter a Student ID first.");

  const studentRef = ref(db, "students/" + studentId);

  // 1. Get the current data from Firebase
  get(studentRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const studentData = snapshot.val();

        // 2. Find the current present count (default to 0 if it doesn't exist)
        const currentPresent = studentData.present || 0;

        // 3. Update Firebase with the new count (+1)
        update(studentRef, { present: currentPresent + 1 })
          .then(() => alert(`Student ${studentId} marked Present!`))
          .catch((error) => alert("Error: " + error.message));
      } else {
        alert("Student not found in database.");
      }
    })
    .catch((error) => alert(error.message));
});

// --- MARK ABSENT ---
absentBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  if (!studentId) return alert("Please enter a Student ID first.");

  const studentRef = ref(db, "students/" + studentId);

  // 1. Get the current data from Firebase
  get(studentRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const studentData = snapshot.val();

        // 2. Find the current absent count (default to 0 if it doesn't exist)
        const currentAbsent = studentData.absent || 0;

        // 3. Update Firebase with the new count (+1)
        update(studentRef, { absent: currentAbsent + 1 })
          .then(() => alert(`Student ${studentId} marked Absent!`))
          .catch((error) => alert("Error: " + error.message));
      } else {
        alert("Student not found in database.");
      }
    })
    .catch((error) => alert(error.message));
});

// Search Button
searchBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  if (!studentId) return alert("Please enter a Student ID to search.");

  const studentRef = ref(db, "students/" + studentId);

  get(studentRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const studentData = snapshot.val();

        // Populate the top input fields with the retrieved data
        idInp.value = studentData.id || "";
        nameInp.value = studentData.name || "";
        courseInp.value = studentData.course || "";
        date.value = studentData.date || "";

        alert("Student found! You can now edit their info and click Update.");
      } else {
        alert("Student not found in the database.");
      }
    })
    .catch((error) => alert(error.message));
});

// Update Button
updateBtn.addEventListener("click", () => {
  // Uses the ID from the top input section to apply changes
  const studentId = idInp.value;
  if (!studentId) return alert("Please search for a student first.");

  const studentRef = ref(db, "students/" + studentId);

  update(studentRef, {
    name: nameInp.value,
    course: courseInp.value,
    date: date.value,
  })
    .then(() => {
      alert("Student info updated successfully!");
    })
    .catch((error) => {
      alert("Error updating student: " + error.message);
    });
});

// Delete Button
deleteBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  if (!studentId) return alert("Please enter a Student ID to delete.");

  // Show a confirmation pop-up so you don't delete by accident
  const confirmDelete = confirm(
    "Are you sure you want to delete student " + studentId + "?",
  );

  if (confirmDelete) {
    const studentRef = ref(db, "students/" + studentId);

    remove(studentRef)
      .then(() => {
        alert("Student deleted successfully!");

        // Clear the input fields after deletion
        searchIdInp.value = "";
        idInp.value = "";
        nameInp.value = "";
        courseInp.value = "";
        date.value = "";
      })
      .catch((error) => alert("Error deleting student: " + error.message));
  }
});
