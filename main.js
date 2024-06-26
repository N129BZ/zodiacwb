

const { 
    app, 
    BrowserWindow, 
    Menu,
    ipcMain, 
    screen,
    dialog,
    nativeTheme, 
    globalShortcut, 
    webContents} = require('electron');

const url = require("url");
const print = require("print");
const fs = require("fs");
const path = require("path");
const userPath = app.getPath("userData");
const jsonPath = path.join(userPath, "zodiacwb.json");
const logpath = path.join(userPath, "zodiacwb.log");
const printImagePath = path.join(userPath, "printimage.jpg");
const printImageURL = url.pathToFileURL(printImagePath);
const isSWin32 = process.platform === "win32" ? true : false;
const isMac = process.platform === "darwin" ? true : false;
const isLinux = process.platform === "linux" ? true : false;

app.commandLine.appendSwitch ("disable-http-cache");

var mainWindow;
var appData = loadAppData();
var isDebug = appData.settings.debug;

/**
 * Read the zodiacwb.json file and parse it into an object
 * @returns {object}
 */
function loadAppData() {
    let adf = "";
    // make sure the file is stored in userData folder
    if (!fs.existsSync(jsonPath)) {
        fs.copyFileSync(path.join(__dirname, "zodiacwb.json"), jsonPath);
    }
    adf = fs.readFileSync(jsonPath, "utf8");
    return JSON.parse(adf);
};

