import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Christchurch Truck Hire', to: '/truck-hire-christchurch' },
  { name: 'Christchurch Van Hire', to: '/christchurch-van-hire' },
  { name: 'Christchurch Car Hire', to: '/car-hire-christchurch' },
  { name: 'Contact Christchurch', to: '/contact/christchurch' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Christchurch',
  url: 'https://jamesblond.co.nz/trailer-hire-christchurch',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Christchurch',
    addressRegion: 'Canterbury',
    addressCountry: 'NZ',
  },
  areaServed: { '@type': 'City', name: 'Christchurch' },
  openingHours: 'Mo-Su 08:00-17:00',
};

const TrailerHireChristchurch = () => (
  <SimpleHubPage
    slug="/trailer-hire-christchurch"
    title="Trailer Hire Christchurch — Cage, Luggage & Car Transporter Trailers"
    description="Trailer hire in Christchurch from $40/day. Cage, luggage and car-transporter trailers with same-day pickup across Canterbury."
    h1="Trailer Hire Christchurch — Cage, Luggage & Car Transporters"
    intro="From tip runs to Rolleston moves and Mt Hutt gear runs, our Christchurch trailers are WOF'd, registered and ready when you are. Same-day pickup and daily, weekend or weekly rates."
    bullets={[
      'Caged trailers for tip runs, garden waste and bulky loads',
      'Luggage trailers for house moves, road trips and ski trips',
      'Car-transporter trailers for vehicle relocations across Canterbury',
      'WOF and registration always current',
      'Same-day pickup from Christchurch branches',
      'Tow on a standard NZ Class 1 licence (most trailers)',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a trailer"
    cities={cities}
    localBusiness={localBusiness}
    faq={[
      { q: 'How much does trailer hire cost in Christchurch?', a: 'Cage trailer hire in Christchurch starts from around $40/day. Luggage and car-transporter trailers are slightly higher. Online booking shows live availability and the exact daily rate.' },
      { q: 'What kinds of trailers can I hire in Christchurch?', a: 'We hire caged trailers (tip runs, green waste, bulky goods), lockable luggage trailers (moves, road trips, ski trips) and car-transporter trailers for shifting a vehicle around Canterbury.' },
      { q: 'Do I need a special licence to tow a trailer in Christchurch?', a: 'No — most caged and luggage trailers can be towed on a Class 1 NZ car licence. Heavier combinations may need a Class 2 endorsement; we flag this at booking.' },
      { q: 'Where do I pick up the trailer in Christchurch?', a: 'Trailers are available at our Christchurch branches for same-day pickup. Enter your dates in the booking form for the closest branch.' },
      { q: 'Can I take a Christchurch trailer to Rolleston, Rangiora or further afield?', a: 'Yes — our trailers can be taken anywhere in New Zealand. Rolleston, Rangiora, Ashburton and Timaru runs are common. One-way hire is available on request.' },
      { q: 'Is insurance included with trailer hire?', a: 'Basic cover is included with a standard excess. Damage caused by your towing vehicle is generally covered by your own vehicle insurance — check with your insurer before towing.' },
      { q: 'Does my vehicle need a tow bar?', a: 'Yes — your vehicle needs a properly fitted tow bar rated for the trailer and load. Ask us at the counter if unsure.' },
      { q: 'What is the minimum age to hire a trailer?', a: 'Drivers must be at least 21 with a full New Zealand licence or an approved overseas equivalent.' },
    ]}
  />
);

export default TrailerHireChristchurch;