import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Auckland Truck Hire', to: '/auckland-truck-rentals-hire' },
  { name: 'West Auckland Truck Hire', to: '/west-auckland-truck-rentals-hire' },
  { name: 'Moving Truck Hire', to: '/moving-truck-hire' },
  { name: 'Auckland Van Hire', to: '/auckland-van-hire' },
  { name: 'Furniture Truck Hire Hamilton', to: '/furniture-truck-hire-hamilton' },
  { name: 'Full Price Guide', to: '/price-guide' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Furniture Truck Hire Auckland',
  url: 'https://www.jamesblond.co.nz/furniture-truck-hire-auckland',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '576 Great South Road, Penrose',
    addressLocality: 'Auckland',
    addressCountry: 'NZ',
  },
  areaServed: { '@type': 'City', name: 'Auckland' },
  openingHours: 'Mo-Su 08:00-17:00',
};

const FurnitureTruckHireAuckland = () => (
  <SimpleHubPage
    slug="/furniture-truck-hire-auckland"
    title="Furniture Truck Hire Auckland from $125/day — Tail Lift Trucks"
    description="Furniture truck hire in Auckland from $125/day or $70 for 2 hours. 12m³ to 19m³ furniture trucks with 400kg tail lifts, blankets and trolleys. Five branches, car licence only, same-day pickup."
    h1="Furniture Truck Hire Auckland — Tail-Lift Trucks from $125/day"
    intro="Shifting a lounge suite, a fridge or a whole three-bedroom house across Auckland? Our furniture trucks are set up for it: hydraulic tail lifts, ply-lined walls, tie-down rails and moving blankets. Five Auckland branches, hourly or daily rates, and every truck drives on a standard car licence."
    bullets={[
      '2-tonne 12m³, 16m³ and 3-tonne 19m³ furniture trucks',
      '400kg hydraulic tail lifts — one person can load a fridge or washer',
      'Ply-lined walls, tie-down rails and moving blankets included',
      'Hand trolleys, large trolleys, pallet jacks and ratchet straps available',
      'Drive on a standard NZ Class 1 car licence (2-tonne models)',
      'Five Auckland branches: Penrose, CBD, West Auckland, South Auckland and the Airport',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a furniture truck"
    cities={cities}
    localBusiness={localBusiness}
    priceTable={{
      heading: 'Auckland furniture truck rates (GST inclusive)',
      note: 'A per-kilometre charge applies on all trucks — see the full price guide for the exact rate per model. Two- and four-hour rates are ideal for single-item furniture pickups.',
      rows: [
        { item: '2T Box 12m³ — 1–2 bedroom move', daily: '$125/day', weekend: '$110/day', best: '$70 for 2 hours' },
        { item: '2T Tail Lift 12m³ — whiteware & heavy furniture', daily: '$140/day', weekend: '$120/day', best: '$80 for 2 hours' },
        { item: '2T Box 16m³ — 2–3 bedroom move', daily: 'From $150/day', weekend: 'Ask us', best: 'Half-day rates available' },
        { item: '3T Tail Lift 19m³ — full house move', daily: 'From $170/day', weekend: 'Ask us', best: 'Class 2 licence required' },
      ],
    }}
    sections={[
      {
        h2: 'Which furniture truck size for an Auckland move?',
        body: 'Pick by bedroom count — under-sizing costs you a second trip and the kilometre charge that comes with it.',
        points: [
          '12m³ — studio or one-bedroom apartment: queen bed, sofa, fridge and around 30 boxes.',
          '12m³ tail lift — same volume, but for fridges, washers, dryers, pianos and heavy dressers.',
          '16m³ — two- to three-bedroom home with whiteware and a full lounge suite.',
          '19m³ with tail lift — a full three-bedroom-plus house in one load (Class 2 licence required).',
        ],
      },
      {
        h2: 'Why a tail lift is worth it',
        body: 'Auckland homes are full of stairs, steep drives and narrow entries. A 400kg hydraulic tail lift turns a two-person lift into a one-person roll-on: you wheel the fridge or washing machine onto the platform, raise it, and strap it. If your move includes whiteware or anything over about 80kg, book the tail-lift model — it usually saves more in hire hours than it adds in rate.',
      },
      {
        h2: 'Moving gear you can add',
        body: 'Add a hand trolley, large appliance trolley, pallet jack, ratchet straps or moving blankets to any furniture truck booking. Blankets and tie-down rails come standard — the trolleys are what most people forget and regret. All extras are added at checkout when you book online.',
      },
      {
        h2: 'Midweek Auckland moves are cheaper',
        body: 'Furniture trucks are in highest demand Friday to Sunday. If your move can shift to a Monday–Thursday pickup, availability is far better and our midweek commercial discount often applies to trucks and vans — check the current midweek deal before you lock in a weekend date.',
      },
    ]}
    faq={[
      { q: 'How much does furniture truck hire cost in Auckland?', a: 'Auckland furniture truck hire starts from $70 for two hours or $125/day for a 2-tonne 12m³ box truck. A 12m³ with a tail lift is $80 for two hours or $140/day. Larger 16m³ and 19m³ trucks start from $150/day. A per-kilometre charge applies on top — the exact rate for each model is on our price guide.' },
      { q: 'What size furniture truck do I need in Auckland?', a: 'A 12m³ suits a studio or one-bedroom apartment, a 16m³ suits a two- to three-bedroom home, and a 3-tonne 19m³ with tail lift handles a full three-bedroom-plus house in a single load.' },
      { q: 'Do your Auckland furniture trucks have tail lifts?', a: 'Yes. Our 2-tonne 12m³ tail-lift and 3-tonne 19m³ trucks have 400kg hydraulic tail lifts, which make loading fridges, washing machines, dryers and pianos a one-person job.' },
      { q: 'Can I drive a furniture truck on my car licence?', a: 'Yes for the 2-tonne models (12m³ and 16m³) — they drive on a standard NZ Class 1 car licence and are automatic. The 3-tonne 19m³ requires a Class 2 licence.' },
      { q: 'Where can I pick up a furniture truck in Auckland?', a: 'From five branches: Penrose (576 Great South Road), Auckland CBD, West Auckland (Kelston), South Auckland and Auckland Airport. Choose the branch closest to your pickup address to keep kilometres down.' },
      { q: 'Are moving blankets and trolleys included?', a: 'Moving blankets and tie-down rails are included with every furniture truck. Hand trolleys, large appliance trolleys, pallet jacks and ratchet straps can be added to your booking for a small daily charge.' },
      { q: 'Is same-day furniture truck hire available in Auckland?', a: 'Yes, subject to availability — midweek is almost always available same day, while Friday to Sunday books out early. Call 0800 525 663 to check today.' },
    ]}
  />
);

export default FurnitureTruckHireAuckland;