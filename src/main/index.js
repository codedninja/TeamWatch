import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

require('./m3u8.js');

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame:false,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.commandLine.appendSwitch('host-rules', 'MAP mf.svc.nhl.com freegamez.ga')

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback
  event.preventDefault();
  callback(true);
});

var streamWindows = [

];

// Listen for async message from renderer process
ipcMain.on('playstream', (event, arg) => {
  console.log(event);
  let child = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame:false,
    webPreferences: {
      webSecurity: false
    }
  });

  const childUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/player`
  : `file://${__dirname}/index.html#player`

  child.loadURL(childUrl);


  child.webContents.on('did-finish-load', () => {
    child.webContents.send('stream-url', arg)
  })

  streamWindows[child.id] = {
    window: child,
    game: arg[0],
    broadcast: arg[1]
  };

});


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
