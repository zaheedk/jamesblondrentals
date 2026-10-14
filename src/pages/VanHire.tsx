import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Van Hire Auckland', to: '/van-hire-auckland' },
  { name: 'Van Hire West Auckland', to: '/west-auckland-van-hire' },
  { name: 'Van Hire Wellington', to: '/van-hire-wellington' },
  { name: 'Van Hire Christchurch', to: '/van-hire-christchurch' },
  { name: 'Van Hire Hamilton', to: '/van-hire-hamilton' },
  { name: 'Cargo Van Hire NZ', to: '/cargo-van-hire' },
  { name: 'One-Way Van Hire', to: '/one-way-van-hire' },
  { name: 'Truck Hire NZ', to: '/truck-hire' },
  { name: 'Full Price Guide', to: '/price-guide' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Van Hire NZ',
  url: 'https://www.jamesblond.co.nz/van-hire',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  priceRange: '$$',
  areaServed: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'].map((name) => ({ '@type': 'City', name })),
};

const VanHire = () => (
  <SimpleHubPage
    slug="/van-hire"
    title="Van Hire NZ from $115/day | Cargo & Moving Vans | James Blond"
    description="Van hire in Auckland, Wellington, Christchurch and Hamilton. Cargo vans from $115/day, jumbo and high-roof vans, crew vans and 12-seaters. Car licence, GST included."
    h1="Van Hire NZ — Cargo, Moving and Passenger Vans"
    intro="Van hire from James Blond Rentals at branches in Auckland, Wellington, Christchurch and Hamilton. Choose a 6m³ cargo van, a 9m³ jumbo van, a high-roof van for long loads, a crew van, or a 10–12 seat passenger van. Every cargo van drives on a standard NZ car licence."
    bullets={[
      'Standard cargo van 6m³ — from $115/day',
      'Jumbo cargo van 9m³ — from $130/day',
      'High-roof cargo van for long loads — from $130/day',
      'Rear-seat crew van (crew + cargo) — from $130/day',
      '10 and 12 seat passenger vans — price on request',
      'Cargo vans drive on a standard NZ Class 1 car licence',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Check van availability"
    cities={cities}
    localBusiness={localBusiness}
    priceTable={{
      heading: 'Van hire rates (GST inclusive)',
      note: 'Rates are per vehicle. Kilometre charges apply on some vans — see the full price guide. Passenger vans are priced on request.',
      rows: [
        { item: 'Standard Cargo Van 6m³', daily: '$115/day', weekend: '$100/day', best: '$95/day (10+ days)' },
        { item: 'Jumbo Cargo Van 9m³', daily: '$130/day', weekend: '$115/day', best: '$100/day (10+ days)' },
        { item: 'High-Roof Cargo Van', daily: '$130/day', weekend: '$115/day', best: '$100/day (10+ days)' },
        { item: 'Rear-Seat Van 6m³ (crew + cargo)', daily: '$130/day', weekend: '$120/day', best: '$110/day (10+ days)' },
        { item: '10 & 12 Seat Passenger Van', daily: 'On request', best: 'Call 0800 525 663' },
      ],
    }}
    sections={[
      {
        h2: 'Van hire branches across New Zealand',
        body: 'Collect your hire van from the branch closest to where you are loading. Search your dates for live availability.',
        points: [
          'Auckland — West Auckland (4004 Great North Road, Glen Eden), Mt Wellington and Auckland Airport (Māngere).',
          'Wellington — 24 Abel Smith Street, Te Aro.',
          'Christchurch — 515 Moorhouse Avenue, Waltham and 25 Logistics Drive, Harewood (Airport).',
          'Hamilton — 17 Bandon Street, Frankton.',
        ],
      },
      {
        h2: 'Which hire van do you need?',
        body: 'Pick by load size and how many people are travelling.',
        points: [
          '6m³ cargo van — flat-pack furniture, 20–25 boxes, courier runs and trade tools.',
          '9m³ jumbo van — whiteware upright, small apartment moves and appliance deliveries.',
          'High-roof van — timber, pipe, ladders and mattresses.',
          'Crew van — a 2–3 person crew plus gear in one vehicle.',
          '10–12 seat van — sports teams, school trips and group travel.',
          'Need more than 9m³ or a tail lift? Compare our moving trucks on the truck hire page.',
        ],
      },
      {
        h2: 'Moving van hire vs truck hire',
        body: 'A van is cheaper to run, easier to park and fine for a small move or delivery. For a full 2–3 bedroom house move, a 16m³ or larger truck usually saves you a second trip. Our moving cost calculator helps you compare.',
      },
    ]}
    faq={[
      { q: 'How much does van hire cost in NZ?', a: 'Cargo van hire starts from $115/day for a 6m³ van and $130/day for a 9m³ jumbo or high-roof van, with lower rates for 10+ day hires. All rates include GST. 10 and 12 seat passenger vans are priced on request.' },
      { q: 'Can I drive a hire van on a car licence?', a: 'Yes. Our cargo vans are under 3,500kg and can be driven on a standard NZ Class 1 car licence.' },
      { q: 'Where can I hire a van near me?', a: 'We have van hire branches in Auckland (Glen Eden, Mt Wellington, Airport), Wellington (Te Aro), Christchurch (Waltham and Harewood) and Hamilton (Frankton).' },
      { q: 'Can I hire a van one way?', a: 'Yes, one-way van hire is available between selected branches. See our one-way van hire page or call 0800 525 663.' },
      { q: 'Do you hire 12 seater vans?', a: 'Yes. 10 and 12 seat passenger vans are available on request, and schools get a flat $210/day rate on 12-seaters.' },
      { q: 'Can I hire a van for a few hours?', a: 'Yes — short hires are available. Check the price guide for hourly rates or search your dates and times online.' },
    ]}
  />
);

export default VanHire;
