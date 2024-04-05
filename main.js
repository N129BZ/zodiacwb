
const { subtle } = require('crypto');
const { 
    app, 
    BrowserWindow, 
    Menu, 
    ipcMain, 
    nativeTheme, 
    globalShortcut } = require('electron');

const fs = require("fs");
const path = require("path");

const isMac = process.platform === 'darwin'
const jsonPath = path.join(app.getPath("userData"), "zodiacwb.json");

app.commandLine.appendSwitch ("disable-http-cache");
var appData = loadAppData();
const isDebug = appData.debug;

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
            { role: 'togglefullscreen' },
            { label: 'Toggle Dark Mode',
                accelerator: process.platform === 'darwin' ? 'Alt+Cmd+T' : 'Alt+Ctrl+T',
                click: () => app.emit('toggletheme')
            },
        ]
    }
    // ...(isDebug
    //     ? [{
    //         label: "Debug",
    //         submenu: [
    //             { label: 'Toggle Developer Tools',
    //                 accelerator: process.platform === 'darwin' ? 'Alt+Cmd+D' : 'Alt+Ctrl+D',
    //                 click: () => app.emit('toggledev')
    //             }
    //           ]
    //         }] 
    //     : []  
    // )
]

var appData = loadAppData();
nativeTheme.themeSource = appData.theme;

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
}

function saveAppData() {
    fs.writeFileSync(jsonPath, JSON.stringify(appData, null, 4));
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

if (require('electron-squirrel-startup')) app.quit();

function createWindow () {
    var dtoggled = false;
    var w = 900;
    var h = 670; 
    if (appData.debug) {
        w = 1400;
        h = 900;
    }
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: w,
        height: h,
        frame: true,
        icon: path.join(__dirname, "zwblogo.png"),
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, "preload.js")
        }
    });
    
    mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));

    if (appData.debug) {
        mainWindow.webContents.openDevTools();
    } 

    app.on('toggletheme', () => {
        toggleTheme();
        saveAppData();
        mainWindow.webContents.send('toggletheme');
    });

    app.on('toggledev', () => {
        if (!dtoggled) {
            mainWindow.webContents.openDevTools();
            dtoggled = true;
            h = 900;
            w = 1400;
        } else {
            mainWindow.webContents.closeDevTools();
            dtoggled = false;
            h = 670;
            w = 900;
        }
        mainWindow.setSize(w, h, true);
    });
}

function toggleTheme() {
    if (nativeTheme.shouldUseDarkColors) {
        appData.theme = "light";
    } else {
        appData.theme = "dark";
    }
    nativeTheme.themeSource = appData.theme;
}

app.whenReady().then(() => {
    globalShortcut.register('Alt+CommandOrControl+T', () => {
        toggleTheme();
    });
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
    saveAppData();
});

ipcMain.on('menu:showdev', (e, devstate) => {
    appData.debug = devstate.state;
    saveAppData();
    app.relaunch();
    app.exit(0);
});
