import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Optimize third-party scripts loading
    const optimizeScripts = () => {
      // Defer non-critical analytics
      setTimeout(() => {
        if (window.gtag) {
          window.gtag('config', 'G-504DCLJNP1');
        }
      }, 1000);
    };

    // Reduce main thread blocking
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(optimizeScripts);
    } else {
      setTimeout(optimizeScripts, 100);
    }

    // Preload critical resources
    const preloadCritical = () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/vehicles';
      document.head.appendChild(link);
    };

    setTimeout(preloadCritical, 2000);

    // Add performance observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('LCP:', entry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS Observer
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              console.log('CLS:', (entry as any).value);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Browser doesn't support observers
      }
    }
  }, []);

  return null;
};