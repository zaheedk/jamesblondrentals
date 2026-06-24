export interface OneWayRoute {
  slug: string; // e.g. auckland-to-wellington
  fromName: string;
  toName: string;
  fromCity: string;
  toCity: string;
  distance: string;
  driveTime: string;
  shortIntro: string;
  longIntro: string;
  highlights: string[];
  reverseSlug: string;
  fromBranchPath?: string;
  toBranchPath?: string;
}

export const oneWayRoutes: OneWayRoute[] = [
  {
    slug: 'auckland-to-wellington',
    fromName: 'Auckland',
    toName: 'Wellington',
    fromCity: 'Auckland',
    toCity: 'Wellington',
    distance: '640 km',
    driveTime: '8h 30m',
    shortIntro: 'The classic North Island drive — Auckland down SH1 through Taupo to the capital.',
    longIntro:
      'One-way car hire from Auckland to Wellington is the most popular North Island route. Pick up your car in Auckland city or at Auckland Airport, drive SH1 through Hamilton, Taupo and the Desert Road, and drop off at our Wellington branch — no return drive, no extra fuel, no extra days.',
    highlights: ['Hamilton Gardens stopover', 'Lake Taupo & Huka Falls', 'Tongariro / Desert Road', 'Taihape & Manawatu river country', 'Wellington waterfront'],
    reverseSlug: 'wellington-to-auckland',
    fromBranchPath: '/car-hire-auckland',
    toBranchPath: '/car-rental-wellington-new-zealand',
  },
  {
    slug: 'wellington-to-auckland',
    fromName: 'Wellington',
    toName: 'Auckland',
    fromCity: 'Wellington',
    toCity: 'Auckland',
    distance: '640 km',
    driveTime: '8h 30m',
    shortIntro: 'Drive north from the capital up SH1 to Auckland — great after a South Island ferry trip.',
    longIntro:
      'One-way car hire from Wellington to Auckland is ideal after a South Island ferry crossing or a Wellington weekend. Pick up at our Wellington branch, head north on SH1 through the Kapiti Coast, Manawatu, Taupo and Hamilton, and drop off in Auckland — city or airport.',
    highlights: ['Kapiti Coast', 'Manawatu Gorge', 'Lake Taupo lakefront', 'Hobbiton near Matamata', 'Auckland Harbour'],
    reverseSlug: 'auckland-to-wellington',
    fromBranchPath: '/car-rental-wellington-new-zealand',
    toBranchPath: '/car-hire-auckland',
  },
  {
    slug: 'auckland-to-christchurch',
    fromName: 'Auckland',
    toName: 'Christchurch',
    fromCity: 'Auckland',
    toCity: 'Christchurch',
    distance: '1,070 km + ferry',
    driveTime: '14h driving + 3h 30m ferry',
    shortIntro: 'North to South Island — Auckland down to Wellington, ferry to Picton, on to Christchurch.',
    longIntro:
      'One-way car hire from Auckland to Christchurch combines a North Island road trip with a South Island arrival. Pick up in Auckland, drive south to Wellington, cross Cook Strait on the Interislander or Bluebridge, then continue down the Kaikoura coast to Christchurch where you drop the car off.',
    highlights: ['Taupo & Tongariro', 'Wellington & Cook Strait ferry', 'Marlborough Sounds', 'Kaikoura coast & wildlife', 'Christchurch CBD'],
    reverseSlug: 'christchurch-to-auckland',
    fromBranchPath: '/car-hire-auckland',
    toBranchPath: '/car-hire-christchurch',
  },
  {
    slug: 'christchurch-to-auckland',
    fromName: 'Christchurch',
    toName: 'Auckland',
    fromCity: 'Christchurch',
    toCity: 'Auckland',
    distance: '1,070 km + ferry',
    driveTime: '14h driving + 3h 30m ferry',
    shortIntro: 'South to North Island — Christchurch up through Kaikoura, ferry, then SH1 to Auckland.',
    longIntro:
      'One-way car hire from Christchurch to Auckland is a bucket-list New Zealand road trip. Start in Christchurch, drive the Kaikoura coast to Picton, ferry across to Wellington, then take SH1 all the way up to Auckland or Auckland Airport.',
    highlights: ['Kaikoura whales', 'Picton & Marlborough wineries', 'Cook Strait ferry', 'Lake Taupo', 'Hamilton & Auckland'],
    reverseSlug: 'auckland-to-christchurch',
    fromBranchPath: '/car-hire-christchurch',
    toBranchPath: '/car-hire-auckland',
  },
  {
    slug: 'wellington-to-christchurch',
    fromName: 'Wellington',
    toName: 'Christchurch',
    fromCity: 'Wellington',
    toCity: 'Christchurch',
    distance: '430 km + ferry',
    driveTime: '6h driving + 3h 30m ferry',
    shortIntro: 'Cross Cook Strait by ferry then drive the Kaikoura coast south to Christchurch.',
    longIntro:
      'One-way car hire from Wellington to Christchurch is the easy way to get a car onto the South Island. Pick up in Wellington, take the Interislander or Bluebridge ferry to Picton, then drive the spectacular Kaikoura coastal road south to Christchurch.',
    highlights: ['Cook Strait crossing', 'Marlborough Sounds', 'Blenheim wine region', 'Kaikoura', 'Christchurch CBD'],
    reverseSlug: 'christchurch-to-wellington',
    fromBranchPath: '/car-rental-wellington-new-zealand',
    toBranchPath: '/car-hire-christchurch',
  },
  {
    slug: 'christchurch-to-wellington',
    fromName: 'Christchurch',
    toName: 'Wellington',
    fromCity: 'Christchurch',
    toCity: 'Wellington',
    distance: '430 km + ferry',
    driveTime: '6h driving + 3h 30m ferry',
    shortIntro: 'Up the Kaikoura coast to Picton, ferry across to Wellington and drop off in the capital.',
    longIntro:
      'One-way car hire from Christchurch to Wellington is perfect for travellers ending their South Island trip in the capital. Pick up in Christchurch, drive the Kaikoura coast to Picton, ferry across Cook Strait and drop the car off at our Wellington branch.',
    highlights: ['Kaikoura coast', 'Marlborough wineries', 'Cook Strait ferry', 'Wellington waterfront', 'Te Papa museum'],
    reverseSlug: 'wellington-to-christchurch',
    fromBranchPath: '/car-hire-christchurch',
    toBranchPath: '/car-rental-wellington-new-zealand',
  },
  {
    slug: 'auckland-to-hamilton',
    fromName: 'Auckland',
    toName: 'Hamilton',
    fromCity: 'Auckland',
    toCity: 'Hamilton',
    distance: '125 km',
    driveTime: '1h 40m',
    shortIntro: 'Quick one-way south down the Waikato Expressway — handy for events and relocations.',
    longIntro:
      'One-way car hire from Auckland to Hamilton is a short, easy run down the Waikato Expressway. Pick up in Auckland or at Auckland Airport and drop off at our Hamilton branch — great for events, university trips and family relocations.',
    highlights: ['Bombay Hills', 'Waikato Expressway', 'Hamilton Gardens', 'Hobbiton (Matamata)', 'Waitomo Caves day trip'],
    reverseSlug: 'hamilton-to-auckland',
    fromBranchPath: '/car-hire-auckland',
  },
  {
    slug: 'hamilton-to-auckland',
    fromName: 'Hamilton',
    toName: 'Auckland',
    fromCity: 'Hamilton',
    toCity: 'Auckland',
    distance: '125 km',
    driveTime: '1h 40m',
    shortIntro: 'Short one-way north into Auckland or Auckland Airport — great for outbound flights.',
    longIntro:
      'One-way car hire from Hamilton to Auckland is the easy way to connect to an outbound flight or business meeting in the city. Pick up in Hamilton, drive north on the Waikato Expressway and drop off in Auckland city or at Auckland Airport.',
    highlights: ['Waikato Expressway', 'Bombay Hills', 'Auckland CBD', 'Auckland Airport drop-off', 'Easy flight connections'],
    reverseSlug: 'auckland-to-hamilton',
    toBranchPath: '/car-hire-auckland',
  },
  {
    slug: 'hamilton-to-wellington',
    fromName: 'Hamilton',
    toName: 'Wellington',
    fromCity: 'Hamilton',
    toCity: 'Wellington',
    distance: '525 km',
    driveTime: '7h',
    shortIntro: 'Down SH1 through Taupo and the Desert Road to the capital.',
    longIntro:
      'One-way car hire from Hamilton to Wellington takes you the length of the central North Island. Pick up in Hamilton, head south past Taupo, over the Desert Road and down through Manawatu to drop off in Wellington.',
    highlights: ['Lake Taupo', 'Tongariro Alpine Crossing', 'Desert Road', 'Manawatu Gorge', 'Wellington waterfront'],
    reverseSlug: 'wellington-to-hamilton',
    toBranchPath: '/car-rental-wellington-new-zealand',
  },
  {
    slug: 'wellington-to-hamilton',
    fromName: 'Wellington',
    toName: 'Hamilton',
    fromCity: 'Wellington',
    toCity: 'Hamilton',
    distance: '525 km',
    driveTime: '7h',
    shortIntro: 'North from the capital up SH1 to the heart of the Waikato.',
    longIntro:
      'One-way car hire from Wellington to Hamilton is ideal for inland North Island trips. Pick up at our Wellington branch, take SH1 north through Manawatu, Taupo and the central plateau, and drop off in Hamilton.',
    highlights: ['Kapiti Coast', 'Manawatu farmland', 'Lake Taupo', 'Hobbiton near Matamata', 'Hamilton Gardens'],
    reverseSlug: 'hamilton-to-wellington',
    fromBranchPath: '/car-rental-wellington-new-zealand',
  },
];

export const getOneWayRoute = (slug: string): OneWayRoute | undefined =>
  oneWayRoutes.find((r) => r.slug === slug);