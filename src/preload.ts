// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    discordAPI: any;
  }
}

contextBridge.exposeInMainWorld('discordAPI', {
  getDetectableApplications: () => ipcRenderer.invoke('get-discord-detectable-applications')
});
