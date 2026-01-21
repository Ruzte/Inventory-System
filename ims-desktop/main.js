const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const { registerIpc } = require("./main/ipc");


function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 800,
    titleBarStyle: "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.loadFile("build/index.html");
  // win.webContents.openDevTools(); // Uncomment to open DevTools on launch
}

app.whenReady().then(() => {
  registerIpc(); // ✅ REQUIRED
  createWindow();
});

Menu.setApplicationMenu(null);