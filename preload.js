const { contextBridge, ipcRenderer } = require("electron");
const { CustomTitlebar, TitlebarColor } = require('custom-electron-titlebar')

contextBridge.exposeInMainWorld('electronAPI', {
   saveconfig: (newconfig) => ipcRenderer.send('saveconfig', newconfig),
   getconfig: () => ipcRenderer.invoke('getconfig'),
});

window.addEventListener('DOMContentLoaded', () => {
   new CustomTitlebar({
		backgroundColor: TitlebarColor.fromHex("#0987C1"),
		menuTransparency: 0.2
	});
});
