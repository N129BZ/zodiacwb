const { contextBridge, ipcRenderer } = require("electron");
const { CustomTitlebar, TitlebarColor } = require('custom-electron-titlebar')

contextBridge.exposeInMainWorld('electronAPI', {
   saveappdata: (newappdata) => ipcRenderer.send('appdata:save', newappdata),
   getappdata: () => ipcRenderer.invoke('appdata:get'),
});

window.addEventListener('DOMContentLoaded', (e) => {
   new CustomTitlebar({
		backgroundColor: TitlebarColor.fromHex("#0987C1"),
		menuTransparency: 0.2
	});
});
