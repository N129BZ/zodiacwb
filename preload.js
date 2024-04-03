const { contextBridge, ipcRenderer } = require("electron")
const { CustomTitlebar, TitlebarColor } = require('custom-electron-titlebar')
const path = require("path");

const tbColor = TitlebarColor.fromHex("#0987C1");

contextBridge.exposeInMainWorld('electronAPI', {
   saveconfig: (newconfig) => ipcRenderer.send('saveconfig', newconfig),
   getconfig: () => ipcRenderer.invoke('getconfig'),
});

window.addEventListener('DOMContentLoaded', () => {
   new CustomTitlebar({
      backgroundColor: tbColor,
      menuTransparency: 0.2
   });
});