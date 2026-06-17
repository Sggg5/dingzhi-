const { app, BrowserWindow } = require("electron");
const { startStaticServer } = require("./server");

let staticServer;

async function createWindow() {
  const serverInfo = await startStaticServer();
  staticServer = serverInfo.server;
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 760,
    autoHideMenuBar: true,
    backgroundColor: "#f6faf9",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.webContents.setZoomFactor(0.9);
  win.loadURL(serverInfo.url);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    staticServer?.close();
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
