const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("dotenv").config();

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1200,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      contentSecurityPolicy:
        "default-src 'self'; connect-src 'self' https://etmf.somee.com;",
    },
  });

  mainWindow.loadFile("index.html");

  ipcMain.on("open-student-report", (event, studentData) => {
    const reportWindow = new BrowserWindow({
      width: 500,
      height: 400,
      title: `Report - ${studentData.studentName}`,
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
