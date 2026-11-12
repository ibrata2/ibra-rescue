// IBRA RESCUE — حبل النجاة | نافذة اللعبة (Electron)
const { app, BrowserWindow, shell, ipcMain, Menu } = require('electron');
const path = require('path');

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 760, minWidth: 800, minHeight: 480,
    backgroundColor: '#0b0a09', title: 'IBRA RESCUE — حبل النجاة',
    icon: path.join(__dirname, 'app', 'icon.png'),
    autoHideMenuBar: true, show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.once('ready-to-show', () => win.show());
  // الروابط الخارجية تفتح بالمتصفح
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}
ipcMain.on('fullscreen', () => win && win.setFullScreen(!win.isFullScreen()));
ipcMain.on('open', (e, url) => { if (/^https:\/\//.test(url)) shell.openExternal(url); });

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
