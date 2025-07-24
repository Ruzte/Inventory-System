const { contextBridge, ipcRenderer } = require('electron');

// Safely expose only what the frontend needs
contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials) => ipcRenderer.invoke('login', credentials),
});
