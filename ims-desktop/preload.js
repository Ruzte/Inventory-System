const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  login: (data) => ipcRenderer.invoke("user:login", data),
  signup: (data) => ipcRenderer.invoke("user:signup", data),

  addItem: (username, item) =>
    ipcRenderer.invoke("items:add", { username, item }),

  getItems: (username) =>
    ipcRenderer.invoke("items:get", { username }),

  getTotalSales: (data) => ipcRenderer.invoke("get-total-sales", data),

  getSales: (username) =>
  ipcRenderer.invoke("sales:get", { username }),
  
  updatePrice: (data) => ipcRenderer.invoke("item:updatePrice", data),
  
  saleItem: (payload) =>
    ipcRenderer.invoke("item:sale", payload),

  addUnits: (payload) =>
    ipcRenderer.invoke("item:addUnits", payload),

  deleteItem: (payload) =>
    ipcRenderer.invoke("item:delete", payload),

  updateProfile: (data) =>
    ipcRenderer.invoke("profile:update", data),

  sendEmailVerification: (data) =>
    ipcRenderer.invoke("email:send-verification", data),
  
});
