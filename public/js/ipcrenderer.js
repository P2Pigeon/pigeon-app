console.log("Hello from the ipcRender process/ipcrenderer.js file!");
const { ipcRenderer } = require("electron");
ipcRenderer.send("messageFromRenderer", "Hello from ipcRenderer!");
ipcRenderer.on("messageFromMain", (event, message) => {
  console.log("ipcRenderer Received message from ipcMain process:", message);
});
