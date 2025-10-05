mkdir electron
cat > electron/main.cjs << 'EOF'
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  });

  win.loadURL('data:text/html,<h1>Electron Works!</h1>');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
EOF