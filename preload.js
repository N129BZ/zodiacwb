const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
   getConfig: () => ipcRenderer.invoke('getConfig'),
   saveConfig: (newconfig) => ipcRenderer.send('saveConfig', newconfig)
});