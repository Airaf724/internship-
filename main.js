const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("dotenv").config(); // Load .env variables

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js", // Load Preload Script
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      contentSecurityPolicy:
        "default-src 'self'; connect-src 'self' https://etmf.somee.com;",
    },
  });

  // mainWindow.setContentProtection(true);

  mainWindow.loadFile("index.html");

  ipcMain.on("open-student-report", (event, studentData) => {
    const reportWindow = new BrowserWindow({
      width: 500,
      height: 400,
      title: `Report - ${studentData.studentName}`, // Fix the title
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    reportWindow.loadFile("./report/report.html");

    reportWindow.webContents.once("did-finish-load", () => {
      reportWindow.webContents.send("student-data", studentData);
    });
  });
});
