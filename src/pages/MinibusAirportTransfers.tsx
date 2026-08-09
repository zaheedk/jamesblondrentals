import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Auckland Airport Minibus Hire', to: '/auckland-airport-minibus-rentals-hire' },
  { name: 'Minibus Hire Auckland', to: '/auckland-minibus-hire' },
  { name: 'Minibus Hire Wellington', to: '/wellington-minibus-hire' },
  { name: 'Minibus Hire Christchurch', to: '/christchurch-minibus-hire' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Airport Transfer Minibus Hire NZ',
  url: 'https://www.jamesblond.co.nz/airport-transfer-minibus-hire',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  address: { '@type': 'PostalAddress', addressCountry: 'NZ' },
  areaServed: [
    { '@type': 'City', name: 'Auckland' },
    { '@type': 'City', name: 'Wellington' },
    { '@type': 'City', name: 'Christchurch' },
    { '@type': 'City', name: 'Hamilton' },
  ],
  openingHours: 'Mo-Su 08:00-17:00',
};

const MinibusAirportTransfers = () => (
  <SimpleHubPage
    slug="/airport-transfer-minibus-hire"
    title="Airport Transfer Minibus Hire NZ — 10 & 12 Seaters | James Blond"
    description="Self-drive minibus hire for airport transfers in Auckland, Wellington and Christchurch. 10 and 12-seat vans with luggage space for groups and tour parties. Ring 0800 525 663 for a quote."
    h1="Airport Transfer Minibus Hire — Group and Luggage in One Trip"
    intro="Landing as a group? One 12-seat minibus beats three taxis and a luggage problem. Collect near Auckland, Wellington or Christchurch airport, load the bags, and drive the whole party to the hotel, conference or ski field yourself. Rates are quoted on your dates."
    bullets={[
      '10 and 12-seat minibuses driven on a standard car licence',
      'Rear luggage space for group bags — plus trailers if you have skis or gear',
      'Auckland Airport, Wellington and Christchurch collection points',
      'Unlimited kilometres — keep the minibus for the whole trip, not just the transfer',
      'Air conditioning throughout for long transfers and warm arrivals',
      'Quote-only pricing on your flight dates — ring 0800 525 663',
    ]}
    primaryCtaTo="/contact"
    primaryCtaLabel="Get a transfer quote"
    cities={cities}
    localBusiness={localBusiness}
    sections={[
      {
        h2: 'Keep the minibus for the whole trip',
        body: 'A one-off shuttle gets you to the hotel; a hired minibus keeps the group mobile all week. With unlimited kilometres included, most groups keep the vehicle for the full stay and use it for the conference, the wine tour, the ski field and the return flight — usually for less than the total cost of repeated shuttle fares.',
        points: [
          'Conference and corporate groups moving between venue and hotel',
          'Ski trips to Ruapehu, Mt Hutt and Porters — tow bar for gear trailers',
          'Family reunions and tour parties arriving on the same flight',
          'Church, school and community groups on multi-stop itineraries',
        ],
      },
      {
        h2: 'Luggage planning for 10–12 people',
        body: 'Twelve passengers with twelve checked bags will fill a minibus. If your group is flying with full-size suitcases, ski bags or sports gear, add a luggage or cage trailer to the booking, or split across a minibus plus a van — tell us the group size and bag count and we will size it for you.',
      },
    ]}
    faq={[
      { q: 'Can I pick up a minibus at Auckland Airport?', a: 'Yes — our Auckland Airport branch serves both terminals. See our Auckland Airport minibus page for shuttle and pickup instructions, then ring 0800 525 663 to confirm availability for your flight time.' },
      { q: 'How much does an airport transfer minibus cost?', a: 'Minibus rates change with date and demand, so we quote rather than publish a rate card. Ring 0800 525 663 or send an enquiry with your flight dates for a firm price.' },
      { q: 'Will 12 passengers plus luggage fit?', a: 'Twelve passengers fit comfortably, but twelve full-size suitcases will not fit in the rear space alone. For heavy luggage add a luggage or cage trailer, or take a minibus plus a van.' },
      { q: 'Do I need a special licence?', a: 'No — a standard New Zealand Class 1 car licence covers our 10 and 12-seat minibuses. Overseas licences in English, or with an accredited translation or IDP, are accepted.' },
      { q: 'Can we collect after a late-night arrival?', a: 'Branch hours apply, so let us know your flight number and arrival time when you enquire and we will confirm what is possible for your pickup.' },
    ]}
  />
);

export default MinibusAirportTransfers;
