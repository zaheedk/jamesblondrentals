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
  name: 'James Blond Rentals — Sports Team Minibus Hire NZ',
  url: 'https://www.jamesblond.co.nz/sports-team-minibus-hire',
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

const MinibusHireSportsTeams = () => (
  <SimpleHubPage
    slug="/sports-team-minibus-hire"
    title="Sports Team Minibus Hire NZ — 10 & 12 Seat Vans | James Blond"
    description="Minibus and 12-seater hire for sports teams, clubs and schools in Auckland, Wellington, Christchurch and Hamilton. Tow bars for gear trailers, unlimited kilometres. Ring 0800 525 663."
    h1="Sports Team Minibus Hire — Squad, Gear and Away Games"
    intro="Get the whole squad to the away game in one vehicle. Our 10 and 12-seat minibuses drive on a standard car licence, include unlimited kilometres for long road trips, and most have a tow bar so you can bring a gear trailer. Team rates are quoted on your dates."
    bullets={[
      'Standard NZ car licence is all a team manager or parent driver needs',
      'Tow bar fitted on most minibuses — add a cage or luggage trailer for kit',
      'Unlimited kilometres for inter-regional and away-game travel',
      'Air conditioning throughout and full-height seats for long trips',
      'Weekend and tournament-length hire, plus repeat-season arrangements',
      'Quote-only pricing — tell us your dates and we price the run',
    ]}
    primaryCtaTo="/contact"
    primaryCtaLabel="Get a team quote"
    cities={cities}
    localBusiness={localBusiness}
    sections={[
      {
        h2: 'Gear as well as players',
        body: 'A 12-seat minibus carries the squad, but rugby, hockey, rowing and cricket kit usually needs its own space. Most of our minibuses have a tow bar, so adding a cage or luggage trailer is the cheapest way to move bags, balls and water bottles without piling gear on seats.',
        points: [
          'Cage trailer for bulk kit bags and water containers',
          'Luggage trailer with a hard lid for gear that has to stay dry',
          'Second van for reserves, coaching staff and supporters',
          'Rear-seat vans if you need both people and a large cargo area in one vehicle',
        ],
      },
      {
        h2: 'Clubs, schools and season-long hire',
        body: 'If your club runs regular away fixtures, talk to us about a season arrangement rather than booking each weekend separately. We can set up recurring hires across Auckland, Wellington, Christchurch and Hamilton branches and keep the paperwork and drivers on file.',
      },
    ]}
    faq={[
      { q: 'Can a parent or team manager drive the minibus?', a: 'Yes. Our 10 and 12-seat minibuses are driven on a standard New Zealand Class 1 car licence — no passenger endorsement is required for private team transport where you are not charging passengers a fare.' },
      { q: 'How much is minibus hire for a sports team?', a: 'Minibus rates vary by dates, season and demand, so we do not publish a fixed rate card. Ring 0800 525 663 with your travel dates and we will quote the hire, including any trailer.' },
      { q: 'Can we tow a gear trailer?', a: 'Yes — most of our minibuses are fitted with a tow bar. Add a cage or luggage trailer to the same booking and we will match the trailer coupling and safety chains for you.' },
      { q: 'How many players fit?', a: 'Twelve including the driver in the 12-seat Hiace ZX or premium LDV Deliver 9, and ten in the 10-seat Hiace ZL. Larger squads usually take a minibus plus a van.' },
      { q: 'Is there a minimum age for drivers?', a: 'Drivers must meet our standard licence and age requirements for commercial-class vehicles — check with our team when you book so the nominated drivers are approved in advance.' },
    ]}
  />
);

export default MinibusHireSportsTeams;
