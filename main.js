
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main')
const fs = require("fs");
const path = require("path");

const isMac = process.platform === 'darwin'

var appData = loadAppData();

setupTitlebar();

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
    // { role: 'editMenu' }
    { 
        label: 'Edit',
        submenu: [
          { 
            label: 'Toggle debug mode',
            click: () => app.emit('toggledebug'),
          }
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

function loadAppData() {
    let datafile = path.join(__dirname, "zodiacwb.data");
    let data = fs.readFileSync(cfgfile, { encoding: "utf8", flag: "r" });
    return JSON.parse(data);
}

function getAppDataAsString() {
    return JSON.stringify(appData, null, 4);
}

if (require('electron-squirrel-startup')) app.quit();

function createWindow () {
    var w = 900;
    var h = 630; 
    if (appData.debug) {
        w = 1800;
        h = 900;
    }
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: w,
        height: h,
        titleBarStyle: "hidden",
        titleBarOverlay: true,
        frame: false,
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));

    attachTitlebarToWindow(mainWindow);

    if (appData.debug) {
        mainWindow.webContents.openDevTools();
    } 
}

app.whenReady().then(() => {
    ipcMain.handle('getappdata', getAppDataAsString);
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', function () {
    if (isMac) app.quit()
});

app.on('toggledebug', () => {
    appData.debug = !appData.debug;
    saveAppData(appData);
    app.relaunch();
    app.exit();
});

ipcMain.on('saveappdata', (e, newappdata) => {
    appData = newappdata;
    saveAppData(appData);
});

function saveAppData(appdata) {
    let datafile = path.join(__dirname, "zodiacwb.data");
    fs.writeFileSync(datafile, JSON.stringify(appdata, null, 4));
    console.log(appdata);
}
