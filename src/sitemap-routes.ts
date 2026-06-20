/**
 * Central sitemap route configuration.
 * 
 * IMPORTANT: When adding a new public page, add its path here
 * and the sitemap will be auto-generated at build time.
 * 
 * Do NOT add:
 * - Admin/protected routes (e.g. /admin/*)
 * - Dynamic routes with parameters (e.g. /vehicle/:id, /blog/:slug)
 * - Utility routes (e.g. /photos, /photo-gallery, /unsubscribe)
 */

export interface SitemapRoute {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export const sitemapRoutes: SitemapRoute[] = [
  // Main Pages
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/vehicles', priority: 0.9, changefreq: 'daily' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  { path: '/terms', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.5, changefreq: 'monthly' },
  { path: '/price-guide', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  { path: '/win', priority: 0.9, changefreq: 'monthly' },

  // Auth Pages (noindex but kept for completeness - excluded from sitemap)
  // Login, Register, ForgotPassword, ResetPassword are noindexed via PageSEO

  // Booking Process Pages (only booking entry point is indexed)
  { path: '/booking', priority: 0.8, changefreq: 'weekly' },

  // Fleet Pages
  { path: '/fleet', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/cars', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/vans', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/cargo-vans', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/utes', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/trucks', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/minibus', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/trailers', priority: 0.8, changefreq: 'monthly' },
  { path: '/fleet/accessories', priority: 0.7, changefreq: 'monthly' },

  // Cars Detail Pages
  { path: '/fleet/cars/premium-seven-seat-suv', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/cars/premium-2wd-suv', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/cars/premium-compact-suv', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/cars/premium-awd-suv', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/cars/premium-economy', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/cars/premium-midsize', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/cars/premium-economy-wagon', priority: 0.7, changefreq: 'monthly' },

  // Vans Detail Pages
  { path: '/fleet/vans/premium-van', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/vans/standard-van', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/vans/standard-rear-seat-van', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/vans/jumbo-van', priority: 0.7, changefreq: 'monthly' },

  // Utes Detail Pages
  { path: '/fleet/utes/single-cab-ute-petrol', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/utes/single-cab-ute-diesel', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/utes/premium-double-cab-ute', priority: 0.7, changefreq: 'monthly' },

  // Trucks Detail Pages
  { path: '/fleet/trucks/2-tonne-box-9m3', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trucks/2-tonne-box-12m3', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trucks/2-tonne-box-12m3-tail', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trucks/2-tonne-tipper', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trucks/2-tonne-box-16m3', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trucks/3-tonne-box-18m3', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trucks/3-tonne-box-19m3', priority: 0.7, changefreq: 'monthly' },

  // Minibuses Detail Pages
  { path: '/fleet/minibus/12-seat-minibus', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/minibus/10-seat-minibus', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/minibus/premium-12-seat-minibus', priority: 0.7, changefreq: 'monthly' },

  // Trailers Detail Pages
  { path: '/fleet/trailers/cage-trailer', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trailers/luggage-trailer', priority: 0.7, changefreq: 'monthly' },
  { path: '/fleet/trailers/car-transporter', priority: 0.7, changefreq: 'monthly' },

  // Accessories Detail Pages
  { path: '/fleet/accessories/child-seat', priority: 0.6, changefreq: 'monthly' },
  { path: '/fleet/accessories/booster-seat', priority: 0.6, changefreq: 'monthly' },
  { path: '/fleet/accessories/pallet-jack', priority: 0.6, changefreq: 'monthly' },
  { path: '/fleet/accessories/straps-ratchet', priority: 0.6, changefreq: 'monthly' },
  { path: '/fleet/accessories/hand-trolley', priority: 0.6, changefreq: 'monthly' },
  { path: '/fleet/accessories/large-hand-trolley', priority: 0.6, changefreq: 'monthly' },

  // Location-specific Rental Pages
  { path: '/auckland-truck-rentals-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/west-auckland-truck-rentals-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/truck-hire-wellington', priority: 0.9, changefreq: 'weekly' },
  { path: '/truck-hire-christchurch', priority: 0.9, changefreq: 'weekly' },
  { path: '/van-hire-christchurch', priority: 0.9, changefreq: 'weekly' },
  { path: '/truck-hire-hamilton', priority: 0.9, changefreq: 'weekly' },
  { path: '/van-hire-hamilton', priority: 0.9, changefreq: 'weekly' },
  { path: '/car-hire-hamilton', priority: 0.9, changefreq: 'weekly' },
  { path: '/car-hire-auckland', priority: 0.9, changefreq: 'weekly' },
  { path: '/car-hire-christchurch', priority: 0.9, changefreq: 'weekly' },
  { path: '/ute-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/pickup-truck-rental', priority: 0.9, changefreq: 'weekly' },
  { path: '/central-christchurch-truck-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/central-christchurch-van-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/central-christchurch-car-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/van-hire-wellington', priority: 0.9, changefreq: 'weekly' },
  { path: '/west-auckland-cargo-van-rentals-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/auckland-airport-cargo-van-rentals-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/south-auckland-cargo-van-rentals-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/central-auckland-cargo-van-rentals-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/auckland-airport-minibus-rentals-hire', priority: 0.9, changefreq: 'weekly' },
  { path: '/auckland-airport-car-rentals', priority: 0.9, changefreq: 'weekly' },
  { path: '/car-rental-wellington-new-zealand', priority: 0.8, changefreq: 'monthly' },
  { path: '/car-rental-auckland-airport-new-zealand', priority: 0.8, changefreq: 'monthly' },
  { path: '/12-seater-van-hire-auckland', priority: 0.8, changefreq: 'weekly' },
  { path: '/wellington-10-12-seat-van-minibus-rental', priority: 0.8, changefreq: 'weekly' },
  { path: '/wellington-minibus-hire', priority: 0.8, changefreq: 'weekly' },
  { path: '/minibus-hire-wellington', priority: 0.8, changefreq: 'weekly' },
  { path: '/wellington-minibus-hire-cbd', priority: 0.8, changefreq: 'weekly' },

  // Contact Location Pages
  { path: '/contact/auckland', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact/auckland-airport', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact/wellington', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact/christchurch', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact/christchurch-central', priority: 0.7, changefreq: 'monthly' },

  // Airport Pages
  { path: '/airport', priority: 0.7, changefreq: 'monthly' },
  { path: '/airport/shuttle', priority: 0.6, changefreq: 'monthly' },
  { path: '/airport/directions', priority: 0.6, changefreq: 'monthly' },
  { path: '/airport/auckland', priority: 0.7, changefreq: 'monthly' },
  { path: '/airport/christchurch', priority: 0.7, changefreq: 'monthly' },
  { path: '/airport/wellington', priority: 0.7, changefreq: 'monthly' },

  // Special / Deals Pages
  { path: '/hot-deals', priority: 0.8, changefreq: 'weekly' },
  { path: '/hot-deals/mobil-fuel-discount', priority: 0.8, changefreq: 'monthly' },
  { path: '/hot-deals/midweek-truck-van-discount', priority: 0.8, changefreq: 'monthly' },
  { path: '/hot-deals/courier-operator-deals', priority: 0.8, changefreq: 'monthly' },
  { path: '/people-mover', priority: 0.7, changefreq: 'monthly' },
  { path: '/winz-quotes', priority: 0.7, changefreq: 'monthly' },
  { path: '/jumbo-taxi-launch', priority: 0.6, changefreq: 'monthly' },
  { path: '/fuel-calculator', priority: 0.7, changefreq: 'monthly' },
  { path: '/buy-used-vehicles', priority: 0.7, changefreq: 'weekly' },
];
