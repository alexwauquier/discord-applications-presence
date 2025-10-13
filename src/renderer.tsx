import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ApplicationSearch from './components/ApplicationSearch';
import './index.css';

const fetchApps = async () => {
  const apps = await window.discordAPI.getDetectableApplications();
  return apps;
};

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
