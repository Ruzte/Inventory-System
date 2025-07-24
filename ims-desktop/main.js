const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, // Allow localhost connections
    },
  });

  // For development - load Vite dev server
  win.loadURL('http://localhost:5173');
  
  // For debugging
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Keep your existing IPC handlers
ipcMain.handle('login', async (event, { username, password }) => {
  return new Promise((resolve) => {
    db.findOne({ username }, (err, user) => {
      if (err) {
        console.error('DB error:', err);
        return resolve({ success: false, message: 'Internal error' });
      }

      if (!user) {
        return resolve({ success: false, message: 'User not found' });
      }

      if (user.password !== password) {
        return resolve({ success: false, message: 'Incorrect password' });
      }

      return resolve({ success: true, user });
    });
  });
});