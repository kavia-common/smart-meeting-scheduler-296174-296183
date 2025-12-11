import React from 'react';
import './index.css';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application rendering a base layout with sidebar and a Dashboard page.
   */
  const actions = (
    <>
      <button className="button">New Meeting</button>
      <button className="button ghost">Sync</button>
    </>
  );

  return (
    <AppLayout title="Dashboard" actions={actions}>
      <Dashboard />
    </AppLayout>
  );
}

export default App;
