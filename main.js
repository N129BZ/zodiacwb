

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
const userPath = app.getPath("userData");
const jsonPath = path.join(userPath, "zodiacwb.json");
const printImagePath = path.join(userPath, "printimage.png");
const printImageURL = url.pathToFileURL(printImagePath);

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
    const pd = screen.getPrimaryDisplay();
    var wh = {};
    wh = pd.workAreaSize;
    var dtoggled = false;

    var w = 830;
    var h = wh.height - 40; 
    if (isDebug) {
        w = wh.width;
    }
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: w,
        height: h,
        frame: true,
        icon: path.join(__dirname, "zwblogo.png"),
        theme: appData.settings.theme,
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
    const pd = screen.getPrimaryDisplay();
    var wh = {};
    wh = pd.workAreaSize;
    var w = 830;
    var h = wh.height - 40; 
    mainWindow.webContents.capturePage({
        x: 0,
        y: 0,
        width: w,
        height: h
    })
    .then((img) => {
        if (fs.existsSync(printImagePath)) fs.rmSync(printImagePath);
        fs.writeFileSync(printImagePath, img.toPNG(), "base64", function (err) {
            if (err) console.log(err);
        });
    })
    .catch(error => {
        console.log(error);
    })

    createScreenshotHtmlPage();
    printScreenShot();
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

function createScreenshotHtmlPage() {
    let filepath = path.join(__dirname, "renderer", "printpage.html");
    let file = fs.readFileSync(filepath, { encoding: 'utf-8', flag: 'r'});
    let html = file.replace("fileURL", printImageURL);
    fs.writeFileSync(path.join(userPath, "printpage.html"), html);
}

function printScreenShot() {
    const sfactor = screen.getPrimaryDisplay().scaleFactor;
    const w = 850 / sfactor;
    const h = 930 / sfactor;
    let win = new BrowserWindow({ width: w, 
                                  height: h,
                                  modal: false, 
                                  frame: false,
                                  theme: appData.settings.theme,
                                  show: false
                                });
    win.loadFile(path.join(userPath, "printpage.html")); 
    win.webContents.on('did-finish-load', function() {
        win.removeMenu();
        win.show();

        win.webContents.getPrintersAsync()
        .then((data) => {
            let devicename;
            data.forEach((printer) => {
                if (printer.isDefault) {
                    devicename = printer.name;
                    return;
                }
            });
            const printoptions = {
                deviceName: devicename,
                silent: true,
                printBackground: false,
                color: true,
                margins: 'none',
                //scaleFactor: 170,
                pageRanges: [0, 0],
                dpi: {horizontal: w, vertical: h},
                landscape: false,
                printBackground: false,
                pagesPerSheet: 1,
                collate: false,
                copies: 1,
                pageSize: "Letter"
            }
        
            win.webContents.print(printoptions, () => {
                console.log("W & B printed!");
                win.close();
                win = null;
            });
        })
        .catch(error => {
            console.log(error);
        })
    })
}
