
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require("fs");
const path = require("path");

const isMac = process.platform === 'darwin'
const jsonPath = path.join(app.getPath("userData"), "zodiacwb.json");

var appData = loadAppData();

function loadAppData() {
    let adf = "";
    // make sure the file is stored in userData folder
    if (!fs.existsSync(jsonPath)) {
        adf = fs.readFileSync(path.join(__dirname, "zodiacwb.json"));
        fs.writeFileSync(jsonPath, adf);
    }
    else {
        adf = fs.readFileSync(jsonPath);
    }
    return JSON.parse(adf);
};

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
    { 
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'togglefullscreen' }
        ]
    },
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

if (require('electron-squirrel-startup')) app.quit();

function createWindow () {
    var w = 900;
    var h = 670; 
    if (appData.debug) {
        w = 1800;
        h = 900;
    }
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: w,
        height: h,
        frame: true,
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));

    if (appData.debug) {
        mainWindow.webContents.openDevTools();
    } 
}

app.whenReady().then(() => {
    ipcMain.handle('appdata:get', () => {
        return JSON.stringify(appData, null, 4);
    });
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', function () {
    if (isMac) app.quit()
});

ipcMain.on('appdata:save', (e, newappdata) => {
    appData = newappdata;
    fs.writeFileSync(jsonPath, JSON.stringify(appData, null, 4));
    console.log(appData);
});
