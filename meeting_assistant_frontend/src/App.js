import React from 'react';
import './index.css';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import UploadAudio from './pages/UploadAudio';
import TranscriptsNew from './pages/TranscriptsNew';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Helper wrapper to inject title/actions/breadcrumbs per route
function RoutedLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine page title and breadcrumbs based on route
  let title = 'Dashboard';
  let breadcrumbs = [{ label: 'Dashboard', to: '/' }];

  if (location.pathname === '/new-case/upload-audio') {
    title = 'Upload Audio';
    breadcrumbs = [
      { label: 'Dashboard', to: '/' },
      { label: 'Start New Case' },
      { label: 'Upload Audio' },
    ];
  } else if (location.pathname === '/transcripts/new') {
    title = 'Transcription';
    breadcrumbs = [
      { label: 'Dashboard', to: '/' },
      { label: 'Start New Case' },
      { label: 'Transcription' },
    ];
  }

  const actions = (
    <>
      <button className="button" onClick={() => navigate('/new-case/upload-audio')}>New Case</button>
      <button className="button ghost">Sync</button>
    </>
  );

  return (
    <AppLayout title={title} actions={actions} breadcrumbs={breadcrumbs}>
      {children}
    </AppLayout>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application rendering app routes within a base layout.
   */
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RoutedLayout>
              <Dashboard />
            </RoutedLayout>
          }
        />
        <Route
          path="/new-case/upload-audio"
          element={
            <RoutedLayout>
              <UploadAudio />
            </RoutedLayout>
          }
        />
        <Route
          path="/transcripts/new"
          element={
            <RoutedLayout>
              <TranscriptsNew />
            </RoutedLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
