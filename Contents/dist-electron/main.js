// electron/main.ts
import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    icon: isDev ? join(__dirname, "../Icons/PDF-chapter-split-icon.png") : void 0
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = join(__dirname, "../dist/index.html");
    if (existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      console.error("Index file not found:", indexPath);
    }
  }
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
//# sourceMappingURL=main.js.map
