import { useEffect } from 'react';

export const ImageOptimizer = () => {
  useEffect(() => {
    // Optimize images in batches to reduce INP impact
    const optimizePageImages = () => {
      const processImageBatch = () => {
        const images = document.querySelectorAll('img:not([data-img-optimized])');
        
        // Process only 3 images at a time to reduce main thread blocking
        const imagesToProcess = Array.from(images).slice(0, 3);
        
        imagesToProcess.forEach((img) => {
          img.setAttribute('data-img-optimized', 'true');
          
          // Add lazy loading to all images that don't have it
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          
          // Add decoding async for better performance
          if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
          }
          
          // Optimize lovable-uploads images - only if not already optimized
          const src = img.getAttribute('src');
          if (src && src.includes('/lovable-uploads/') && !src.includes('?')) {
            // Get image dimensions from attributes or computed styles
            const width = img.getAttribute('width') || (img as HTMLImageElement).offsetWidth || '800';
            const height = img.getAttribute('height') || (img as HTMLImageElement).offsetHeight || '600';
            
            // Use aggressive compression for better performance
            const optimizedSrc = `${src}?w=${Math.min(parseInt(width.toString()), 1200)}&h=${Math.min(parseInt(height.toString()), 800)}&q=60&f=webp&fit=cover`;
            
            // Prevent duplicate loading by checking if already optimized
            if (img.getAttribute('src') !== optimizedSrc) {
              img.setAttribute('src', optimizedSrc);
            }
          }
          
          // Add sizes attribute for responsive images
          if (!img.getAttribute('sizes')) {
            img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
          }
        });
        
        // Schedule next batch if more images to process
        if (images.length > 3) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(processImageBatch);
          } else {
            setTimeout(processImageBatch, 50);
          }
        }
      };
      
      // Start processing with idle callback to avoid blocking interactions
      if ('requestIdleCallback' in window) {
        requestIdleCallback(processImageBatch);
      } else {
        setTimeout(processImageBatch, 50);
      }
    };
    
    // Run immediately and after DOM changes
    optimizePageImages();
    
    // Use MutationObserver to optimize new images added to DOM with debouncing
    let optimizationTimeout: NodeJS.Timeout;
    const observer = new MutationObserver((mutations) => {
      // Debounce to avoid excessive calls during rapid DOM changes
      clearTimeout(optimizationTimeout);
      optimizationTimeout = setTimeout(() => {
        const hasNewImages = mutations.some((mutation) => 
          Array.from(mutation.addedNodes).some((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.tagName === 'IMG' || 
                     (element.querySelectorAll && element.querySelectorAll('img').length > 0);
            }
            return false;
          })
        );
        
        if (hasNewImages) {
          optimizePageImages();
        }
      }, 100); // Debounce for 100ms
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);
  
  return null;
};