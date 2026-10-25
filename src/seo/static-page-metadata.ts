import { sitemapRoutes, type SitemapRoute } from '../sitemap-routes';

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
    title: path === '/' ? 'Low Cost Car, Van & Truck Hire New Zealand' : `${heading} | ${SITE_NAME}`,
    description: `Book ${category} with James Blond Rentals across Auckland, Wellington and Christchurch. Reliable vehicles, simple online booking and local support.`,
    heading,
    body: `${heading} from James Blond Rentals. Compare vehicles, check rental options and book online for Auckland, Wellington and Christchurch locations.`,
  };
};

const overrides: Record<string, Partial<Omit<StaticPageMetadata, 'path'>>> = {
  '/car-van-hire-east-auckland': {
    title: 'Car & Van Hire East Auckland – Mt Wellington | James Blond Rentals',
    description: 'Car hire and van hire in East Auckland from our Mt Wellington branch. Handy for Panmure, Ellerslie, Howick and Botany. Live prices and availability online.',
    heading: 'Car & van hire East Auckland',
    body: 'Car hire and cargo van hire in East Auckland from James Blond Rentals. Pick up at 6C McLennan Road, Mt Wellington — close to Penrose, Ellerslie, Panmure, Glen Innes, Pakuranga, Howick, Botany and East Tamaki. Search your dates for live availability and prices.',
  },
  '/vehicle-hire-hamilton': {
    title: 'Car, Van & Truck Hire Hamilton | James Blond Rentals',
    description: 'Compare car rental, cargo van and moving truck hire in Hamilton. Check live prices and availability, collect in Frankton and check in online before pickup.',
    heading: 'Car, van & truck hire Hamilton',
    body: 'Hamilton car rental, cargo van hire and moving truck hire from James Blond Rentals. Pick up at 17 Bandon Street, Frankton, Hamilton. Search your dates for live availability and prices. Explore our Hamilton car, van and truck pages, one-way hire options and online pre-check-in. Vehicle availability depends on your dates; contact the team about collection arrangements for Hamilton Airport arrivals.',
  },
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
  '/van-hire': {
    title: 'Van Hire NZ from $115/day | Cargo & Moving Vans | James Blond',
    description: 'Van hire in Auckland, Wellington, Christchurch and Hamilton. Cargo vans from $115/day, jumbo and high-roof vans, crew vans and 12-seaters. Car licence, GST included.',
    heading: 'Van Hire NZ — Cargo, Moving and Passenger Vans',
    body: 'Van hire at James Blond branches in Auckland, Wellington, Christchurch and Hamilton. 6m³ cargo vans from $115/day, 9m³ jumbo and high-roof vans from $130/day, crew vans and 10–12 seat passenger vans on request. Cargo vans drive on a standard NZ car licence.',
  },
  '/truck-hire': {
    title: 'Truck Hire NZ | Moving Truck Hire Near You | James Blond',
    description: 'Find truck hire near you in Auckland, Wellington, Christchurch and Hamilton. Compare moving trucks, tail lifts and collection locations. Check live availability.',
    heading: 'Truck Hire NZ — Moving Trucks Near You',
    body: 'Truck hire and moving truck rental in Auckland, Wellington, Christchurch and Hamilton. Collect in Glen Eden, Te Aro, Waltham, Harewood or Frankton. Compare 9m³ to 19m³ trucks and tail-lift options, check the price guide and search your dates for availability. All trucks up to 18m³ drive on a standard car licence; only the 19–20m³ truck requires Class 2.',
  },
  '/moving-truck-rental': {
    title: 'Moving Truck Hire Near You | NZ Truck Rental | James Blond',
    description: 'Find moving truck hire near you in Auckland, Wellington, Christchurch and Hamilton. Compare 2-tonne and 3-tonne trucks, tail lifts and local collection options.',
    heading: 'Moving Truck Hire Near You',
    body: 'Moving truck hire for house moves, furniture pickups and deliveries. Collection locations include Glen Eden in West Auckland, Te Aro in Wellington, Waltham and Harewood in Christchurch, and Frankton in Hamilton. Compare cargo volume, load weight, tail lifts and licence requirements before booking. Same-day hire is subject to availability.',
  },
  '/truck-hire-hamilton': {
    title: 'Truck Hire Hamilton | Moving Trucks in Frankton | James Blond',
    description: 'Truck hire in Hamilton with pickup at 17 Bandon Street, Frankton. Compare moving trucks and tail lifts for Waikato house moves and deliveries. Check availability.',
    heading: 'Truck Hire Hamilton — Moving Truck Rental',
    body: 'Hire a moving truck from 17 Bandon Street, Frankton, Hamilton for Waikato house moves, furniture pickups and deliveries. Compare 2-tonne and 3-tonne trucks and tail-lift options. Check live availability for your dates and confirm the allocated vehicle’s licence requirement before booking.',
  },
  '/auckland-truck-rentals-hire': {
    title: 'Truck Hire Auckland | Moving Truck Rental Near You | James Blond',
    description: 'Truck hire in Auckland for moving house, furniture and deliveries. Compare 12m³ to 19m³ trucks, tail lifts and local collection options. Check live availability.',
    heading: 'Truck Hire Auckland — Moving Truck Rental Near You',
    body: 'Truck hire Auckland for house moves and deliveries. West Auckland collection is at 4004 Great North Road, Glen Eden, serving Henderson, New Lynn and nearby suburbs. Compare 2-tonne and 3-tonne moving trucks, tail lifts, rates and live availability. Contact the branch about other Auckland collection options and confirm the allocated vehicle’s licence requirement.',
  },
  '/west-auckland-truck-rentals-hire': {
    title: 'Truck Hire Auckland West — Moving Trucks from $125/day | James Blond',
    description: 'Truck hire in West Auckland from $70 (4 hrs) or $125/day. 12m³ to 19m³ moving trucks with tail lifts and a 2T tipper, 50% off midweek. Glen Eden branch near Henderson & New Lynn.',
  },
  '/truck-hire-wellington': {
    title: 'Truck Hire Wellington | Moving Trucks in Te Aro | James Blond',
    description: 'Truck hire in Wellington with pickup at 24 Abel Smith Street, Te Aro. Moving trucks and tail lifts for CBD, Hutt Valley and Porirua moves. Check live availability.',
    heading: 'Truck Hire Wellington — Moving Truck Rental',
    body: 'Truck hire Wellington with collection at 24 Abel Smith Street, Te Aro. Moving trucks for Wellington CBD, Lower Hutt, Upper Hutt and Porirua moves, with pickup in Te Aro rather than those suburbs. Compare truck sizes, tail lifts and live availability. Confirm the specific 3-tonne vehicle’s licence requirement before booking.',
  },
  '/truck-hire-christchurch': {
    title: 'Truck Hire Christchurch | Moving Trucks Near You | James Blond',
    description: 'Truck hire in Christchurch with collection in Waltham or Harewood. Compare moving trucks and tail lifts for house moves and deliveries. Check your dates online.',
    heading: 'Truck Hire Christchurch — Moving Truck Rental',
    body: 'Truck hire Christchurch with collection at 515 Moorhouse Avenue, Waltham, or 25 Logistics Drive, Harewood. Moving trucks and tail lifts for Christchurch house moves and Canterbury deliveries. Compare 2-tonne and 3-tonne vehicles and check availability for your dates. Confirm the specific vehicle’s licence requirement before booking.',
  },
  '/van-hire-wellington': {
    title: 'Van Hire Wellington from $95/Day | Van Rental Wellington',
    description: 'Van hire in Wellington from $95/day — cargo vans, jumbo vans and moving vans on a car licence. Serving Lower Hutt, Petone, Porirua and Kāpiti from our Te Aro branch.',
  },
  '/car-rental-wellington-new-zealand': {
    title: 'Car Hire Wellington from $45/Day | Car Rental Wellington',
    description: 'Car hire in Wellington from $45/day — economy cars, SUVs, 7-seaters and people movers from our Te Aro branch. No hidden fees, one-way hire available.',
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
  '/win': {
    title: 'Win Up to $200 Back on Your Rental | James Blond Rentals',
    description: 'Every month 5 lucky James Blond Rentals customers win up to $200 back on their rental. Hire a car, van, ute or truck in Auckland, Wellington or Christchurch to be automatically entered.',
    heading: 'Win up to $200 back on your rental',
    body: 'Every month James Blond Rentals draws 5 lucky winners who each receive up to $200 back from their rental amount. Hire a car, van, ute, minibus or truck in Auckland, Wellington or Christchurch to be automatically entered.',
  },
  '/one-way-car-hire': {
    title: 'One-Way Car Hire NZ | Pick Up & Drop Off in Different Cities | James Blond',
    description: 'One-way car hire across New Zealand. Pick up in Auckland, Hamilton, Wellington or Christchurch and drop off at any other James Blond branch. Transparent one-way fees, modern fleet.',
    heading: 'One-Way Car Hire New Zealand',
    body: 'One-way car rental between James Blond branches in Auckland, Auckland Airport, Hamilton, Wellington and Christchurch. Drive one direction and skip the return trip — fees are quoted live during online booking.',
  },
  '/one-way-car-hire/auckland-to-wellington': {
    title: 'One-Way Car Hire Auckland to Wellington | James Blond Rentals',
    description: 'One-way car hire from Auckland to Wellington — 640km, 8h 30m drive. Pick up in Auckland, drop off in Wellington. Modern fleet and transparent one-way fee.',
    heading: 'One-Way Car Hire Auckland to Wellington',
  },
  '/one-way-car-hire/wellington-to-auckland': {
    title: 'One-Way Car Hire Wellington to Auckland | James Blond Rentals',
    description: 'One-way car hire from Wellington to Auckland — 640km up SH1. Pick up in Wellington, drop off in Auckland city or airport.',
    heading: 'One-Way Car Hire Wellington to Auckland',
  },
  '/one-way-car-hire/auckland-to-christchurch': {
    title: 'One-Way Car Hire Auckland to Christchurch | James Blond',
    description: 'One-way car hire from Auckland to Christchurch via the Cook Strait ferry. North-to-South Island road trip with drop-off in Christchurch.',
    heading: 'One-Way Car Hire Auckland to Christchurch',
  },
  '/one-way-car-hire/christchurch-to-auckland': {
    title: 'One-Way Car Hire Christchurch to Auckland | James Blond',
    description: 'One-way car hire from Christchurch to Auckland via the Kaikoura coast and Cook Strait ferry. Drop off in Auckland or Auckland Airport.',
    heading: 'One-Way Car Hire Christchurch to Auckland',
  },
  '/one-way-car-hire/wellington-to-christchurch': {
    title: 'One-Way Car Hire Wellington to Christchurch | James Blond',
    description: 'One-way car hire from Wellington to Christchurch via the Interislander ferry and Kaikoura coast. Easy South Island arrival.',
    heading: 'One-Way Car Hire Wellington to Christchurch',
  },
  '/one-way-car-hire/christchurch-to-wellington': {
    title: 'One-Way Car Hire Christchurch to Wellington | James Blond',
    description: 'One-way car hire from Christchurch to Wellington via Kaikoura and the Cook Strait ferry. Drop off in the capital.',
    heading: 'One-Way Car Hire Christchurch to Wellington',
  },
  '/one-way-car-hire/auckland-to-hamilton': {
    title: 'One-Way Car Hire Auckland to Hamilton | James Blond Rentals',
    description: 'One-way car hire from Auckland to Hamilton — short 125km run down the Waikato Expressway. Pickup in Auckland, drop-off in Hamilton.',
    heading: 'One-Way Car Hire Auckland to Hamilton',
  },
  '/one-way-car-hire/hamilton-to-auckland': {
    title: 'One-Way Car Hire Hamilton to Auckland | James Blond Rentals',
    description: 'One-way car hire from Hamilton to Auckland or Auckland Airport. Quick 125km drive — great for outbound flights and city trips.',
    heading: 'One-Way Car Hire Hamilton to Auckland',
  },
  '/one-way-car-hire/hamilton-to-wellington': {
    title: 'One-Way Car Hire Hamilton to Wellington | James Blond Rentals',
    description: 'One-way car hire from Hamilton to Wellington — 525km down SH1 through Taupo and the Desert Road. Drop off in the capital.',
    heading: 'One-Way Car Hire Hamilton to Wellington',
  },
  '/one-way-car-hire/wellington-to-hamilton': {
    title: 'One-Way Car Hire Wellington to Hamilton | James Blond Rentals',
    description: 'One-way car hire from Wellington to Hamilton — 525km up SH1 through Manawatu and Taupo to the heart of the Waikato.',
    heading: 'One-Way Car Hire Wellington to Hamilton',
  },
};

export const staticPageMetadata: StaticPageMetadata[] = sitemapRoutes.map((route: SitemapRoute) => ({
  ...makeDefaultMetadata(route.path),
  ...overrides[route.path],
  path: route.path,
}));
