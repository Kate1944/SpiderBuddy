const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let notepadWindow;
let trashWindow;
let BuddyWindow;

function createWindows() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create Notepad Window (top-left)
  notepadWindow = new BrowserWindow({
    width: 320,
    height: 450,
    x: -10,
    y: -15,
    //alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  notepadWindow.setMovable(true);

  notepadWindow.on('will-move', (event, bounds) => {
    const [x, y] = notepadWindow.getPosition();
    
  });

  // Create Trash Window (bottom-right)
  trashWindow = new BrowserWindow({
    width: 270,
    height: 380,
    x: width - 270,
    y: height - 330,
    //alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  

  // Load different URLs for each window
  notepadWindow.loadURL('http://localhost:5173/#/notepad');
  trashWindow.loadURL('http://localhost:5173/#/trash');
  // BuddyWindow.loadURL('http://localhost:5173/#/buddy');

  // Open DevTools for debugging
  notepadWindow.webContents.openDevTools({ mode: 'detach' });
  trashWindow.webContents.openDevTools({ mode: 'detach' });
  // BuddyWindow.webContents.openDevTools({ mode: 'detach' });
}

// Handle task dropped - forward from Notepad to Trash
ipcMain.on('task-dropped', (event, taskId) => {
  console.log('Main process received task-dropped:', taskId);
  // Send to trash window to trigger animation
  trashWindow.webContents.send('animate-trash', taskId);
});

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
