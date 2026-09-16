import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
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
const db = getDatabase(app);

const tableHead = document.getElementById("student-table-head");
const tableBody = document.getElementById("student-table-body");
const studentRef = ref(db, "students/");

onValue(studentRef, (snapshot) => {
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  if (snapshot.exists()) {
    const students = [];
    const allDates = new Set();

    snapshot.forEach((childSnapshot) => {
      const student = childSnapshot.val();
      students.push(student);

      if (student.attendance) {
        Object.keys(student.attendance).forEach((date) => allDates.add(date));
      }
    });

    const sortedDates = Array.from(allDates).sort();

    let headerRow = `
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Full Name</th>
        <th scope="col">Course</th>
    `;

    sortedDates.forEach((date) => {
      headerRow += `<th scope="col" class="text-center">${date.slice(5)}</th>`;
    });

    headerRow += `
        <th scope="col" class="text-success text-center">Present %</th>
        <th scope="col" class="text-danger text-center">Absent %</th>
      </tr>
    `;
    tableHead.innerHTML = headerRow;

    students.forEach((student) => {
      let presentCount = 0;
      let totalClasses = 0;
      let dateCells = "";

      sortedDates.forEach((date) => {
        const status = student.attendance ? student.attendance[date] : null;

        if (status === "P") {
          dateCells += `<td class="text-center">✅</td>`;
          presentCount++;
          totalClasses++;
        } else if (status === "A") {
          dateCells += `<td class="text-center">❌</td>`;
          totalClasses++;
        } else {
          dateCells += `<td class="text-center text-muted">-</td>`;
        }
      });

      const absentCount = totalClasses - presentCount;
      const presentPercent =
        totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
      const absentPercent =
        totalClasses > 0 ? Math.round((absentCount / totalClasses) * 100) : 0;

      const row = `
        <tr>
          <th scope="row">${student.id}</th>
          <td>${student.name}</td>
          <td>${student.course}</td>
          
          ${dateCells}
          
          <td class="text-success fw-bold text-center">${presentPercent}%</td>
          <td class="text-danger fw-bold text-center">${absentPercent}%</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } else {
    tableBody.innerHTML =
      "<tr><td colspan='10' class='text-center'>No students found.</td></tr>";
  }
});

const exportBtn = document.getElementById("export-btn");

if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const table = document.querySelector(".table");
    let csvData = [];

    for (const row of table.rows) {
      let rowData = [];

      for (const cell of row.cells) {
        let text = cell.innerText.replace(/"/g, '""');
        rowData.push(`"${text}"`);
      }

      csvData.push(rowData.join(","));
    }

    const csvFile = new Blob([csvData.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.download = "Attendance_Report.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
}
