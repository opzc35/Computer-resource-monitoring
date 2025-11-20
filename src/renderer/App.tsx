import React, { useEffect, useState } from 'react';
import MonitorWindow from './components/MonitorWindow';
import SettingsWindow from './components/SettingsWindow';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'monitor' | 'settings'>('monitor');

  useEffect(() => {
    // Check URL hash to determine which view to show
    const hash = window.location.hash.slice(1);
    if (hash === 'settings') {
      setCurrentView('settings');
    }
  }, []);

  return (
    <>
      {currentView === 'monitor' && <MonitorWindow />}
      {currentView === 'settings' && <SettingsWindow />}
    </>
  );
};

export default App;
