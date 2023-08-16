"use strict";

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");

let config = fs.readFileSync(path.join(__dirname, "zodiacwb.conf"),
    { encoding: "utf8", flag: "r" });

console.log(config);

function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 850,
        height: 575,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipcMain.on('saveConfig', (event, newconfig) => {
        let fname = path.join(__dirname, "zodiacwb.conf");
        fs.writeFileSync(fname, JSON.stringify(newconfig, null, 4));
        console.log(newconfig);
    });

    // and load the index.html of the app.
    win.loadFile('index.html')
    win.removeMenu();

    // Maybe open the DevTools.
    let thisconfig = JSON.parse(config);
    if (thisconfig.opendevtools) {
        win.webContents.openDevTools();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    ipcMain.handle('getConfig', handleConfig);
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

async function handleConfig() {
    return config;
}
