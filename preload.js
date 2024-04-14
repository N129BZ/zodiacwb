const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld('electronAPI', {
   onConvertUnits: (callback) => ipcRenderer.on("convert", (_event, unit) => callback(unit)), 
   saveappdata: (newappdata) => ipcRenderer.send('appdata:save', newappdata),
   getappdata: () => ipcRenderer.invoke('appdata:get'),
   showdev: (devstate) => ipcRenderer.send('menu:showdev', devstate),
   printscreen: () => ipcRenderer.send('function:print'),
   exitapp: () => ipcRenderer.send('function:exit'),
   //convertUnit: (unit) => ipcRenderer.send('function:convert', unit),
   receive: (channel, func) => {
      let validChannels = [
                            "toggletheme", 
                            "toggleimperial", 
                            "togglemetric", 
                            "printpage"
                          ]; 

      if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
});
