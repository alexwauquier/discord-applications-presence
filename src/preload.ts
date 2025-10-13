import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    discordAPI: any;
  }
}

contextBridge.exposeInMainWorld('discordAPI', {
  getDetectableApplications: () => ipcRenderer.invoke('get-discord-detectable-applications')
});
