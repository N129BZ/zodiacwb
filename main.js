
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require("fs");
const path = require("path");

let configfile = path.join(__dirname, "zodiacwb.conf"); 

function loadConfig() {
    let cfg = fs.readFileSync(configfile, { encoding: "utf8", flag: "r" });
    return cfg;
}

let config = loadConfig();
if (require('electron-squirrel-startup')) app.quit();

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 850,
        height: 575,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }

    });
    mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    ipcMain.handle('getconfig', loadConfig);
    createWindow();
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('saveconfig', (evt, newconfig) => {
    fs.writeFileSync(configfile, JSON.stringify(newconfig, null, 4));
    console.log(newconfig);
});
    

