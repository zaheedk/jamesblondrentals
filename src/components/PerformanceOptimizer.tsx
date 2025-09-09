import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Aggressively defer all analytics and non-critical scripts
    const optimizeScriptLoading = () => {
      // Remove duplicate analytics scripts to reduce JS execution time
      const existingScripts = document.querySelectorAll('script[src*="google"]');
      const seenUrls = new Set();
      
      existingScripts.forEach((script) => {
        const src = script.getAttribute('src');
        if (src && seenUrls.has(src)) {
          script.remove();
        } else if (src) {
          seenUrls.add(src);
          // Defer all analytics until user interaction or 10 seconds
          if (src.includes('analytics') || src.includes('gtag') || src.includes('gtm')) {
            script.setAttribute('loading', 'lazy');
            (script as HTMLScriptElement).defer = true;
          }
        }
      });
      
      // Disable analytics until user interacts with page
      let analyticsEnabled = false;
      const enableAnalytics = () => {
        if (!analyticsEnabled && window.gtag) {
          analyticsEnabled = true;
          window.gtag('config', 'G-504DCLJNP1');
        }
      };
      
      // Enable analytics on first user interaction or after 10 seconds
      ['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
        document.addEventListener(event, enableAnalytics, { once: true, passive: true });
      });
      setTimeout(enableAnalytics, 10000);
    };

    // Optimize images - reduce quality for non-critical images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        // Add intersection observer for better lazy loading
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Compress images by adding quality parameter for lovable-uploads
        const src = img.getAttribute('src');
        if (src && src.includes('/lovable-uploads/') && !src.includes('?')) {
          img.setAttribute('src', `${src}?w=800&q=75`);
        }
      });
    };

    // Minimize main thread work by using scheduler
    const scheduleWork = (tasks: (() => void)[]) => {
      const runTasks = () => {
        const startTime = performance.now();
        while (tasks.length > 0 && (performance.now() - startTime) < 5) {
          const task = tasks.shift();
          task?.();
        }
        
        if (tasks.length > 0) {
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(runTasks, { priority: 'background' });
          } else {
            setTimeout(runTasks, 0);
          }
        }
      };
      runTasks();
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

    // Run optimizations in phases using scheduler
    scheduleWork([
      optimizeScriptLoading,
      optimizeImages,
      optimizeThirdParty
    ]);

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