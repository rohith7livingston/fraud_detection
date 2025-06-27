import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './Dashboard';
import LandingPage from './LandingPage';

function App() {
  // ✨ State-based routing to show either the Landing Page or the Dashboard
  const [view, setView] = useState('landing');

  const navigateToDashboard = () => {
    setView('dashboard');
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1A1A2A',
            color: '#F0F0F5',
            border: '1px solid #2A2A3A',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />
      
      {view === 'landing' && <LandingPage onLaunch={navigateToDashboard} />}
      {view === 'dashboard' && <Dashboard />}
    </>
  );
}

export default App;