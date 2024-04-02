const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
   saveconfig: (newconfig) => ipcRenderer.send('saveconfig', newconfig),
   getconfig: () => ipcRenderer.invoke('getconfig')
});