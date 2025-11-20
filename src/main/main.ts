import { app, BrowserWindow, ipcMain, screen, Menu, Tray } from 'electron';
import * as path from 'path';
import { SystemMonitor } from './systemMonitor';
import { MonitorSettings, DEFAULT_SETTINGS, SystemStats } from '../shared/types';
import * as fs from 'fs';

let monitorWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const monitor = new SystemMonitor();
let updateInterval: NodeJS.Timeout | null = null;
let currentSettings: MonitorSettings = { ...DEFAULT_SETTINGS };

const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

// Load settings from file
function loadSettings(): MonitorSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return { ...DEFAULT_SETTINGS };
}

// Save settings to file
function saveSettings(settings: MonitorSettings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

function createMonitorWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = 280;
  const windowHeight = 200;

  monitorWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: currentSettings.position?.x ?? width - windowWidth - 20,
    y: currentSettings.position?.y ?? height - windowHeight - 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  monitorWindow.setAlwaysOnTop(true, 'floating');
  monitorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  if (process.env.NODE_ENV === 'development') {
    monitorWindow.loadURL('http://localhost:3000');
  } else {
    monitorWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  monitorWindow.on('closed', () => {
    monitorWindow = null;
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  });

  // Save window position when moved
  monitorWindow.on('moved', () => {
    if (monitorWindow) {
      const [x, y] = monitorWindow.getPosition();
      currentSettings.position = { x, y };
      saveSettings(currentSettings);
    }
  });

  startMonitoring();
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 500,
    height: 600,
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    settingsWindow.loadURL('http://localhost:3000#settings');
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: 'settings'
    });
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function startMonitoring() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  const sendStats = async () => {
    if (monitorWindow && !monitorWindow.isDestroyed()) {
      try {
        const stats = await monitor.getAllStats(
          currentSettings.showGpu,
          currentSettings.showProcesses
        );
        monitorWindow.webContents.send('system-stats', stats);
      } catch (error) {
        console.error('Error getting system stats:', error);
      }
    }
  };

  // Send initial stats
  sendStats();

  // Update at specified interval
  updateInterval = setInterval(sendStats, currentSettings.refreshInterval);
}

function createTray() {
  // Note: You'll need to create an icon file for the tray
  // tray = new Tray(path.join(__dirname, '../../assets/icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => createSettingsWindow()
    },
    {
      label: 'Show/Hide Monitor',
      click: () => {
        if (monitorWindow) {
          if (monitorWindow.isVisible()) {
            monitorWindow.hide();
          } else {
            monitorWindow.show();
          }
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  // tray.setContextMenu(contextMenu);
  // tray.setToolTip('Resource Monitor');
}

// IPC Handlers
ipcMain.handle('get-settings', () => {
  return currentSettings;
});

ipcMain.handle('save-settings', (event, settings: MonitorSettings) => {
  currentSettings = { ...currentSettings, ...settings };
  saveSettings(currentSettings);

  // Restart monitoring with new interval if changed
  if (updateInterval) {
    startMonitoring();
  }

  // Update monitor window opacity
  if (monitorWindow && !monitorWindow.isDestroyed()) {
    monitorWindow.setOpacity(currentSettings.opacity);
  }

  return true;
});

ipcMain.handle('open-settings', () => {
  createSettingsWindow();
});

ipcMain.handle('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

ipcMain.handle('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.minimize();
});

// App lifecycle
app.whenReady().then(() => {
  currentSettings = loadSettings();
  createMonitorWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMonitorWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
