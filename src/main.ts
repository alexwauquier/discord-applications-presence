import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await initialStartupTasks();

  ipcMain.handle('get-discord-detectable-applications', () => {
    return detectableApplications || [];
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

import { promises as fs } from 'fs';

const dataFilePath = path.join(__dirname, 'data', 'applications.json');

let detectableApplications: any[] | null = null;

const fetchDiscordDetectableApplications = async () => {
  const url = 'https://discord.com/api/v10/applications/detectable';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const applications = await response.json();
    return applications;
  } catch (error) {
    console.error('Failed to fetch Discord applications:', error);
    return null;
  }
}

const saveDetectableApplicationsToFile = async (applications: any) => {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(applications, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save detectable applications to file:', error);
  }
}

const loadDetectableApplicationsFromFile = async () => {
  try {
    await fs.access(dataFilePath);
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('No cached detectable applications found (file does not exist)');
    } else {
      console.error('Error reading cached applications file:', error);
    }
    return null;
  }
}

async function initialStartupTasks() {
  detectableApplications = await loadDetectableApplicationsFromFile();
  if (!detectableApplications) {
    detectableApplications = await fetchDiscordDetectableApplications();
    if (detectableApplications) {
      await saveDetectableApplicationsToFile(detectableApplications);
    } else {
      detectableApplications = [];
    }
  }
}
