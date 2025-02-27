const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("env", {
  TOKEN: process.env.TOKEN, // Expose Token
});

contextBridge.exposeInMainWorld("api", {
  openStudentReport: (studentData) =>
    ipcRenderer.send("open-student-report", studentData),
});
