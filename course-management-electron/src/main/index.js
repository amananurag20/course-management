import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow = null
let tray = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    autoHideMenuBar: true,
    title: 'Course Management System',
    backgroundColor: '#111827', // Dark background
    icon: join(__dirname, '../../resources/logo-coursemanagement.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Maximize window on start
  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray() {
  // Load the tray icon
  const trayIconPath = join(__dirname, '../../resources/logo-coursemanagement.png')
  let trayIcon = nativeImage.createFromPath(trayIconPath)

  // Resize icon for tray (16x16 for Windows, 22x22 for macOS)
  if (process.platform === 'win32') {
    trayIcon = trayIcon.resize({ width: 16, height: 16 })
  } else if (process.platform === 'darwin') {
    trayIcon = trayIcon.resize({ width: 22, height: 22 })
  }

  tray = new Tray(trayIcon)

  // Create context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open App',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        } else {
          createWindow()
        }
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Course Management System')
  tray.setContextMenu(contextMenu)

  // Double-click to open app (Windows/Linux)
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    } else {
      createWindow()
    }
  })

  // Single click to open app (macOS)
  if (process.platform === 'darwin') {
    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show()
        mainWindow.focus()
      } else {
        createWindow()
      }
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.coursemanagement')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Create system tray
  createTray()

  // Create main window
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Prevent quit when closing window (minimize to tray instead)
app.on('window-all-closed', () => {
  // Don't quit the app, keep it running in tray
  // User must explicitly quit from tray menu
})

// Handle before-quit to ensure proper cleanup
app.on('before-quit', () => {
  app.isQuitting = true
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
