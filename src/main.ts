import { spawn } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import { promises as fs } from 'fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';

const isDev = process.env.NODE_ENV === 'development'
const resourcesPath = isDev ? path.join(__dirname, 'resources') : process.resourcesPath;
const dataFilePath = path.join(resourcesPath, 'data', 'applications.json');
let detectableApplications: any[] | null = null;

if (isDev) {
  (async () => {
    const src = path.join(resourcesPath, '../../../resources/dummy.exe');
    const dest = path.join(resourcesPath, 'dummy.exe');

    try {
      await fs.mkdir(resourcesPath, { recursive: true });
      await fs.copyFile(src, dest);
      console.log(`dummy.exe successfully copied to ${dest}`);
    } catch (err) {
      console.error('Failed to copy dummy.exe:', err);
    }
  })();
}

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.openDevTools();
};

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

app.on('ready', async () => {
  await initialStartupTasks();

  ipcMain.handle('get-discord-detectable-applications', () => {
    return detectableApplications || [];
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('simulate-app', async (event, appId: string) => {
  console.log(`Simulate app received for app ID ${appId}`);

  if (!detectableApplications) {
    console.error('No detectable applications loaded');
    return;
  }

  const app = detectableApplications.find((app) => app.id === appId);

  if (!app) {
    console.error(`App with id ${appId} not found.`);
    return;
  }

  const winExecutables = (app.executables || []).filter((exe: any) => exe.os === 'win32');

  if (winExecutables.length === 0) {
    console.error(`No Windows executables found for app ${app.name}`);
    return;
  }

  const exeRelativePath = winExecutables[0].name;
  const baseExePath = path.join(resourcesPath, 'executables');
  const destExePath = path.join(baseExePath, exeRelativePath);
  const dummyExePath = path.join(resourcesPath, 'dummy.exe');

  try {
    await fs.mkdir(path.dirname(destExePath), { recursive: true });
    await fs.copyFile(dummyExePath, destExePath);

    const child = spawn(destExePath, [], { detached: true, stdio: 'ignore' });
    child.unref();

  } catch (error) {
    console.error('Error during simulate-app execution:', error);
  }
});
