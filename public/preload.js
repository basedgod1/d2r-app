const { contextBridge, ipcRenderer } = require('electron');
const { api } = require('../src/api');

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('api', {
    ...api,
    checkGameDir: (gameDir) => ipcRenderer.invoke('check-game-dir', gameDir),
    checkSaveDir: (saveDir) => ipcRenderer.invoke('check-save-dir', saveDir),
    checkBakDirs: (bakDirs) => ipcRenderer.invoke('check-bak-dirs', bakDirs)
  });
});
