/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite',
);

const fetchApps = async () => {
  const apps = await window.discordAPI.getDetectableApplications();
  return apps;
};

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ApplicationSearch from './components/ApplicationSearch';

const App = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      const fetchedApps = await fetchApps();
      setApps(fetchedApps);
      setLoading(false);
    };
    loadApps();
  }, []);

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <ApplicationSearch apps={apps} />
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
