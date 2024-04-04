const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
   saveappdata: (newappdata) => ipcRenderer.send('appdata:save', newappdata),
   getappdata: () => ipcRenderer.invoke('appdata:get'),
   receive: (channel, func) => {
      let validChannels = ["toggletheme"];
      if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
  }
});
