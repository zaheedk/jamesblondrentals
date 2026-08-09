import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Minibus Hire Auckland', to: '/auckland-minibus-hire' },
  { name: 'Minibus Hire Wellington', to: '/wellington-minibus-hire' },
  { name: 'Minibus Hire Christchurch', to: '/christchurch-minibus-hire' },
  { name: 'Minibus Hire Hamilton', to: '/hamilton-minibus-hire' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Wedding Minibus Hire NZ',
  url: 'https://www.jamesblond.co.nz/wedding-minibus-hire',
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

const MinibusHireWeddings = () => (
  <SimpleHubPage
    slug="/wedding-minibus-hire"
    title="Wedding Minibus Hire NZ — 10 & 12 Seaters | James Blond"
    description="Self-drive wedding minibus hire in Auckland, Wellington, Christchurch and Hamilton. 10 and 12-seat minibuses for guest and bridal-party transport. Ring 0800 525 663 for a quote on your date."
    h1="Wedding Minibus Hire — Get Every Guest There Together"
    intro="Move the bridal party, family and guests between the ceremony, photos and reception in one vehicle. Our 10 and 12-seat minibuses drive on a standard NZ car licence, so a friend or family member can be the driver — no charter operator needed. Rates change with date and demand, so ring 0800 525 663 for a quote."
    bullets={[
      'Drive on a standard NZ Class 1 car licence — no special endorsement',
      '10-seat, 12-seat and premium 12-seat minibuses available',
      'Air conditioning throughout and full-height seats for comfort in formalwear',
      'Unlimited kilometres — venue, photo stops and after-party all covered',
      'Multi-day hire so you can cover the rehearsal dinner and the day itself',
      'Quote-only pricing — we price your actual dates, not a generic rate card',
    ]}
    primaryCtaTo="/contact"
    primaryCtaLabel="Get a wedding quote"
    cities={cities}
    localBusiness={localBusiness}
    sections={[
      {
        h2: 'How wedding parties usually book with us',
        body: 'Most couples book one minibus for the bridal party and a second for guests staying at the same hotel. Pick up the afternoon before so the vehicle is on-site for the morning, and return the day after the wedding — a two or three-day hire almost always works out cheaper and less stressful than same-day pickup.',
        points: [
          'Book the vehicle from the day before to avoid morning-of pressure',
          'Nominate two drivers so nobody is locked into being sober driver all night',
          'Ask about a second van or minibus for guest shuttles between hotel and venue',
          'Vineyard, beach and rural venues: check parking and access with your venue first',
        ],
      },
      {
        h2: 'Which minibus suits your wedding?',
        body: 'The 12-seat Toyota Hiace ZX is our most-booked wedding vehicle — full-height seats, air conditioning and a diesel engine for longer runs to rural venues. The premium 12-seat LDV Deliver 9 adds a luxury interior for the bridal party, while the 10-seat Hiace ZL is an easy first step up from a car for smaller groups.',
      },
    ]}
    faq={[
      { q: 'Do I need a special licence to drive a wedding minibus?', a: 'No. Our 10 and 12-seat minibuses can be driven on a standard New Zealand Class 1 car licence. Overseas licences in English (or with an accredited translation / IDP) are also accepted.' },
      { q: 'How much does wedding minibus hire cost?', a: 'Minibus rates move with the date and demand — weekends in peak wedding season price differently to a midweek hire. We quote on your actual dates: ring 0800 525 663 or send an enquiry and we will come back with a firm price.' },
      { q: 'Can we decorate the minibus?', a: 'Yes, as long as it is non-permanent and does not damage paint, glass or upholstery. Ribbons and removable signage are fine; adhesives, staples and anything obscuring the driver’s view are not.' },
      { q: 'Can we hire for more than one day?', a: 'Absolutely — multi-day hire is the norm for weddings. Pick up the day before the wedding and return after, and you cover the rehearsal, the day and the airport runs.' },
      { q: 'Which cities can we collect from?', a: 'Auckland (including Auckland Airport), Wellington, Christchurch and Hamilton. Unlimited kilometres are included, so you can drive to a rural or out-of-town venue.' },
    ]}
  />
);

export default MinibusHireWeddings;
