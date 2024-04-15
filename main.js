

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
const printImagePath = path.join(userPath, "printimage.jpg");
const printImageURL = url.pathToFileURL(printImagePath);
const isSWin32 = process.platform === "win32" ? true : false;
const isMac = process.platform === "darwin" ? true : false;
const isLinux = process.platform === "linux" ? true : false;

app.commandLine.appendSwitch ("disable-http-cache");

var mainWindow;

var appData = loadAppData();
const isDebug = appData.settings.debug;

function loadAppData() {
    let adf = "";
    // make sure the file is stored in userData folder
    if (!fs.existsSync(jsonPath)) {
        fs.copyFileSync(path.join(__dirname, "zodiacwb.json"), jsonPath);
    }
    adf = fs.readFileSync(jsonPath, "utf8");
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
            isMac ? { role: 'close' } : { role: 'quit' },
            { label: 'Print',
                click: () => app.emit('printpage')
            }
        ]
    },
    { 
        label: 'Units of Measure',
        submenu: [
            { label: "Pounds and Inches",
                click: () => app.emit('toggleimperial')
            },
            { label: "Kilos and Milligrams)",
                click: () => app.emit('togglemetric')
            },
            { label: "Convert Inches-Pounds to Metric", 
                click: () => mainWindow.webContents.send("convert", "convertvalues")
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'togglefullscreen' },
            { label: 'Toggle Dark Mode',
                accelerator: isMac ? 'Alt+Cmd+T' : 'Alt+Ctrl+T',
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
    app.on('convert', () => {
        inConvertMode = !inConvertMode;
        mainWindow.webContents.send("convert");
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

ipcMain.on('function:exitconvert', () => {
    mainWindow.reload(); 
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
        fs.writeFileSync(printImagePath, img.toJPEG(100), "base64", function (err) {
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
    const w = 850;
    const h = 930;
    
    let win = new BrowserWindow({ width: w, 
                                  height: h,
                                  modal: false, 
                                  frame: false,
                                  theme: appData.settings.theme,
                                  show: false
                                });
    win.loadFile(path.join(userPath, "printimage.jpg")); 
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
                // linux freezes on opening the printer dialog, but works if silent = true 
                silent: isLinux ? true : false,
                printBackground: false,
                color: true,
                margins: 'none',
                pageRanges: [0, 0],
                landscape: false,
                dpi: { horizontal:101.750, vertical:101.750 },
                printBackground: false,
                pagesPerSheet: 1,
                collate: false,
                copies: 1,
                pageSize: "Letter"
            }
            
            win.webContents.print(
                printoptions, (success, failureReason) => {
                   if (success) {
                      console.log("W & B printed!");
                   } else {
                      console.log(failureReason);
                   }
                   win.close();
                   win = null;  
                }
            );
        })
        .catch(error => {
            console.log(error);
        })
    })
}