/**
 * The top-line menu template
 */
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
            { label: "Pounds/Inches",
                id: "pi",
                type: "radio",
                checked: getUOMChecked("imperial"), 
                click: () => app.emit('toggleuom')
            },
            { label: "Kilograms/Millimeters",
                id: "km",
                type: "radio",
                checked: getUOMChecked("metric"),
                click: () => app.emit('toggleuom')
            }
        ]
    },
    {
        label: "Select Aircraft", 
        submenu: [
            {label: "Zodiac ch601xl/ch650 Tricycle",
                type: "radio",
                checked: getAircraftChecked("ch650"),
                click: () => mainWindow.webContents.send("acselect", "ch650"),
            },  
            { label: "Zodiac ch601xl/ch650 Taildragger",
                type: "radio",
                checked: getAircraftChecked("ch650td"),
                click: () => mainWindow.webContents.send("acselect", "ch650td")
            },
            {label: "Zenith ch701",
                type: "radio",
                checked: getAircraftChecked("ch701"),
                click: () => mainWindow.webContents.send("acselect", "ch701")
            },
            {label: "Zenith ch750",
                type: "radio",
                checked: getAircraftChecked("ch750"),
                click: () => mainWindow.webContents.send("acselect", "ch750")
            },
            {label: "Zenith CruZer",
                type: "radio",
                checked: getAircraftChecked("chCruzer"),
                click: () => mainWindow.webContents.send("acselect", "chCruzer")
            },
            {label: "Vans RV9a",
                type: "radio",
                checked:getAircraftChecked("rv9a"),
                click: () => mainWindow.webContents.send("acselect", "rv9a")
            },
            {label: "Vans RV9",
                type: "radio",
                checked: getAircraftChecked("rv9"),
                click: () => mainWindow.webContents.send("acselect", "rv9")
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

/**
 * Build the menu from the template and instantiate it
 */
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

nativeTheme.themeSource = appData.settings.theme;

/**
 * Save the zodiacwb.json file
 */
function saveAppData() {
    fs.writeFileSync(jsonPath, JSON.stringify(appData, null, 4));
}

/**
 * Hide the Kilograms/Millimeters UOM radio button for RV aircraft 
 */
if (appData.settings.currentview === "rv9" || appData.settings.currentview === "rv9a") {
    let mi = menu.getMenuItemById("km");
    mi.visible = false;
}

if (require('electron-squirrel-startup')) app.quit();

/**
 * Create the application window
 */
function createWindow () {
    const pd = screen.getPrimaryDisplay();
    var wh = {};
    wh = pd.workAreaSize;
    var dtoggled = false;

    var w = 840;
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
        mainWindow.webContents.send('toggletheme');
    });

    app.on('filesave', () => {
        mainWindow.webContents.capturePage()
    });

    /**
     * Call from renderer to print
     */
    app.on('printpage', () => {
        handlePrinting();
    });

    /**
     * Call from renderer to toggle "developer mode"
     */
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

    /**
     * User has toggled Units of Measurement option
     */
    app.on('toggleuom', function() {
        var uom = "imperial";
        var allowmetric = true;
        var valdata = {};
        var view = appData.settings.currentview;
        switch (view) {
            case "ch650":
                valdata = appData.ch650; 
                break;
            case "ch650td":
                valdata = appData.ch650td; 
                break;
            case "ch701":
                valdata = appData.ch701; 
                break;
            case "ch750":
                valdata = appData.ch750; 
                break;
            case "ch750Cruzer":
                valdata = appData.ch750Cruzer; 
                break;
            case "rv9":
                allowmetric = false;
                valdata = appData.rv9;
                break;    
            case "rv9a":
                allowmetric = false;
                valdata = appData.rv9a;
                break;
        }
        
        if (view === "rv9" && view === "rv9a") {
            uom = "imperial";
            valdata.units = "imperial";
        } else { // flip UOM 
            uom = valdata.units;
            valdata.units = uom === "imperial" ? "metric" : "imperial";
        }
       
        if (allowmetric) { // Zeniths are always allowed, rv's not
            setMetricOptionProperties(true);
        } else {
            setMetricOptionProperties(false)
        }
        
        saveAppData();
        mainWindow.reload();
    }); 
}

/**
 * Toggle the theme from light to dark or vice-versa
 */
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

/**
 * Call from renderer to save the zodiacwb.json file
 */
ipcMain.on('appdata:save', (e, newappdata) => {
    appData = newappdata;
    saveAppData();
    mainWindow.reload();
});

/**
 * Call from renderer that the user has selected a different aircraft
 */
ipcMain.on('function:selectaircraft',(e, aircraft) => {
    console.log(aircraft);
    if (aircraft === "rv9" || aircraft === "rv9a") { // rv's are always imperial
        setMetricOptionProperties(false);
    } else { // Zenith aircraft can be either metric or imperial
        setMetricOptionProperties(true);
    }
    mainWindow.reload(); 
});

/**
 * Call from renderer to reload the html page
 */
ipcMain.on('function:reload', () => {
    mainWindow.reload(); 
});

/**
 * Called from renderer to print screen shot
 */
ipcMain.on('function:print', (e, printpdf) => {
    handlePrinting(printpdf);
});

/**
 * Set Units of Measurement menu item visibility
 * @param {boolean} isvisible 
 */
function setMetricOptionProperties(isvisible) {
    let mi = menu.getMenuItemById("km");
    mi.visible = isvisible;
    mi.enabled = isvisible;
}

/**
 * Called by menu to put check in selected airplane checkbox
 * @param {string} oneAirplane 
 * @returns {boolean}
 */
function getAircraftChecked(oneAirplane) {
    if (oneAirplane === appData.settings.currentview) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Called by Menu to set the UOM radio button to the view's current UOM
 * @param {string} uom 
 * @returns {boolean}
 */
function getUOMChecked(uom) {
    let state = false;
    switch (appData.settings.currentview) {
        case "ch650":
            state = uom === appData.ch650.units;
            break;
        case "ch650td":
            state = uom === appData.ch650td.units;
            break;
        case "ch701":
            state = uom === appData.ch701.units;
            break;
        case "ch750":
            state = uom === appData.ch750.units;
            break;
        case "ch750Cruzer":
            state = uom === appData.ch750Cruzer.units;
            break;
        default:
            state = uom === "imperial";
            break;
    }
    return state;
}

function handlePrinting() {
    if (appData.settings.printaspdf) {
        printToPdf();
    } else {
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
        .then(() => {
            createScreenshotHtmlPage();
            printScreenShot();
        })
        .catch(error => {
            console.log(error);
        }) 
        .finally(() => {
            mainWindow.reload();
        })   
    }
}

ipcMain.on('function:exit', () => {
    mainWindow.close();
    mainWindow = null;
});

/**
 * User clicked 10 times on the WEIGHT heading, toggle developer mode
 */
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

/**
 * Take a snapshot of the app window and print it
 */
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
                    silentprint = isLinux ? true : false;
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

/**
 * User selected Print to PDF 
 */
function printToPdf() {
    let options = {
        title: "Save Screenshot As PDF",
        filters: [{ name: "PDF Files", extensions: ["pdf"]}, { name: 'All Files', extensions: ['*'] }],
        properties: isLinux ? ["openFile", "openDirectory"] : ["openFile"]
    }
    let pdfPath = dialog.showSaveDialogSync(mainWindow, options)
    if (pdfPath != undefined) {
        mainWindow.webContents.printToPDF({}).then(data => {
            fs.writeFile(pdfPath, data, (error) => {
                if (error) throw error
                console.log(`Wrote PDF successfully to ${pdfPath}`)
            })
        })
        .catch(error => {
            logEntry(logEntryType.error, `Failed to write PDF to ${pdfPath}: ${error}`);
        })
        .finally(() => {
            mainWindow.reload();
        })
    }
}

/**
 * Log entries from renderer process
 */
ipcMain.on("function:logentry", (e, entrytype, entry) => {
    if (appData.debug) {
        let logdate = new Date().toLocaleString();
        let logline = "Unknown Entry: ";
        if (entrytype === "error") {
            logline = `Error: ${entry}`;
        } else if (entrytype === "debug") {
            logline = `Debug: ${entry}`;
        } else {
            logline = `Info: ${entry}`
        }

        let logdata = `${logdate}:  ${logline}\r`; 
        fs.appendFileSync(logpath, logdata);
    }
});
