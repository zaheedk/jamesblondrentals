import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://jamesblond.co.nz';

const toTitle = (slug: string) =>
  slug
    .split('-')
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bThe\b/g, 'the');

/**
 * City hub-and-spoke breadcrumb config.
 * Each city has a hub URL and a list of sub-page paths (with friendly labels).
 * Sub-pages emit: Home > <City> > <Label>
 * Hubs emit:      Home > <City>
 */
type CityConfig = {
  city: string;
  hub: string;
  pages: Record<string, string>;
};

const CITY_CONFIGS: CityConfig[] = [
  {
    city: 'Auckland',
    hub: '/car-hire-auckland',
    pages: {
      '/car-hire-auckland': 'Car Hire',
      '/auckland-truck-rentals-hire': 'Truck Hire',
      '/west-auckland-truck-rentals-hire': 'West Auckland Truck Hire',
      '/moving-truck-hire-auckland': 'Moving Truck Hire',
      '/12-seater-van-hire-auckland': '12-Seater Van Hire',
      '/west-auckland-cargo-van-rentals-hire': 'West Auckland Cargo Van Hire',
      '/south-auckland-cargo-van-rentals-hire': 'South Auckland Cargo Van Hire',
      '/central-auckland-cargo-van-rentals-hire': 'Central Auckland Cargo Van Hire',
      '/auckland-airport-cargo-van-rentals-hire': 'Auckland Airport Cargo Van Hire',
      '/auckland-airport-car-rentals': 'Auckland Airport Car Hire',
      '/auckland-airport-minibus-rentals-hire': 'Auckland Airport Minibus Hire',
      '/car-rental-auckland-airport-new-zealand': 'Auckland Airport Car Rental',
      '/airport/auckland': 'Auckland Airport',
      '/contact/auckland': 'Contact Auckland',
      '/contact/auckland-airport': 'Contact Auckland Airport',
    },
  },
  {
    city: 'Christchurch',
    hub: '/car-hire-christchurch',
    pages: {
      '/car-hire-christchurch': 'Car Hire',
      '/truck-hire-christchurch': 'Truck Hire',
      '/van-hire-christchurch': 'Van Hire',
      '/central-christchurch-car-hire': 'Central Christchurch Car Hire',
      '/central-christchurch-truck-hire': 'Central Christchurch Truck Hire',
      '/central-christchurch-van-hire': 'Central Christchurch Van Hire',
      '/airport/christchurch': 'Christchurch Airport',
      '/contact/christchurch': 'Contact Christchurch',
      '/contact/christchurch-central': 'Contact Christchurch Central',
    },
  },
  {
    city: 'Hamilton',
    hub: '/car-hire-hamilton',
    pages: {
      '/car-hire-hamilton': 'Car Hire',
      '/truck-hire-hamilton': 'Truck Hire',
      '/van-hire-hamilton': 'Van Hire',
      '/contact/hamilton': 'Contact Hamilton',
    },
  },
];

const findCityForPath = (pathname: string) => {
  for (const cfg of CITY_CONFIGS) {
    if (cfg.pages[pathname]) return cfg;
  }
  return null;
};

/**
 * Auto-generated BreadcrumbList JSON-LD based on the current pathname.
 * Mounted once in AppLayout so every route gets breadcrumb structured data.
 *
 * For city pages (Auckland, Christchurch, Hamilton) we emit hub-and-spoke
 * structured data: Home > <City> > <Page>. Wellington pages are handled by
 * <WellingtonBreadcrumb /> which injects its own JSON-LD.
 * Skipped on the homepage and admin/transactional routes.
 */
const BreadcrumbsJsonLd = () => {
  const { pathname } = useLocation();

  if (
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/ra') ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/customer-details') ||
    pathname.startsWith('/insurance-and-extras') ||
    pathname.startsWith('/photos') ||
    pathname.startsWith('/photo-gallery')
  ) {
    return null;
  }

  // Wellington pages render their own BreadcrumbList via WellingtonBreadcrumb.
  const isWellington =
    pathname.includes('wellington') || pathname === '/airport/wellington';
  if (isWellington) return null;

  // City hub-and-spoke breadcrumbs.
  const cityCfg = findCityForPath(pathname);
  if (cityCfg) {
    const isHub = pathname === cityCfg.hub;
    const items = isHub
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: cityCfg.city,
            item: `${SITE_URL}${cityCfg.hub}`,
          },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: cityCfg.city,
            item: `${SITE_URL}${cityCfg.hub}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: cityCfg.pages[pathname],
            item: `${SITE_URL}${pathname}`,
          },
        ];

    const data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };

    return (
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(data)}</script>
      </Helmet>
    );
  }

  // Fallback: skip generic /airport/* and /contact/* (no city match).
  if (pathname.startsWith('/airport/') || pathname.startsWith('/contact/')) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    ...segments.map((seg, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: toTitle(decodeURIComponent(seg)),
      item: `${SITE_URL}/${segments.slice(0, i + 1).join('/')}`,
    })),
  ];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default BreadcrumbsJsonLd;