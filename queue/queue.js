// document.addEventListener("DOMContentLoaded", function () {
//   const files = [
//     {
//       name: "Comprehensive Study Protocol for Clinical Trial: Phase III Oncology Research",
//     },
//     {
//       name: "Investigator Brochure Detailing Drug Safety and Efficacy for Trial Medication XYZ-2025",
//     },
//     {
//       name: "Participant Informed Consent Form for Multicenter Diabetes Management Study",
//     },
//     {
//       name: "Detailed Site Monitoring Report for Clinical Site #125 – Interim Analysis",
//     },
//     {
//       name: "Final Study Closure Checklist and Regulatory Compliance Summary for Trial ABC-2025",
//     },
//   ];

//   const fileList = document.getElementById("fileList");

//   function loadFiles() {
//     fileList.innerHTML = "";
//     files.forEach((file) => {
//       const fileItem = document.createElement("div");
//       fileItem.classList.add("file");
//       fileItem.innerHTML = `<img src="folder.png" alt="folder"> ${file.name}`;
//       fileList.appendChild(fileItem);
//     });
//   }

//   loadFiles();

//   document.getElementById("search").addEventListener("keyup", function (event) {
//     const query = event.target.value.toLowerCase();
//     fileList.innerHTML = "";
//     files
//       .filter((file) => file.name.toLowerCase().includes(query))
//       .forEach((file) => {
//         const fileItem = document.createElement("div");
//         fileItem.classList.add("file");
//         fileItem.innerHTML = `<img src="folder.png" alt="folder"> ${file.name}`;
//         fileList.appendChild(fileItem);
//       });
//   });
// });

// document.getElementById("search").addEventListener("keyup", function () {
//   let filter = this.value.toLowerCase();
//   let files = document.querySelectorAll(".file-item");

//   files.forEach((file) => {
//     let text = file.innerText.toLowerCase();
//     file.style.display = text.includes(filter) ? "flex" : "none";
//   });
// });

console.log("queue.js loaded successfully!");
