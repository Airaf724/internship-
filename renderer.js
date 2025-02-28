document.addEventListener("DOMContentLoaded", () => {
  const token = window.env.TOKEN; // Get token from preload.js

  console.log("Token:", token);

  async function fetchStudentPerformance() {
    if (!token) {
      console.error("No token found, please login first");
      return;
    }

    try {
      const response = await fetch(
        "https://etmf.somee.com/api/StudentPerformances/student-performance",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 403) {
        alert("Not authorized to access this data");
        return;
      }

      const data = await response.json();
      console.log("Student Performance Data:", data);

      // displayData(data);
      renderTable(data); //call when api works properlynp
    } catch (error) {
      console.error("Error fetching student performance:", error);
    }
  }

  // Call the function when needed
  fetchStudentPerformance();

  const tableBody = document.getElementById("student-table");
  const searchInput = document.querySelector(".input-box");
  const sections = document.querySelectorAll(".main-content");
  const sidebarItems = document.querySelectorAll(".list li");

  function showSection(sectionId) {
    sections.forEach((section) => {
      section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";
  }

  sidebarItems.forEach((item) => {
    item.addEventListener("click", async () => {
      const sectionId = item.getAttribute("data-section") + "-section";

      sidebarItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      showSection(sectionId);

      if (sectionId === "queue-section") {
        const queueContent = document.getElementById("queue-content");

        try {
          const response = await fetch("./queue/queue.html");
          const html = await response.text();
          queueContent.innerHTML = html;

          const script = document.createElement("script");
          script.src = "./queue/queue.js";
          script.defer = true;
          document.body.appendChild(script);
        } catch (error) {
          console.error("Error loading queue.html:", error);
        }
      }
    });
  });

  function renderTable(filteredStudents) {
    tableBody.innerHTML = "";

    filteredStudents.forEach((student) => {
      let row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.studentId}</td>
        <td>${student.studentName}</td>
        <td>${student.totalTasks}</td>
        <td>${student.completedTasks}</td>
        <td>${student.pendingTasks}</td>
        <td>${student.failedTasks}</td>
        <td><button class="report-btn" data-student-id="${student.studentId}">View</button></td>
      `;

      tableBody.appendChild(row);
    });

    document.querySelectorAll(".report-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const studentId = parseInt(
          event.target.getAttribute("data-student-id")
        );
        const studentData = filteredStudents.find(
          (s) => s.studentId === studentId
        );

        if (studentData) {
          console.log("Sending student data:", studentData);
          window.api.openStudentReport(studentData);
        } else {
          console.error("Student data not found for ID:", studentId);
        }
      });
    });
  }

  // renderTable(students); // for dummy data removed later

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const filteredStudents = students.filter((student) =>
      student.studentName.toLowerCase().includes(searchText)
    );

    renderTable(searchText ? filteredStudents : students);
  });

  // Show the default section
  showSection("students-section");
});
