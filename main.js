const { app, BrowserWindow, clipboard, ipcMain } = require('electron');

let mainWindow;
let clipboardHistory = [];

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false // Needed for IPC communication
        }
    });

    mainWindow.loadFile('src/index.html');

    // Start monitoring the clipboard
    setInterval(checkClipboard, 1000);
}

function checkClipboard() {
    const text = clipboard.readText(); // Get current clipboard text
    if (text && clipboardHistory[clipboardHistory.length - 1] !== text) {
        clipboardHistory.push(text);
        mainWindow.webContents.send('updateClipboard', text);
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('copyText', (_, text) => {
    clipboard.writeText(text); // Copy text back to clipboard
});

ipcMain.on('saveClipboardHistory', (_, history) => {
    dialog.showSaveDialog({
        title: 'Save Clipboard History',
        defaultPath: 'clipboard-history.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    }).then(file => {
        if (!file.canceled) {
            fs.writeFileSync(file.filePath.toString(), history.join('\n'), 'utf-8');
        }
    }).catch(err => console.log(err));
});
