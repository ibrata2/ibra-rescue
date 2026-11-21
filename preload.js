const { contextBridge, ipcRenderer } = require('electron');
const verArg = (process.argv || []).find(a => a.startsWith('--app-version='));
contextBridge.exposeInMainWorld('ibra', {
  version: verArg ? verArg.split('=')[1] : null,
  toggleFullscreen: () => ipcRenderer.send('fullscreen'),
  open: url => ipcRenderer.send('open', url),
  update: urls => ipcRenderer.invoke('update', urls),
  onUpdateProgress: cb => ipcRenderer.on('update-progress', (e, p) => cb(p))
});
