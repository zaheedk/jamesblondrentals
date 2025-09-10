import { useEffect } from 'react';

export const ImageOptimizer = () => {
  useEffect(() => {
    // Optimize all images on the page
    const optimizePageImages = () => {
      const images = document.querySelectorAll('img');
      
      images.forEach((img) => {
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
          const width = img.getAttribute('width') || img.offsetWidth || '800';
          const height = img.getAttribute('height') || img.offsetHeight || '600';
          
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
    };
    
    // Run immediately and after DOM changes
    optimizePageImages();
    
    // Use MutationObserver to optimize new images added to DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newImages = element.querySelectorAll ? element.querySelectorAll('img') : [];
            if (element.tagName === 'IMG') {
              optimizePageImages();
            } else if (newImages.length > 0) {
              optimizePageImages();
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);
  
  return null;
};