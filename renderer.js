document.addEventListener("DOMContentLoaded", () => {
  const token = window.env.TOKEN; // Get token from preload.js

  console.log("Token:", token);

  const students = [
    {
      roll: 1,
      name: "Airaf Lohar",
      class: "BE",
      percentage: 95,
      result: "Pass",
    },
    {
      roll: 2,
      name: "Priya Sharma",
      class: "BE",
      percentage: 80,
      result: "Pass",
    },
    {
      roll: 3,
      name: "Amit Tandon",
      class: "SE",
      percentage: 90,
      result: "Pass",
    },
    {
      roll: 4,
      name: "Neha Mundase",
      class: "TE",
      percentage: 70,
      result: "Pass",
    },
    {
      roll: 5,
      name: "Arjun Mehta",
      class: "BE",
      percentage: 40,
      result: "Fail",
    },
  ];

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
        alert("Not authorized to access this data"); // Role-based restriction
        return;
      }

      const data = await response.json();
      console.log("Student Performance Data:", data);

      // Render the data in your frontend
      // displayData(data);
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

          // Dynamically load queue.js
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
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.percentage}%</td>
                <td class="${student.result === "Pass" ? "pass" : "fail"}">${
        student.result
      }</td>
                <td><button class="report-btn" data-roll="${
                  student.roll
                }">View</button></td>
            `;

      tableBody.appendChild(row);
    });

    // Add event listeners to the view buttons
    document.querySelectorAll(".report-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const rollNumber = parseInt(event.target.getAttribute("data-roll"));
        const studentData = students.find((s) => s.roll === rollNumber);

        if (studentData) {
          // Use the exposed API from preload.js instead of direct ipcRenderer
          window.api.openStudentReport(studentData);
        }
      });
    });
  }

  renderTable(students);

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const filteredStudents = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchText) ||
        student.class.toLowerCase().includes(searchText) ||
        student.result.toLowerCase().includes(searchText)
    );

    renderTable(searchText ? filteredStudents : students);
  });

  // Show the default section
  showSection("students-section");
});
