import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Auckland', to: '/auckland-truck-rentals-hire' },
  { name: 'Wellington', to: '/truck-hire-wellington' },
  { name: 'Christchurch', to: '/truck-hire-christchurch' },
  { name: 'Hamilton', to: '/truck-hire-hamilton' },
  { name: 'West Auckland', to: '/west-auckland-truck-rentals-hire' },
];

const MovingTruckRental = () => (
  <SimpleHubPage
    slug="/moving-truck-rental"
    title="Moving Truck Hire Near You | NZ Truck Rental | James Blond"
    description="Find moving truck hire near you in Auckland, Wellington, Christchurch and Hamilton. Compare 2-tonne and 3-tonne trucks, tail lifts and local collection options."
    h1="Moving Truck Hire Near You"
    intro="Looking for moving truck hire near you? Choose your city, compare truck sizes and check your dates before arranging your move. James Blond moving trucks come ready to load — tail lift or ramp, tie-down points, blankets available, hourly rates from $35/hr. Our 2-tonne trucks can be driven on a car licence. All our trucks up to 18m³ — including the 16m³ and 18m³ 3-tonne models — can be driven on a standard Class 1 car licence. Only the 19–20m³ truck requires a Class 2 licence."
    bullets={[
      '2-tonne and 3-tonne moving trucks',
      'Tail lifts and ramps available',
      'Car licence for 2-tonne trucks; confirm the licence required for your 3-tonne truck',
      'Same-day pickup, 7 days a week',
      'Hourly, daily and weekly rates',
      'Optional moving blankets, hand trolleys and straps',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a moving truck"
    cities={cities}
    sections={[
      { h2: 'Where can I collect a moving truck near me?', body: 'Auckland customers can collect in Glen Eden; Wellington collection is in Te Aro; Christchurch has Waltham and Harewood collection options; Hamilton collection is in Frankton. Use the city links below for local trucks and booking. Same-day collection depends on availability.', points: ['West Auckland: 4004 Great North Road, Glen Eden', 'Wellington: 24 Abel Smith Street, Te Aro', 'Central Christchurch: 515 Moorhouse Avenue, Waltham', 'Christchurch Airport: 25 Logistics Drive, Harewood', 'Hamilton: 17 Bandon Street, Frankton'] },
      { h2: 'Choosing a moving truck for your house move', body: 'Compare box volume, load weight and the size of your largest items rather than bedrooms alone. A 12m³ truck can suit a small flat; 16m³ and 18–19m³ options provide more space for larger moves. A tail lift helps with heavy appliances. ' },
    ]}
    faq={[
      { q: 'How much does it cost to rent a moving truck in NZ?', a: 'James Blond moving trucks start from $35/hr and around $129/day for a 2-tonne, with 3-tonne and tail-lift trucks slightly higher. Same-day quotes are available from any branch.' },
      { q: 'What size moving truck should I rent?', a: 'For a one-bedroom apartment a 2-tonne 12m³ truck is usually plenty. For a two- or three-bedroom house a 2-tonne 16m³ or 3-tonne 19m³ with tail lift is the right call.' },
      { q: 'Do I need a truck licence to drive a moving truck?', a: 'Our 2-tonne trucks can be driven on a car licence. All our trucks up to 18m³ — including the 16m³ and 18m³ 3-tonne models — can be driven on a standard Class 1 car licence. Only the 19–20m³ truck requires a Class 2 licence.' },
      { q: 'Can I do a one-way move?', a: 'One-way and long-distance moves between Auckland, Hamilton, Wellington and Christchurch are available on request when booking.' },
    ]}
  />
);

export default MovingTruckRental;