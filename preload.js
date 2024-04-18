const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld('electronAPI', {
   onAircraftSelect: (callback) => ipcRenderer.on("acselect", (_event, selection) => callback(selection)), 
   saveappdata: (newappdata) => ipcRenderer.send('appdata:save', newappdata),
   logentry: (entrytype, entry) => ipcRenderer.send('function:logentry', entrytype, entry),
   getappdata: () => ipcRenderer.invoke('appdata:get'),
   showdev: (devstate) => ipcRenderer.send('menu:showdev', devstate),
   printscreen: (printpdf) => ipcRenderer.send('function:print', printpdf),
   selectaircraft: () => ipcRenderer.send('function:selectaircraft'),
   reload: () => ipcRenderer.send('function:reload'),
   exitapp: () => ipcRenderer.send('function:exit'),
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
