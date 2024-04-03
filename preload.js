const { contextBridge, ipcRenderer } = require("electron");
const { CustomTitlebar, TitlebarColor } = require('custom-electron-titlebar')
const appdata = require("./zodiacwb.json");

contextBridge.exposeInMainWorld('electronAPI', {
   saveappdata: (newappdata) => ipcRenderer.send('appdata:save', newappdata),
   getappdata: () => ipcRenderer.invoke('appdata:get'),
});

window.addEventListener('DOMContentLoaded', () => {
   new CustomTitlebar({
		backgroundColor: TitlebarColor.fromHex(appdata.titlebarcolor),
		menuTransparency: 0.2
	});
});
