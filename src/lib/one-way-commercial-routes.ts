export interface OneWayCommercialRoute {
  slug: string;
  fromName: string;
  toName: string;
  distance: string;
  driveTime: string;
  shortIntro: string;
  longIntro: string;
  highlights: string[];
  reverseSlug: string;
}

// Focused on high-intent moving/relocation routes for truck & van
export const oneWayCommercialRoutes: OneWayCommercialRoute[] = [
  {
    slug: 'auckland-to-wellington',
    fromName: 'Auckland',
    toName: 'Wellington',
    distance: '640 km',
    driveTime: '8h 30m',
    shortIntro: 'Most-booked one-way moving route — Auckland down SH1 to Wellington.',
    longIntro:
      "One-way truck and van hire from Auckland to Wellington is the most-booked relocation route in the North Island. Pick up your truck or cargo van at our Auckland branch, load up, drive SH1 through Hamilton, Taupo and the Desert Road, and drop off at our Wellington branch — no return leg, no extra fuel, no extra rental days.",
    highlights: ['Load in Auckland or Penrose', 'Overnight in Taupo', 'Desert Road', 'Wellington drop-off', 'Tail-lift trucks available'],
    reverseSlug: 'wellington-to-auckland',
  },
  {
    slug: 'wellington-to-auckland',
    fromName: 'Wellington',
    toName: 'Auckland',
    distance: '640 km',
    driveTime: '8h 30m',
    shortIntro: 'Move north from the capital — truck or van, drop off in Auckland.',
    longIntro:
      "One-way truck and van hire from Wellington to Auckland is the easiest way to move households or business inventory north. Pick up in Wellington, take SH1 through the Kapiti Coast, Manawatu, Taupo and Hamilton, and leave the truck at our Auckland branch — city or Penrose.",
    highlights: ['Wellington pickup', 'Kapiti Coast', 'Lake Taupo overnight', 'Hamilton stopover', 'Auckland drop-off'],
    reverseSlug: 'auckland-to-wellington',
  },
  {
    slug: 'auckland-to-christchurch',
    fromName: 'Auckland',
    toName: 'Christchurch',
    distance: '1,070 km + ferry',
    driveTime: '14h driving + 3h 30m ferry',
    shortIntro: 'North-to-South Island move — truck-approved Cook Strait crossing included.',
    longIntro:
      "One-way truck and van hire from Auckland to Christchurch is the go-to for interisland relocations. Pick up in Auckland, drive south to Wellington, take the Interislander or Bluebridge across Cook Strait, then continue down the Kaikoura coast to drop off in Christchurch. All our trucks and vans are ferry-approved — we'll help book the crossing at your vehicle length.",
    highlights: ['Auckland pickup', 'Overnight Taupo', 'Cook Strait ferry (truck-approved)', 'Kaikoura coast', 'Christchurch drop-off'],
    reverseSlug: 'christchurch-to-auckland',
  },
  {
    slug: 'christchurch-to-auckland',
    fromName: 'Christchurch',
    toName: 'Auckland',
    distance: '1,070 km + ferry',
    driveTime: '14h driving + 3h 30m ferry',
    shortIntro: 'South-to-North Island move via Picton ferry then SH1 to Auckland.',
    longIntro:
      "One-way truck and van hire from Christchurch to Auckland is a full interisland relocation. Start in Christchurch, drive the Kaikoura coast to Picton, cross Cook Strait on the Interislander or Bluebridge, then take SH1 north through Wellington, Taupo and Hamilton to Auckland — city or Penrose drop-off.",
    highlights: ['Christchurch pickup', 'Kaikoura coast', 'Cook Strait ferry', 'Taupo overnight', 'Auckland drop-off'],
    reverseSlug: 'auckland-to-christchurch',
  },
  {
    slug: 'wellington-to-christchurch',
    fromName: 'Wellington',
    toName: 'Christchurch',
    distance: '430 km + ferry',
    driveTime: '6h driving + 3h 30m ferry',
    shortIntro: 'Easiest way to get a truck or van across Cook Strait to Christchurch.',
    longIntro:
      "One-way truck and van hire from Wellington to Christchurch is the shortest interisland move. Pick up at our Wellington branch, take the ferry to Picton, then drive the Kaikoura coastal road south to Christchurch. Ideal for household moves, business relocations and courier/one-way freight.",
    highlights: ['Wellington pickup', 'Cook Strait ferry', 'Marlborough Sounds', 'Kaikoura coast', 'Christchurch drop-off'],
    reverseSlug: 'christchurch-to-wellington',
  },
  {
    slug: 'christchurch-to-wellington',
    fromName: 'Christchurch',
    toName: 'Wellington',
    distance: '430 km + ferry',
    driveTime: '6h driving + 3h 30m ferry',
    shortIntro: 'Move north from Christchurch via Picton ferry to Wellington.',
    longIntro:
      "One-way truck and van hire from Christchurch to Wellington is perfect for households and businesses relocating to the capital. Pick up in Christchurch, drive the Kaikoura coast to Picton, cross Cook Strait and drop off at our Wellington branch — usually well under 48 hours end-to-end.",
    highlights: ['Christchurch pickup', 'Kaikoura coast', 'Cook Strait ferry', 'Marlborough Sounds', 'Wellington drop-off'],
    reverseSlug: 'wellington-to-christchurch',
  },
  {
    slug: 'auckland-to-hamilton',
    fromName: 'Auckland',
    toName: 'Hamilton',
    distance: '125 km',
    driveTime: '1h 40m',
    shortIntro: 'Short one-way move — Waikato Expressway to Hamilton.',
    longIntro:
      "One-way truck and van hire from Auckland to Hamilton is our most affordable interregional move. Pick up in Auckland or Penrose, load up, drive the Waikato Expressway and drop off in Hamilton — most customers finish in a single day.",
    highlights: ['Auckland pickup', 'Waikato Expressway', 'Hamilton drop-off', 'Same-day possible', 'Small & large trucks'],
    reverseSlug: 'hamilton-to-auckland',
  },
  {
    slug: 'hamilton-to-auckland',
    fromName: 'Hamilton',
    toName: 'Auckland',
    distance: '125 km',
    driveTime: '1h 40m',
    shortIntro: 'Short one-way move north from Hamilton into Auckland.',
    longIntro:
      "One-way truck and van hire from Hamilton to Auckland is the fastest inter-city relocation we offer. Pick up in Hamilton, take the Waikato Expressway north and drop off in Auckland city or Penrose — great for students, tradies and single-load house moves.",
    highlights: ['Hamilton pickup', 'Waikato Expressway', 'Auckland CBD or Penrose drop-off', 'Same-day possible', 'Tail-lift trucks'],
    reverseSlug: 'auckland-to-hamilton',
  },
];

