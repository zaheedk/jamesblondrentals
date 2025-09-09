import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Optimize JavaScript execution by chunking work
    const optimizeExecution = () => {
      // Break up script loading into smaller chunks
      const deferredScripts = [];
      
      // Defer analytics until page is loaded and user is idle
      const deferAnalytics = () => {
        if (window.gtag) {
          window.gtag('config', 'G-504DCLJNP1');
        }
      };
      
      // Use requestIdleCallback for non-critical work
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          deferAnalytics();
        }, { timeout: 5000 });
      } else {
        setTimeout(deferAnalytics, 3000);
      }
      
      // Preload critical routes only when user is idle
      const preloadRoutes = () => {
        const routes = ['/vehicles', '/fleet', '/contact'];
        routes.forEach((route, index) => {
          setTimeout(() => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            document.head.appendChild(link);
          }, index * 100);
        });
      };
      
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(preloadRoutes, { timeout: 10000 });
      } else {
        setTimeout(preloadRoutes, 5000);
      }
    };

    // Optimize third-party script loading
    const optimizeThirdParty = () => {
      // Delay non-essential third-party scripts
      const scripts = document.querySelectorAll('script[src*="google"]');
      scripts.forEach((script) => {
        if (script.getAttribute('src')?.includes('gtm') || 
            script.getAttribute('src')?.includes('analytics')) {
          script.setAttribute('loading', 'lazy');
        }
      });
    };

    // Run optimizations in phases
    setTimeout(optimizeThirdParty, 100);
    setTimeout(optimizeExecution, 500);

    // Simplified performance monitoring (only in dev)
    if (process.env.NODE_ENV === 'development') {
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              console.log('LCP:', entry.startTime);
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // Silently fail
        }
      }
    }
  }, []);

  return null;
};