import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components to reduce initial bundle size
export const LazyVehicles = lazy(() => import('@/pages/Vehicles'));
export const LazyBooking = lazy(() => import('@/pages/Booking'));
export const LazyPayment = lazy(() => import('@/pages/Payment'));
export const LazyInsuranceAndExtras = lazy(() => import('@/pages/InsuranceAndExtrasSelection'));
export const LazyAdminBlog = lazy(() => import('@/pages/AdminBlog'));
export const LazyAdminBlogEditor = lazy(() => import('@/pages/AdminBlogEditor'));

// Loading fallback component
export const ComponentLoader = ({ className }: { className?: string }) => (
  <div className={`space-y-4 p-4 ${className}`}>
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

// Wrapper component for lazy loading with error boundary
export const LazyWrapper = ({ 
  children, 
  fallback = <ComponentLoader /> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);