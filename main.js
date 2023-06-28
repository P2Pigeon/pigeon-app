const { ipcMain, app, BrowserWindow } = require("electron");
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost', 'true')

ipcMain.on("messageFromRenderer", (event, message) => {
  console.log("Electron ipcMain Process Received message from ipcRenderer:", message);
  event.sender.send("messageFromMain", "Hello from main!");
});

const server = require("./app/src/");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    title: "Pigeon",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      enableRemoteModule: true      
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
