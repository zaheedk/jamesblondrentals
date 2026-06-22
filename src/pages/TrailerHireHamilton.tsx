import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Hamilton Truck Hire', to: '/truck-hire-hamilton' },
  { name: 'Hamilton Van Hire', to: '/van-hire-hamilton' },
  { name: 'Hamilton Car Hire', to: '/car-hire-hamilton' },
  { name: 'Contact Hamilton', to: '/contact/hamilton' },
];

const TrailerHireHamilton = () => (
  <SimpleHubPage
    slug="/trailer-hire-hamilton"
    title="Trailer Hire Hamilton — Cage, Luggage & Car Transporter Trailers"
    description="Trailer hire in Hamilton from our Frankton branch. Cage trailers, luggage trailers and car transporter trailers — daily and weekly rates, same-day pickup, tow on a standard licence."
    h1="Trailer Hire Hamilton — Cage, Luggage & Car Transporters"
    intro="Need a trailer for a tip run, a weekend project or to shift a car across the Waikato? Our Hamilton trailers are road-legal, well-maintained and ready when you are. Pickup from Frankton, return same day or by the week — your choice."
    bullets={[
      'Caged trailers for tip runs, garden waste and bulky loads',
      'Luggage trailers for moves and road trips',
      'Car-transporter trailers for vehicle relocations',
      'WOF and registration always current',
      'Same-day pickup from our Frankton branch',
      'Tow on a standard NZ Class 1 licence (most trailers)',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a trailer"
    cities={cities}
    faq={[
      { q: 'How much does it cost to hire a trailer in Hamilton?', a: 'Trailer hire in Hamilton starts from around $40/day for a caged trailer. Luggage and car-transporter trailers are slightly higher. Online booking shows live availability and the exact daily rate.' },
      { q: 'What kinds of trailers can I hire in Hamilton?', a: 'We hire caged trailers (tip runs, garden waste, bulky goods), luggage trailers (moves, road trips, ski trips) and car-transporter trailers for shifting vehicles around the Waikato.' },
      { q: 'Do I need a special licence to tow your trailers?', a: 'No — all standard caged and luggage trailers can be towed on a Class 1 NZ car licence. Heavier combinations may require a Class 2 endorsement; we’ll flag that at booking.' },
      { q: 'Where do I collect the trailer?', a: 'All Hamilton trailers are picked up from our Frankton branch at 17 Bandon Street, with easy access to SH1 and SH3.' },
      { q: 'Can I keep the trailer overnight or for the weekend?', a: 'Yes — daily, weekend and weekly rates are available. Most customers grab a trailer Friday afternoon and return Monday morning.' },
      { q: 'Does my vehicle need a tow bar?', a: 'Yes, your vehicle needs a properly fitted tow bar with the correct rating for the trailer and load. We can advise at the counter if you’re unsure.' },
    ]}
  />
);

export default TrailerHireHamilton;