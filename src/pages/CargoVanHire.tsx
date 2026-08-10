import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Cargo Van Hire Auckland', to: '/cargo-van-hire-auckland' },
  { name: 'Cargo Van Hire Wellington', to: '/wellington-cargo-van-rentals-hire' },
  { name: 'Van Hire Christchurch', to: '/van-hire-christchurch' },
  { name: 'Van Hire Hamilton', to: '/van-hire-hamilton' },
  { name: 'Courier & Operator Deals', to: '/courier-operator-deals' },
  { name: 'Full Price Guide', to: '/price-guide' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Cargo Van Hire NZ',
  url: 'https://www.jamesblond.co.nz/cargo-van-hire',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  priceRange: '$$',
  areaServed: [
    { '@type': 'City', name: 'Auckland' },
    { '@type': 'City', name: 'Wellington' },
    { '@type': 'City', name: 'Christchurch' },
    { '@type': 'City', name: 'Hamilton' },
  ],
  openingHours: 'Mo-Su 08:00-17:00',
};

const CargoVanHire = () => (
  <SimpleHubPage
    slug="/cargo-van-hire"
    title="Cargo Van Hire NZ from $115/day — Same-Day Van Rental"
    description="Cargo van hire across New Zealand from $115/day (from $95/day on 10+ days). 6m³ standard, 9m³ jumbo and high-roof cargo vans for couriers, trades and deliveries. Drive on a car licence, same-day pickup."
    h1="Cargo Van Hire NZ — 6m³ to 9m³ Vans, Same-Day Pickup"
    intro="Need load space without a truck licence? Our cargo vans carry pallets, appliances, tools and courier freight all day, park in standard carparks, and cost far less than a truck. Branches in Auckland, Wellington, Christchurch and Hamilton — hire by the hour, the day, the week or on an ongoing courier contract."
    bullets={[
      'Standard cargo van 6m³ (2.8 × 1.5 × 1.35m) — from $115/day',
      'Jumbo cargo van 9m³ (3.0 × 1.6 × 1.9m) — stand-up height, from $130/day',
      'High-roof cargo van (3.4 × 1.6 × 1.6m) — long-load friendly',
      'Flat, sealed load floors with tie-down points and ply lining',
      'Drive on a standard NZ Class 1 car licence — no endorsement needed',
      'Hourly rates from $35 for 2 hours, weekly and monthly contract rates available',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a cargo van"
    cities={cities}
    localBusiness={localBusiness}
    priceTable={{
      heading: 'Cargo van hire rates (GST inclusive)',
      note: 'Rates shown are per vehicle. Longer hires drop to the 10+ day rate automatically. Kilometre charges apply on jumbo and high-roof vans — see the full price guide.',
      rows: [
        { item: 'Standard Cargo Van 6m³', daily: '$115/day', weekend: '$100/day', best: '$95/day (10+ days)' },
        { item: 'Jumbo Cargo Van 9m³', daily: '$130/day', weekend: '$115/day', best: '$100/day (10+ days)' },
        { item: 'High-Roof Cargo Van', daily: '$130/day', weekend: '$115/day', best: '$100/day (10+ days)' },
        { item: 'Rear-Seat Van 6m³ (crew + cargo)', daily: '$130/day', weekend: '$120/day', best: '$110/day (10+ days)' },
      ],
    }}
    sections={[
      {
        h2: 'Which cargo van size do you need?',
        body: 'Most jobs come down to whether you need to stand up inside the van and how long your longest item is.',
        points: [
          '6m³ standard — courier runs, 20–25 boxes, flat-pack furniture, tools and a trade kit-out.',
          '9m³ jumbo — near stand-up height, fits a fridge upright, ideal for whiteware and appliance deliveries.',
          'High roof — 3.4m load length, best for timber, pipe, ladders, mattresses and long fittings.',
          'Rear-seat van — carries a two- or three-person crew plus 6m³ of gear in one vehicle.',
        ],
      },
      {
        h2: 'Cargo van hire for couriers and trades',
        body: 'If you run deliveries or a trade, an ongoing van hire beats owning one: no depreciation, no WOF or service scheduling, no downtime when something breaks. We swap the vehicle instead. Weekly and monthly contract rates are available, along with dedicated courier operator pricing for regular multi-vehicle hires.',
      },
      {
        h2: 'What is included',
        body: 'Every cargo van hire includes GST, standard insurance cover, roadside assistance and a full walk-around at pickup. Optional extras include hand trolleys, moving blankets, tie-down straps and pallet jacks — useful if you are shifting whiteware or palletised freight.',
      },
    ]}
    faq={[
      { q: 'How much does it cost to hire a cargo van in NZ?', a: 'Cargo van hire starts from $115/day for a standard 6m³ van and $130/day for a 9m³ jumbo or high-roof van. Short hires start from $35 for two hours, and hires of 10 days or more drop to $95/day on the standard van. All rates include GST and standard insurance.' },
      { q: 'Do I need a special licence to drive a cargo van?', a: 'No. Every cargo van in our fleet is under 3,500kg and can be driven on a standard NZ Class 1 car licence. They are automatic, car-height and park in normal carparks.' },
      { q: 'What fits in a 6m³ cargo van?', a: 'A standard 6m³ cargo van fits roughly 20–25 medium moving boxes, a washing machine plus a dryer, flat-pack furniture, or a full trade tool kit-out. Load space is 2.8m long, 1.5m wide and 1.35m high.' },
      { q: 'Can I hire a cargo van long term for courier work?', a: 'Yes — weekly, monthly and ongoing contract rates are available, including multi-vehicle courier operator pricing. Call 0800 525 663 and we will build a rate around your run.' },
      { q: 'Where can I pick up a cargo van?', a: 'Cargo vans are available in Auckland (CBD, Penrose, West Auckland, South Auckland and the Airport), Wellington CBD, Christchurch (Central and Airport) and Hamilton (Frankton). Same-day pickup is usually available.' },
      { q: 'Is a cargo van cheaper than a truck?', a: 'Yes, for most jobs. A cargo van is around $115/day versus $125–$140/day for a 2-tonne truck, uses less fuel, and is easier to park and drive. Step up to a truck only when you need volume over 9m³ or a tail lift.' },
    ]}
  />
);

export default CargoVanHire;