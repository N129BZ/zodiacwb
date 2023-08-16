"use strict";

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");

let configpath = `${app.getPath("userData")}/zodiacwb.conf`; 

const defaultcfg = {
    "maxgross": 1320,
    "rmweight": 0,
    "rmarm": 635,
    "rmmoment": 0,
    "lmweight": 0,
    "lmarm": 635,
    "lmmoment": 0,
    "nwweight": 0,
    "nwarm": -533,
    "nwmoment": 0,
    "emptyweight": 0,
    "emptycg": 0,
    "emptymoment": 0,
    "pilotweight": 0,
    "pilotarm": 710,
    "pilotmoment": 0,
    "psgrweight": 0,
    "psgrarm": 710,
    "psgrmoment": 0,
    "rwlockweight": 0,
    "rwlockarm": 560,
    "rwlockmoment": 0,
    "lwlockweight": 0,
    "lwlockarm": 560,
    "lwlockmoment": 0,
    "fuelgals": 0,
    "fuelweight": 0,
    "fuelarm": 180,
    "fuelmoment": 0,
    "rbagweight": 0,
    "rbagarm": 1600,
    "rbagmoment": 0,
    "totalweight": 0,
    "totalcg": 0,
    "totalmoment": 0,
    "opendevtools": false
}

const loadConfig = function() {
    let cfg = "";
    if (!fs.existsSync(configpath)) {
        cfg = JSON.stringify(defaultcfg);
    }
    else {
        cfg = fs.readFileSync(configpath, { encoding: "utf8", flag: "r" });
    }
    return cfg;
}


let config = loadConfig();
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
        fs.writeFileSync(configpath, JSON.stringify(newconfig, null, 4));
        console.log(newconfig);
    });

    // and load the index.html of the app.
    win.loadFile('index.html')
    win.removeMenu();

    // Maybe open the DevTools.
    if (config.opendevtools) {
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

