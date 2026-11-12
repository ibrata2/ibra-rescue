const { contextBridge, ipcRenderer } = require('electron');
const verArg = (process.argv || []).find(a => a.startsWith('--app-version='));
contextBridge.exposeInMainWorld('ibra', {
  version: verArg ? verArg.split('=')[1] : null,
  toggleFullscreen: () => ipcRenderer.send('fullscreen'),
  open: url => ipcRenderer.send('open', url)
});
