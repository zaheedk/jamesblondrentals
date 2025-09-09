import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  sizes?: string;
  quality?: number;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEwcHgiIGZpbGw9IiNhYWEiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px' // Increased to start loading earlier
      }
    );

    if (imgRef.current && loading === 'lazy') {
      observer.observe(imgRef.current);
    } else if (loading === 'eager') {
      setIsInView(true);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
    setIsLoaded(true);
  };

  // Optimize image URL for better compression and smaller sizes
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('lovable-uploads')) {
      // Use more aggressive compression and smaller dimensions
      const optimizedWidth = width ? Math.min(width, 1200) : 800;
      const optimizedHeight = height ? Math.min(height, 800) : 600;
      return `${originalSrc}?w=${optimizedWidth}&h=${optimizedHeight}&q=70&f=webp&fit=cover`;
    }
    return originalSrc;
  };

  const shouldShowImage = isInView || loading === 'eager';
  const srcToUse = shouldShowImage ? getOptimizedSrc(src) : placeholder;

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
    >
      <img
        src={imageError ? '/placeholder.svg' : srcToUse}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-70'
        }`}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {!isLoaded && shouldShowImage && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};