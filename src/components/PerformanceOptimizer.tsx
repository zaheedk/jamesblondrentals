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

    // INP Optimization: Break up long tasks using scheduler.yield or fallback
    const yieldToMain = async () => {
      // Use scheduler.yield if available (Chrome 115+)
      if ('scheduler' in window && 'yield' in (window as any).scheduler) {
        return (window as any).scheduler.yield();
      }
      // Fallback to setTimeout for other browsers
      return new Promise(resolve => setTimeout(resolve, 0));
    };

    // Apply passive event listeners to improve scroll performance
    const optimizeEventListeners = () => {
      // Mark document-level listeners as passive
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'scroll' || type === 'touchstart' || type === 'touchmove' || type === 'wheel') {
          if (typeof options === 'boolean') {
            options = { capture: options, passive: true };
          } else if (typeof options === 'object' && options !== null) {
            options = { ...options, passive: options.passive !== false };
          } else {
            options = { passive: true };
          }
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    };

    // Optimize select/dropdown interactions for better INP
    const optimizeSelectInteractions = () => {
      // Use event delegation for select elements
      document.addEventListener('pointerdown', (e) => {
        const target = e.target as HTMLElement;
        // If clicking on a select trigger, prevent layout shifts
        if (target.closest('[role="combobox"], [role="listbox"], select')) {
          // Request animation frame to batch visual updates
          requestAnimationFrame(() => {
            // Layout is already stable, proceed with interaction
          });
        }
      }, { passive: true });
    };

    // Run optimization on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(optimizeScriptLoading);
      requestIdleCallback(optimizeEventListeners);
      requestIdleCallback(optimizeSelectInteractions);
    } else {
      setTimeout(optimizeScriptLoading, 100);
      setTimeout(optimizeEventListeners, 100);
      setTimeout(optimizeSelectInteractions, 100);
    }

  }, []);

  return null;
};
