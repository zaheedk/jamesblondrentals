
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

// Render app immediately without SpeedInsights
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Only load SpeedInsights on user interaction to reduce JS execution time
let speedInsightsLoaded = false;
const loadSpeedInsights = async () => {
  if (speedInsightsLoaded) return;
  speedInsightsLoaded = true;
  
  try {
    const { SpeedInsights } = await import('@vercel/speed-insights/react');
    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <App />
          <SpeedInsights />
        </HelmetProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.warn('Failed to load SpeedInsights:', error);
  }
};

// Load SpeedInsights only after user interaction or 15 seconds
['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
  document.addEventListener(event, loadSpeedInsights, { once: true, passive: true });
});
setTimeout(loadSpeedInsights, 15000);