export const getOneWayCommercialRoute = (slug: string): OneWayCommercialRoute | undefined =>
  oneWayCommercialRoutes.find((r) => r.slug === slug);

export type CommercialVariant = 'truck' | 'van';

export const variantConfig: Record<CommercialVariant, {
  label: string;
  pluralLabel: string;
  urlBase: string;
  fleetPath: string;
  fromPrice: string;
  intro: string;
  vehicleBullets: string[];
}> = {
  truck: {
    label: 'Truck',
    pluralLabel: 'Trucks',
    urlBase: '/one-way-truck-hire',
    fleetPath: '/fleet/trucks',
    fromPrice: '$129/day',
    intro:
      "One-way truck hire moves your household or business between our branches without you paying for the empty return leg. Choose from 2-tonne 12–16m³ box trucks, 3-tonne 19m³ furniture trucks and tail-lift models — all automatic and driveable on a standard car licence.",
    vehicleBullets: [
      '2-tonne 12m³ box truck — small 1–2 bedroom moves',
      '2-tonne 16m³ box truck — full 2 bedroom moves',
      '3-tonne 19m³ furniture truck — 3+ bedroom moves',
      'Tail-lift options — heavy appliances, no ramp lifting',
      'All automatic, car licence, GPS included',
    ],
  },
  van: {
    label: 'Van',
    pluralLabel: 'Vans',
    urlBase: '/one-way-van-hire',
    fleetPath: '/fleet/vans',
    fromPrice: '$89/day',
    intro:
      "One-way van hire is the smart way to move a studio, one-bedroom flat or business inventory between our branches — no return drive, no return fuel. Choose from standard cargo vans, jumbo long-wheelbase vans and rear-seat vans.",
    vehicleBullets: [
      'Standard cargo van — studio & 1 bedroom moves',
      'Jumbo long-wheelbase van — 1–2 bedroom moves',
      'Rear-seat cargo van — 2 passengers + cargo',
      'All automatic, car licence, easy to load',
      'Ferry-approved for Cook Strait crossings',
    ],
  },
};