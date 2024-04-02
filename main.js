
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require("fs");
const path = require("path");

var confObj = loadConfig();
const isMac = process.platform === 'darwin'
const template = [
    ...(isMac
        ? [{
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }]
        : []
        ),
    // { role: 'fileMenu' }
    { 
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { role: 'togglefullscreen' }
        ]
    },
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function loadConfig() {
    let cfgfile = path.join(__dirname, "zodiacwb.conf");
    let cfg = fs.readFileSync(cfgfile, { encoding: "utf8", flag: "r" });
    return JSON.parse(cfg);
}

function getConfigAsString() {
    return JSON.stringify(confObj, null, 4);
}

if (require('electron-squirrel-startup')) app.quit();

function createWindow () {
    var w = 900;
    var h = 600;
    if (confObj.debug) {
        w = 1800;
        h = 900;
    }
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: w,
        height: h,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    //mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
    
    if (confObj.debug) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    ipcMain.handle('getconfig', getConfigAsString);
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('saveconfig', (e, newconfig) => {
    let cfgfile = path.join(__dirname, "zodiacwb.conf");
    fs.writeFileSync(cfgfile, JSON.stringify(newconfig, null, 4));
    confObj = newconfig;
    console.log(confObj);
});
    

