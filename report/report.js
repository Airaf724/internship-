const { ipcRenderer } = require("electron");

// Listen for the student data from the main process
ipcRenderer.on("student-data", (event, studentData) => {
  // Populate the report with student data
  document.getElementById("student-roll").textContent = studentData.roll;
  document.getElementById("student-name").textContent = studentData.name;
  document.getElementById("student-class").textContent = studentData.class;
  document.getElementById(
    "student-percentage"
  ).textContent = `${studentData.percentage}%`;

  const resultElement = document.getElementById("student-result");
  resultElement.textContent = studentData.result;

  // Add appropriate class for styling
  if (studentData.result === "Pass") {
    resultElement.classList.add("result-pass");
  } else {
    resultElement.classList.add("result-fail");
  }
});

// Close button functionality
document.getElementById("close-btn").addEventListener("click", () => {
  window.close();
});
