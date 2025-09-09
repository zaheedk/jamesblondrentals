import { useEffect } from 'react';

export const ResourcePreloader = () => {
  useEffect(() => {
    // Preload critical fonts and resources
    const preloadResources = () => {
      const criticalResources = [
        // Preload critical fonts if any
        { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
        // Preload critical CSS if any
        // Preload small critical images only
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
        
        // Check if resource isn't already preloaded
        const existing = document.querySelector(`link[href="${resource.href}"]`);
        if (!existing) {
          document.head.appendChild(link);
        }
      });
    };

    // Preconnect to external domains to speed up requests
    const preconnectDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://apis.rentalcarmanager.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      
      const existing = document.querySelector(`link[href="${domain}"]`);
      if (!existing) {
        document.head.appendChild(link);
      }
    });

    // Run resource preloading after critical resources
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadResources, { timeout: 2000 });
    } else {
      setTimeout(preloadResources, 1000);
    }

    // Cleanup large images from memory when not visible
    const cleanupImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            // Don't unload images that are still close to viewport
            const rect = img.getBoundingClientRect();
            const isNearViewport = Math.abs(rect.top) < window.innerHeight * 2;
            
            if (!isNearViewport && img.src && !img.src.includes('placeholder')) {
              // Store original src and replace with placeholder for memory efficiency
              img.dataset.originalSrc = img.src;
              // Don't actually unload as it may cause flickering
            }
          }
        });
      }, { rootMargin: '200px' });

      images.forEach(img => observer.observe(img));
      
      return () => observer.disconnect();
    };

    const cleanup = cleanupImages();
    
    return cleanup;
  }, []);

  return null;
};