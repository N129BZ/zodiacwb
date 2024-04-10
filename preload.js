const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld('electronAPI', {
   saveappdata: (newappdata) => ipcRenderer.send('appdata:save', newappdata),
   getappdata: () => ipcRenderer.invoke('appdata:get'),
   showdev: (devstate) => ipcRenderer.send('menu:showdev', devstate),
   receive: (channel, func) => {
      let validChannels = ["toggletheme", "toggleimperial", "togglemetric", "showchart", "showairplane"]; 
      if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
});
