console.log("Hello from preload!");
ipcRenderer.on("messageFromMain", (event, message) => {
  console.log("Preload.js Received a message from ipcMain process:", message);
});
ipcRenderer.send("messageFromRenderer", "Hello from Preload!");
