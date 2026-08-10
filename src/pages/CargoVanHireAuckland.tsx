import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'West Auckland Cargo Vans', to: '/west-auckland-cargo-van-rentals-hire' },
  { name: 'South Auckland Cargo Vans', to: '/south-auckland-cargo-van-rentals-hire' },
  { name: 'Central Auckland Cargo Vans', to: '/central-auckland-cargo-van-rentals-hire' },
  { name: 'Auckland Airport Cargo Vans', to: '/auckland-airport-cargo-van-rentals-hire' },
  { name: 'Cargo Van Hire NZ', to: '/cargo-van-hire' },
  { name: 'Auckland Van Hire', to: '/auckland-van-hire' },
  { name: 'Auckland Truck Hire', to: '/auckland-truck-rentals-hire' },
  { name: 'Courier & Operator Deals', to: '/courier-operator-deals' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Cargo Van Hire Auckland',
  url: 'https://www.jamesblond.co.nz/cargo-van-hire-auckland',
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

const CargoVanHireAuckland = () => (
  <SimpleHubPage
    slug="/cargo-van-hire-auckland"
    title="Cargo Van Hire Auckland from $115/day — 5 Branches, Same Day"
    description="Cargo van hire in Auckland from $115/day (from $95/day on 10+ days). 6m³ and 9m³ jumbo cargo vans at Penrose, CBD, West and South Auckland and the Airport. Car licence only, same-day pickup."
    h1="Cargo Van Hire Auckland — 6m³ & 9m³ Vans from $115/day"
    intro="Five Auckland pickup points, vans on the road seven days a week. Whether it's a courier run across the isthmus, a whiteware delivery to the North Shore or a trade fit-out in the CBD, our cargo vans carry the load on a standard car licence — no truck, no HT endorsement, no city height restrictions."
    bullets={[
      'Five Auckland branches: Penrose, CBD, West Auckland, South Auckland and Auckland Airport',
      'Standard 6m³ cargo van from $115/day — $95/day on 10+ day hires',
      'Jumbo 9m³ cargo van from $130/day — stand-up height, fits a fridge upright',
      'High-roof van for timber, pipe, ladders and long fittings',
      'Drive on a standard NZ Class 1 car licence',
      'Same-day pickup, plus weekly and monthly courier contract rates',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book an Auckland cargo van"
    cities={cities}
    localBusiness={localBusiness}
    priceTable={{
      heading: 'Auckland cargo van rates (GST inclusive)',
      note: 'Same rates at every Auckland branch. Longer hires automatically move to the 10+ day rate. Kilometre charges apply on jumbo and high-roof vans.',
      rows: [
        { item: 'Standard Cargo Van 6m³', daily: '$115/day', weekend: '$100/day', best: '$95/day (10+ days)' },
        { item: 'Jumbo Cargo Van 9m³', daily: '$130/day', weekend: '$115/day', best: '$100/day (10+ days)' },
        { item: 'High-Roof Cargo Van', daily: '$130/day', weekend: '$115/day', best: '$100/day (10+ days)' },
        { item: '2 hours (standard van)', daily: '$35', weekend: '$35', best: 'Quick local runs' },
      ],
    }}
    sections={[
      {
        h2: 'Where to pick up a cargo van in Auckland',
        body: 'Pick the branch closest to your run — it saves both time and kilometre charges.',
        points: [
          'Penrose (576 Great South Road) — best for the isthmus, Onehunga, Mount Wellington and East Tāmaki.',
          'Auckland CBD — best for city deliveries, apartment moves and Ponsonby, Grey Lynn and Newmarket.',
          'West Auckland (Kelston) — best for Henderson, New Lynn, Te Atatū, Massey and the north-west.',
          'South Auckland — best for Manukau, Papatoetoe, Ōtāhuhu, Takanini and the airport industrial area.',
          'Auckland Airport — best for freight pickups, inbound crews and Māngere.',
        ],
      },
      {
        h2: 'Common Auckland cargo van jobs',
        body: 'Auckland customers hire cargo vans for courier and meal-delivery runs, appliance and furniture deliveries, trade fit-outs, market and event set-ups, and single-room apartment moves. Because the vans sit at car height, they clear the 2.0m barriers in most CBD and mall carparks — something a box truck cannot do.',
      },
      {
        h2: 'Cargo van or small truck?',
        body: 'If your load is under 9m³ and you can load through the side or rear door, the cargo van is cheaper to hire and cheaper to run. Move up to a 2-tonne box truck when you need more than 9m³, a tail lift for heavy whiteware, or a walk-in load height for a full house move.',
      },
    ]}
    faq={[
      { q: 'How much is cargo van hire in Auckland?', a: 'Auckland cargo van hire starts from $115/day for a standard 6m³ van and $130/day for a 9m³ jumbo. Two-hour hires start from $35, and hires of 10 days or more come down to $95/day on the standard van. All rates include GST and standard insurance.' },
      { q: 'Which Auckland branch should I use?', a: 'Penrose suits the isthmus and east, the CBD branch suits city and inner-west deliveries, Kelston suits West Auckland, our South Auckland branch suits Manukau and Takanini, and the Airport branch suits freight and Māngere.' },
      { q: 'Can I drive an Auckland cargo van on a car licence?', a: 'Yes. All of our cargo vans are under 3,500kg and drive on a standard NZ Class 1 car licence. They are automatic and park in normal Auckland carparks.' },
      { q: 'Do you do long-term cargo van hire for Auckland couriers?', a: 'Yes — weekly, monthly and ongoing contract rates are available, including multi-vehicle courier operator pricing. Call 0800 525 663 with your run details for a quote.' },
      { q: 'Will a cargo van fit in a CBD carpark?', a: 'Our standard 6m³ cargo van is car height and clears the 2.0m barriers in most Auckland CBD and mall carparks. The 9m³ jumbo and high-roof vans are taller — check the clearance before you commit to an underground park.' },
      { q: 'Is same-day cargo van hire available in Auckland?', a: 'Yes, at all five Auckland branches subject to availability. Book online or call 0800 525 663 and we can usually have you on the road within the hour.' },
    ]}
  />
);

export default CargoVanHireAuckland;