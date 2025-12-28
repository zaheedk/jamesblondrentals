import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Defer all analytics until idle
    const optimizeScriptLoading = () => {
      const enableAnalytics = () => {
        if (window.gtag) {
          window.gtag('config', 'G-504DCLJNP1');
        }
      };
      
      // Enable analytics on first interaction or after 10s
      ['click', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, enableAnalytics, { once: true, passive: true });
      });
      setTimeout(enableAnalytics, 10000);
    };



    // Run optimization on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(optimizeScriptLoading);
    } else {
      setTimeout(optimizeScriptLoading, 100);
    }

  }, []);

  return null;
};