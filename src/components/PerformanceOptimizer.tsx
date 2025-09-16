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

    // Optimize images - defer to avoid blocking interactions
    const optimizeImages = () => {
      // Use requestIdleCallback to avoid blocking user interactions
      const runOptimization = () => {
        const images = document.querySelectorAll('img:not([data-optimized])');
        
        // Process only 5 images at a time to avoid blocking
        const imagesToProcess = Array.from(images).slice(0, 5);
        
        imagesToProcess.forEach((img) => {
          img.setAttribute('data-optimized', 'true');
          
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          
          const src = img.getAttribute('src');
          if (src && src.includes('/lovable-uploads/') && !src.includes('?')) {
            img.setAttribute('src', `${src}?w=800&q=55&f=webp&fit=cover`);
          }
        });
        
        // If more images to process, schedule next batch
        if (images.length > 5) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(runOptimization);
          } else {
            setTimeout(runOptimization, 100);
          }
        }
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(runOptimization);
      } else {
        setTimeout(runOptimization, 100);
      }
    };

    // Minimize main thread work by using scheduler with smaller time slices
    const scheduleWork = (tasks: (() => void)[]) => {
      const runTasks = () => {
        const startTime = performance.now();
        // Reduced from 5ms to 2ms to reduce INP impact
        while (tasks.length > 0 && (performance.now() - startTime) < 2) {
          const task = tasks.shift();
          task?.();
        }
        
        if (tasks.length > 0) {
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(runTasks, { priority: 'background' });
          } else {
            // Use requestIdleCallback for better timing
            if ('requestIdleCallback' in window) {
              requestIdleCallback(runTasks);
            } else {
              setTimeout(runTasks, 16); // Next frame
            }
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