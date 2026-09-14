import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

const tableBody = document.getElementById("student-table-body");
const studentRef = ref(db, "students/");

onAuthStateChanged(auth, (user) => {
  if (user) {
    onValue(studentRef, (snapshot) => {
      tableBody.innerHTML = "";

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const student = childSnapshot.val();

          // Use || 0 as a fallback in case a student hasn't been marked yet
          const presentCount = student.present || 0;
          const absentCount = student.absent || 0;

          // Replaced the buttons with the actual counts
          const row = `
            <tr>
              <th scope="row">${student.id}</th>
              <td>${student.name}</td>
              <td>${student.course}</td>
              <td>${student.date}</td>
              <td class="text-success fw-bold">${presentCount}</td>
              <td class="text-danger fw-bold">${absentCount}</td>
            </tr>
          `;
          tableBody.innerHTML += row;
        });
      } else {
        tableBody.innerHTML =
          "<tr><td colspan='6' class='text-center'>No students found.</td></tr>";
      }
    });
  } else {
    tableBody.innerHTML =
      "<tr><td colspan='6' class='text-center text-danger'>You must be logged in to view records.</td></tr>";
  }
});
