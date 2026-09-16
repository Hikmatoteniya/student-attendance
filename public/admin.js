import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
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

const firebaseConfig = {
  apiKey: "AIzaSyCRYslCoqk8KCfnAE2OPoko02XLnsyNFGE",
  authDomain: "final-project-a476b.firebaseapp.com",
  projectId: "final-project-a476b",
  storageBucket: "final-project-a476b.firebasestorage.app",
  messagingSenderId: "238165221411",
  appId: "1:238165221411:web:2f1905be65942f6345d196",
  databaseURL: "https://final-project-a476b-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const logOut = document.getElementById("logout-btn");
const addBtn = document.getElementById("add-btn");
const searchBtn = document.getElementById("search-btn");
const presentBtn = document.getElementById("present-btn");
const absentBtn = document.getElementById("absent-btn");
const deleteBtn = document.getElementById("delete-btn");
const idInp = document.getElementById("student-id");
const nameInp = document.getElementById("student-name");
const courseInp = document.getElementById("course-name");
const date = document.getElementById("date");
const updateBtn = document.getElementById("update-btn");
const searchIdInp = document.getElementById("search-id");
const dashboardContent = document.getElementById("dashboard-content");

const attendanceDateInp = document.getElementById("attendance-date");
if (attendanceDateInp) {
  attendanceDateInp.value = new Date().toISOString().split("T")[0];
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("index.html");
  } else {
    if (dashboardContent) dashboardContent.style.display = "flex";
  }
});

logOut.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// CREATE
addBtn.addEventListener("click", () => {
  set(ref(db, "students/" + idInp.value), {
    id: idInp.value,
    name: nameInp.value,
    course: courseInp.value,
    date: date.value,
  }).then(() => {
    alert("Student details have been created");
  });
});

// MARK PRESENT
presentBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  const targetDate = attendanceDateInp.value;
  if (!studentId || !targetDate)
    return alert("Please enter an ID and select a date.");

  const attendanceRef = ref(db, `students/${studentId}/attendance`);
  update(attendanceRef, { [targetDate]: "P" })
    .then(() => alert(`Marked Present on ${targetDate}`))
    .catch((error) => alert(error.message));
});

// MARK ABSENT
absentBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  const targetDate = attendanceDateInp.value;
  if (!studentId || !targetDate)
    return alert("Please enter an ID and select a date.");

  const attendanceRef = ref(db, `students/${studentId}/attendance`);
  update(attendanceRef, { [targetDate]: "A" })
    .then(() => alert(`Marked Absent on ${targetDate}`))
    .catch((error) => alert(error.message));
});

// SEARCH
searchBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  if (!studentId) return alert("Please enter a valid Student ID.");

  get(ref(db, "students/" + studentId))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const studentData = snapshot.val();
        idInp.value = studentData.id || "";
        nameInp.value = studentData.name || "";
        courseInp.value = studentData.course || "";
        date.value = studentData.date || "";
        alert("Student found. You can now edit their details.");
      } else {
        alert("Student details not found.");
      }
    })
    .catch((error) => alert(error.message));
});

// UPDATE
updateBtn.addEventListener("click", () => {
  const studentId = idInp.value;
  if (!studentId) return alert("Please search for a student first.");

  update(ref(db, "students/" + studentId), {
    name: nameInp.value,
    course: courseInp.value,
    date: date.value,
  }).then(() => alert("Student info updated successfully!"));
});

// DELETE
deleteBtn.addEventListener("click", () => {
  const studentId = searchIdInp.value;
  if (!studentId) return alert("Please enter a Student ID to delete.");

  if (confirm("Are you sure you want to delete student " + studentId + "?")) {
    remove(ref(db, "students/" + studentId)).then(() => {
      alert("Student details deleted.");
      searchIdInp.value = "";
      idInp.value = "";
      nameInp.value = "";
      courseInp.value = "";
      date.value = "";
    });
  }
});
