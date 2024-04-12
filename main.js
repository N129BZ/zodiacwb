

const { 
    app, 
    BrowserWindow, 
    Menu,
    ipcMain, 
    screen,
    nativeTheme, 
    globalShortcut, 
    webContents} = require('electron');

const url = require("url");
const print = require("print");
const fs = require("fs");
const path = require("path");
const jsonPath = path.join(app.getPath("userData"), "zodiacwb.json");
const printImagePath = path.join(__dirname, "renderer", "printimage.png");

app.commandLine.appendSwitch ("disable-http-cache");

var mainWindow;

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
    ...(process.platform === "darwin"
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
            process.platform === "darwin" ? { role: 'close' } : { role: 'quit' },
            { label: 'Print',
                click: () => app.emit('printpage')
            }
        ]
    },
    { 
        label: 'Units of Measure',
        submenu: [
            { label: "Imperial (pounds/inches)",
                click: () => app.emit('toggleimperial')
            },
            { label: "Metric (kilograms/millimeters)",
                click: () => app.emit('togglemetric')
            }
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
    var w = 850;
    var h = 650; 
    if (isDebug) {
        w = 1400;
        h = 900;
    }
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: w,
        height: h,
        frame: true,
        icon: path.join(__dirname, "zwblogo.png"),
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, "preload.js")
        }
    });
    
    mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
    
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
    app.on('filesave', () => {
        mainWindow.webContents.capturePage()
    });
    app.on('printpage', () => {
        getScreenShot();
        /* mainWindow.webContents.capturePage({
            x: 20,
            y: 20,
            width: 798,
            height: 529
        })
        .then((img) => {
            if (fs.existsSync(printImagePath)) fs.rmSync(printImagePath);
            fs.writeFileSync(printImagePath, img.toPNG(), "base64", function (err) {
                if (err) console.log(err);
            });
        })
        .then(() => {
            printPage();
        })
        .catch(error => {
            console.log(error);
        }) */
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
    // toggling the opposite of the current theme
    let isDark = nativeTheme.shouldUseDarkColors
    if (isDark) {
        appData.settings.theme = "light";
    } else {
        appData.settings.theme = "dark";
    }
    saveAppData();
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

ipcMain.on('function:print', () => {
    getScreenShot();
});

ipcMain.on('function:exit', () => {
    mainWindow.close();
    mainWindow = null;
});

ipcMain.on('menu:showdev', (e, devstate) => {
    appData.settings.debug = devstate.state;
    saveAppData();
    app.relaunch();
    app.exit(0);
});

function getScreenShot() {
    mainWindow.webContents.capturePage({
        x: 20,
        y: 20,
        width: 805,
        height: 520
    })
    .then((img) => {
        if (fs.existsSync(printImagePath)) fs.rmSync(printImagePath);
        fs.writeFileSync(printImagePath, img.toPNG(), "base64", function (err) {
            if (err) console.log(err);
        });
    })
    .then(() => {
        printScreenShot();
    })
    .catch(error => {
        console.log(error);
    })
}

function printScreenShot() {
    const sfactor = screen.getPrimaryDisplay().scaleFactor;
    const w = 788 / sfactor;
    const h = 529 / sfactor;
    let win = new BrowserWindow({ width: w, 
                                  height: h,
                                  modal: true, 
                                  frame: false,
                                  theme: 'light'
                                });
    win.loadURL(path.join(__dirname, "renderer", "printpage.html")); 
    win.once('ready-to-show', () => {
        win.removeMenu();
        win.show();
    });
    win.webContents.on('did-finish-load', () => {
    win.webContents.getPrintersAsync().then((data) => {
            let devicename;
            data.forEach((printer) => {
                if (printer.isDefault) {
                    devicename = printer.name;
                }
            })

            const printoptions = {
                deviceName: devicename,
                silent: false,
                margins: {marginType: 'none'},
                printBackground: false,
                color: true,
                scaleFactor: 120,
                dpi: {horizontal: w, vertical: h},
                landscape: false,
                printBackground: false,
                pagesPerSheet: 1,
                collate: false,
                copies: 1,
            };

            try {
                win.webContents.print(printoptions, () => {
                    console.log("W & B printed!");
                    win.close();
                    win = null;
                });
            }
            catch(error) {
                console.log(error);
            }
        })
        .catch(error => {
            console.log(error);
        })
    })
}
