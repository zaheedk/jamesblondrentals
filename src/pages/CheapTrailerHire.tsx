import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Trailer Hire Auckland', to: '/trailer-hire-auckland' },
  { name: 'Trailer Hire Hamilton', to: '/trailer-hire-hamilton' },
  { name: 'Trailer Hire Wellington', to: '/trailer-hire-wellington' },
  { name: 'Trailer Hire Christchurch', to: '/trailer-hire-christchurch' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Cheap Trailer Hire NZ',
  url: 'https://jamesblond.co.nz/cheap-trailer-hire',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  priceRange: '$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NZ',
  },
  areaServed: [
    { '@type': 'City', name: 'Auckland' },
    { '@type': 'City', name: 'Hamilton' },
    { '@type': 'City', name: 'Wellington' },
    { '@type': 'City', name: 'Christchurch' },
  ],
  openingHours: 'Mo-Su 08:00-17:00',
};

const CheapTrailerHire = () => (
  <SimpleHubPage
    slug="/cheap-trailer-hire"
    title="Cheap Trailer Hire NZ from $65/day — Cage & Luggage Trailers"
    description="Cheap trailer hire in New Zealand from $65 a day. Cage, luggage and car-transporter trailers in Auckland, Hamilton, Wellington and Christchurch. Same-day pickup, no hidden fees."
    h1="Cheap Trailer Hire NZ — from $65 a Day"
    intro="Low-cost trailer hire without the low-cost surprises. Cage, luggage and car-transporter trailers from $65/day at James Blond branches in Auckland, Hamilton, Wellington and Christchurch — WOF'd, registered and ready for same-day pickup."
    bullets={[
      'Cage trailers from $65/day — the cheapest way to do a tip run',
      'Weekend rates: pick up Friday, return Monday',
      'No hidden admin or counter fees — the quoted rate is the rate',
      'Tow on a standard NZ Class 1 car licence (most trailers)',
      'WOF and registration always current',
      'Same-day pickup from four main-centre branches',
    ]}
    priceTable={{
      heading: 'How cheap is cheap? Our trailer rates',
      note: 'Indicative rates — live availability and the exact price for your dates show in online booking. Rates exclude ratchet straps and rope, available as low-cost counter extras.',
      rows: [
        { item: 'Caged trailer', daily: 'from $65', weekend: 'from $100', best: 'Tip runs, green waste, bulky rubbish' },
        { item: 'Luggage trailer (lockable)', daily: 'from $45', weekend: 'from $90', best: 'House moves, road trips, ski gear' },
        { item: 'Car-transporter trailer', daily: 'from $120', weekend: 'from $200', best: 'Shifting a vehicle between cities' },
      ],
    }}
    sections={[
      {
        h2: 'Why our trailer hire works out cheaper',
        body: 'Most "cheap" trailer deals get expensive at the counter. We keep the total honest: one daily rate, no per-kilometre charge on trailers, no admin fee, and no premium for weekend returns. Because our trailers sit at the same branches as our vans and trucks, you can also downgrade from a truck to a trailer on the day if the load turns out smaller than you thought.',
        points: [
          'No per-kilometre charges on trailer hire',
          'Weekend hire priced as two days, not three',
          'Free swap to a bigger or smaller trailer if one is available',
          'Multi-day and weekly rates lower the daily price further',
        ],
      },
      {
        h2: 'Cheapest trailer for the job',
        body: 'A caged trailer is almost always the cheapest option and handles most tip runs, garden clean-ups and single-item pickups. Step up to a lockable luggage trailer when the load needs to stay dry or secure overnight, and only take a car transporter when you are genuinely moving a vehicle. If you are moving more than a bedroom of furniture, a van or 2-tonne truck usually beats a trailer on both time and fuel.',
      },
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Check trailer availability"
    cities={cities}
    localBusiness={localBusiness}
    faq={[
      { q: 'What is the cheapest trailer hire in NZ?', a: 'Our caged trailers are the cheapest option, starting from around $65 per day. They suit tip runs, garden waste and bulky household items, and can be towed on a standard NZ car licence.' },
      { q: 'Is cheap trailer hire cheaper than hiring a van or truck?', a: 'Yes for small, open loads — a caged trailer from $65/day undercuts a van or truck. But if the load needs to stay dry, or is more than about a bedroom of furniture, a cargo van or 2-tonne truck is usually faster and better value overall.' },
      { q: 'Are there hidden fees with your trailer hire?', a: 'No. There is no per-kilometre charge on trailers and no counter admin fee. A refundable pre-authorisation hold is placed on your card at pickup and released on return.' },
      { q: 'Can I hire a cheap trailer for the weekend?', a: 'Yes. Pick up Friday afternoon and return Monday morning, charged as a weekend rate rather than three full days.' },
      { q: 'Which cities can I hire a cheap trailer in?', a: 'Auckland, Hamilton, Wellington and Christchurch — every James Blond branch carries trailers, with same-day pickup subject to availability.' },
      { q: 'Do I need a tow bar and a special licence?', a: 'You need a properly fitted tow bar rated for the trailer and load. Most caged and luggage trailers can be towed on a Class 1 NZ car licence; heavier combinations may need a Class 2 endorsement, which we flag at booking.' },
      { q: 'Is insurance included in the cheap rate?', a: 'Basic cover with a standard excess is included in the quoted rate. Damage caused by your towing vehicle is generally covered by your own vehicle insurance — check with your insurer before towing.' },
      { q: 'What is the minimum age for cheap trailer hire?', a: 'Drivers must be at least 21 and hold a full New Zealand licence or an approved overseas equivalent.' },
    ]}
  />
);

export default CheapTrailerHire;