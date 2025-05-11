
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Send pageview with the new page URL
    if (window.gtag) {
      window.gtag('config', 'G-504DCLJNP1', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
