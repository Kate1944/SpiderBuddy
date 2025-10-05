const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true, // Don't show in taskbar
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }

  });

  // Make most of window click-through except interactive elements
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  win.loadURL('data:text/html,<h1>Electron Works!</h1>');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
EOF