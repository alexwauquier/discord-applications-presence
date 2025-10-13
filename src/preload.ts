import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    discordAPI: any;
    electronAPI: any;
  }
}

contextBridge.exposeInMainWorld('discordAPI', {
  getDetectableApplications: () => ipcRenderer.invoke('get-discord-detectable-applications')
});

contextBridge.exposeInMainWorld('electronAPI', {
  simulateApp: (appId: string) => ipcRenderer.send('simulate-app', appId)
});
