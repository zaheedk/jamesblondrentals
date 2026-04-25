import { sitemapRoutes } from '@/sitemap-routes';

export interface StaticPageMetadata {
  path: string;
  title: string;
  description: string;
  heading: string;
  body: string;
}

const SITE_NAME = 'James Blond Rentals';

const titleCase = (value: string) =>
  value
    .replace(/^\//, '')
    .replace(/\//g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\bNz\b/g, 'NZ')
    .replace(/\bCbd\b/g, 'CBD')
    .replace(/\bSuv\b/g, 'SUV')
    .replace(/\bAwd\b/g, 'AWD')
    .replace(/\b2wd\b/gi, '2WD')
    .replace(/\bM3\b/g, 'm3');

const inferCategory = (path: string) => {
  if (path.includes('truck')) return 'truck hire';
  if (path.includes('van') || path.includes('cargo')) return 'van hire';
  if (path.includes('minibus') || path.includes('12-seat') || path.includes('10-seat')) return 'minibus hire';
  if (path.includes('car') || path.includes('suv') || path.includes('economy') || path.includes('midsize')) return 'car rental';
  if (path.includes('ute')) return 'ute hire';
  if (path.includes('trailer')) return 'trailer hire';
  if (path.includes('airport')) return 'airport vehicle rental';
  return 'vehicle rental';
};

const makeDefaultMetadata = (path: string): StaticPageMetadata => {
  const heading = path === '/' ? 'Car, Van and Truck Hire NZ' : titleCase(path);
  const category = inferCategory(path);
  return {
    path,
    title: path === '/' ? `${SITE_NAME} | Car, Van & Truck Hire NZ` : `${heading} | ${SITE_NAME}`,
    description: `Book ${category} with James Blond Rentals across Auckland, Wellington and Christchurch. Reliable vehicles, simple online booking and local support.`,
    heading,
    body: `${heading} from James Blond Rentals. Compare vehicles, check rental options and book online for Auckland, Wellington and Christchurch locations.`,
  };
};

const overrides: Record<string, Partial<Omit<StaticPageMetadata, 'path'>>> = {
  '/booking': {
    title: 'Book Your Rental Vehicle | James Blond Rentals',
    description: 'Complete your vehicle booking with James Blond Rentals. Choose from cars, vans, trucks and utes across Auckland, Wellington and Christchurch.',
    heading: 'Book Your Rental Vehicle',
    body: 'Start or continue your James Blond Rentals booking for cars, vans, trucks, utes, minibuses and trailers across New Zealand.',
  },
  '/vehicles': {
    title: 'Available Rental Vehicles | James Blond Rentals',
    description: 'Search available rental cars, vans, trucks, utes, minibuses and trailers from James Blond Rentals across New Zealand.',
    heading: 'Available Rental Vehicles',
  },
  '/fleet': {
    title: 'Vehicle Fleet | James Blond Rentals',
    description: 'Explore the James Blond Rentals fleet including cars, cargo vans, trucks, utes, minibuses, trailers and moving accessories.',
    heading: 'Vehicle Fleet',
  },
  '/fleet/vans/premium-van': {
    title: 'Premium Van Hire | James Blond Rentals',
    description: 'Rent a premium cargo van for business deliveries, courier work or moving. Spacious, reliable and well-maintained.',
  },
  '/fleet/vans/standard-van': {
    title: 'Standard Van Hire | James Blond Rentals',
    description: 'Affordable standard van hire for deliveries, small moves and general cargo transport across NZ.',
  },
  '/fleet/vans/standard-rear-seat-van': {
    title: 'Standard Rear Seat Van Hire | James Blond Rentals',
    description: 'Hire a van with rear seating – carry passengers and cargo in one versatile vehicle. Great for tradespeople.',
  },
  '/fleet/vans/jumbo-van': {
    title: 'Jumbo Van Hire – Extra Large Cargo Van | James Blond',
    description: 'Rent a jumbo van for maximum cargo capacity. Ideal for large deliveries, furniture moves and commercial logistics.',
  },
  '/auckland-truck-rentals-hire': {
    title: 'Truck Hire Auckland | James Blond Rentals',
    description: 'Rent trucks in Auckland for house moves, business deliveries and construction. 2-tonne and 3-tonne trucks available daily.',
  },
  '/west-auckland-truck-rentals-hire': {
    title: 'Truck Hire West Auckland | James Blond Rentals',
    description: 'Rent trucks in West Auckland including Henderson, New Lynn and Waitakere. Convenient pickup for moving and deliveries.',
  },
  '/truck-hire-wellington': {
    title: 'Truck Hire Wellington | James Blond Rentals',
    description: 'Affordable truck hire in Wellington for moving house, business deliveries and commercial transport.',
  },
  '/truck-hire-christchurch': {
    title: 'Truck Hire Christchurch | James Blond Rentals',
    description: 'Truck hire in Christchurch for house moves, furniture transport, deliveries and commercial jobs.',
  },
  '/van-hire-wellington': {
    title: 'Van Hire Wellington | James Blond Rentals',
    description: 'Cargo van hire in Wellington for deliveries, courier work, furniture moves and business transport.',
  },
  '/auckland-airport-cargo-van-rentals-hire': {
    title: 'Cargo Van Hire Auckland Airport | James Blond Rentals',
    description: 'Rent cargo vans near Auckland Airport for courier work, deliveries and commercial transport. Easy airport pickup.',
  },
  '/central-auckland-cargo-van-rentals-hire': {
    title: 'Cargo Van Hire Central Auckland | James Blond Rentals',
    description: 'Rent cargo vans in central Auckland CBD for urban deliveries, courier services and business logistics.',
  },
  '/south-auckland-cargo-van-rentals-hire': {
    title: 'Cargo Van Hire South Auckland | James Blond Rentals',
    description: 'Cargo van rental in South Auckland for trade, courier and business transport needs.',
  },
  '/west-auckland-cargo-van-rentals-hire': {
    title: 'Cargo Van Hire West Auckland | James Blond Rentals',
    description: 'Hire cargo vans in West Auckland for deliveries, courier work and commercial transport in the western suburbs.',
  },
  '/12-seater-van-hire-auckland': {
    title: '12-Seater Van Hire Auckland | James Blond Rentals',
    description: 'Rent a 12-seater van in Auckland for group travel, sports teams and events. Comfortable and easy to drive.',
  },
  '/wellington-10-12-seat-van-minibus-rental': {
    title: '10 & 12 Seat Van Hire Wellington | James Blond Rentals',
    description: 'Hire 10-seat and 12-seat vans in Wellington for events, sports teams, airport transfers and group transport.',
  },
  '/wellington-minibus-hire': {
    title: 'Minibus Hire Wellington | James Blond Rentals',
    description: 'Affordable minibus hire in Wellington for groups, events and business travel. 10-seat and 12-seat options available.',
  },
  '/minibus-hire-wellington': {
    title: 'Minibus Rentals Wellington | James Blond Rentals',
    description: 'Affordable minibus hire in Wellington. 10-seat and 12-seat options for groups, events and family travel.',
  },
  '/wellington-minibus-hire-cbd': {
    title: 'Minibus Hire Wellington CBD | James Blond Rentals',
    description: 'Convenient minibus hire from our Wellington CBD location. Walk-in pickup for 10 and 12-seat minibuses.',
  },
};

export const staticPageMetadata: StaticPageMetadata[] = sitemapRoutes.map(route => ({
  ...makeDefaultMetadata(route.path),
  ...overrides[route.path],
  path: route.path,
}));
