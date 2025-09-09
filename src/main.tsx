
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

// Defer SpeedInsights to reduce initial JS execution time
const loadSpeedInsights = async () => {
  const { SpeedInsights } = await import('@vercel/speed-insights/react');
  return SpeedInsights;
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Load SpeedInsights after initial render
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(async () => {
    const SpeedInsights = await loadSpeedInsights();
    root.render(
      <React.StrictMode>
        <App />
        <SpeedInsights />
      </React.StrictMode>
    );
  });
} else {
  setTimeout(async () => {
    const SpeedInsights = await loadSpeedInsights();
    root.render(
      <React.StrictMode>
        <App />
        <SpeedInsights />
      </React.StrictMode>
    );
  }, 2000);
}
