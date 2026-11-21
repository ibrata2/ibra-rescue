// IBRA RESCUE — حبل النجاة | نافذة اللعبة (Electron)
const { app, BrowserWindow, shell, ipcMain, Menu, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 760, minWidth: 800, minHeight: 480,
    backgroundColor: '#0b0a09', title: 'IBRA RESCUE — حبل النجاة',
    icon: path.join(__dirname, 'app', 'icon.png'),
    autoHideMenuBar: true, show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, backgroundThrottling: false, additionalArguments: ['--app-version=' + app.getVersion()] }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.once('ready-to-show', () => win.show());
  // الروابط الخارجية تفتح بالمتصفح
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}
ipcMain.on('fullscreen', () => win && win.setFullScreen(!win.isFullScreen()));
ipcMain.on('open', (e, url) => { if (/^https:\/\//.test(url)) shell.openExternal(url); });

// التحديث الداخلي: ينزّل النسخة الجديدة داخل اللعبة ويثبّتها ويرجع يفتحها
ipcMain.handle('update', async (e, { setup, portable }) => {
  const isPortable = !!process.env.PORTABLE_EXECUTABLE_FILE;
  const url = isPortable ? portable : setup;
  if (!url || !/^https:\/\/(github\.com|objects\.githubusercontent\.com)\//.test(url)) throw new Error('bad url');
  const dir = isPortable ? (process.env.PORTABLE_EXECUTABLE_DIR || app.getPath('downloads')) : app.getPath('temp');
  const dest = path.join(dir, decodeURIComponent(path.basename(new URL(url).pathname)));
  const r = await net.fetch(url);
  if (!r.ok) throw new Error('http ' + r.status);
  const total = +r.headers.get('content-length') || 0;
  const tmp = dest + '.part', out = fs.createWriteStream(tmp);
  const reader = r.body.getReader(); let got = 0, last = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    got += value.length;
    if (!out.write(Buffer.from(value))) await new Promise(res => out.once('drain', res));
    const now = Date.now();
    if (now - last > 150) { last = now; e.sender.send('update-progress', total ? got / total : -1); }
  }
  await new Promise((res, rej) => out.end(err => err ? rej(err) : res()));
  if (total && got < total) throw new Error('incomplete');
  try { fs.rmSync(dest, { force: true }); } catch (x) { }
  fs.renameSync(tmp, dest);
  e.sender.send('update-progress', 1);
  // المحمولة: نفتح الملف الجديد. المثبّت: تثبيت صامت ثم يفتح اللعبة وحده
  const args = isPortable ? [] : ['/S', '--updated', '--force-run'];
  spawn(dest, args, { detached: true, stdio: 'ignore' }).unref();
  setTimeout(() => app.quit(), 600);
  return true;
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
