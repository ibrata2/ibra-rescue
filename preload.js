const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('ibra', {
  toggleFullscreen: () => ipcRenderer.send('fullscreen'),
  open: url => ipcRenderer.send('open', url)
});
