
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
const isDebug = appData.settings.debug;

function loadAppData() {
    let adf = "";
    // make sure the file is stored in userData folder
    if (!fs.existsSync(jsonPath)) {
        adf = fs.readFileSync(path.join(__dirname, "zodiacwb.json"), "utf8");
        fs.writeFileSync(jsonPath, adf);
    }
    else {
        adf = fs.readFileSync(jsonPath, "utf8");
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
            { role: "separator"},
            { role: 'reload' }
        ]
    },
    { 
        label: 'Presenation Options',
        submenu: [
            { label: 'Measurement Units', 
                submenu: [
                    { label: "Imperial (pounds/inches)",
                        click: () => app.emit('toggleimperial')
                    },
                    { label: "Metric (kilograms/millimeters)",
                        click: () => app.emit('togglemetric')
                    }
                ]
            },
            { label: "Mode",
                submenu: [
                    { label: "Show w&b on Chart",
                        click: () => app.emit('showchart')
                    },
                    { label: "Show w&b on Aircraft Image",
                        click: () => app.emit("showairplane")
                    }
                ]

            }
        ]
    }
]

nativeTheme.themeSource = appData.settings.theme;

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
    if (isDebug) {
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

    if (isDebug) {
        mainWindow.webContents.openDevTools();
    } 

    app.on('toggletheme', () => {
        toggleTheme();
        saveAppData();
        mainWindow.webContents.send('toggletheme');
    });

    app.on('toggleimperial', () => {
        appData.settings.units = "imperial";
        saveAppData();
        mainWindow.reload(); 
    });
    app.on('togglemetric', () => {
        appData.settings.units = "metric";
        saveAppData();
        mainWindow.reload(); 
    });
    app.on('showchart', () => {
        appData.settings.mode = "chart";
        saveAppData();
        mainWindow.reload();
    });
    app.on('showairplane', () => {
        appData.settings.mode = "airplane";
        saveAppData();
        mainWindow.reload();
    })
    app.on('filesave', () => {
        mainWindow.webContents.send('filesave');
    });

    app.on('toggledev', () => {
        if (!dtoggled) {
            appData.settings.debug = true;
            isDebug = true;
            mainWindow.webContents.openDevTools();
            dtoggled = true;
            h = 900;
            w = 1400;
        } else {
            appData.settings.debug = false;
            isDebug = false;
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
        appData.settings.theme = "light";
    } else {
        appData.settings.theme = "dark";
    }
    nativeTheme.themeSource = appData.settings.theme;
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
    app.quit()
});

ipcMain.on('appdata:save', (e, newappdata) => {
    appData = newappdata;
    saveAppData();
});

ipcMain.on('menu:showdev', (e, devstate) => {
    appData.settings.debug = devstate.state;
    saveAppData();
    app.relaunch();
    app.exit(0);
});
