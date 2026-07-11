import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Auckland Truck Hire', to: '/auckland-truck-rentals' },
  { name: 'Auckland Van Hire', to: '/auckland-van-hire' },
  { name: 'Auckland Car Hire', to: '/auckland-car-hire' },
  { name: 'Auckland Airport', to: '/airport/auckland' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Auckland',
  url: 'https://jamesblond.co.nz/trailer-hire-auckland',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Auckland',
    addressRegion: 'Auckland',
    addressCountry: 'NZ',
  },
  areaServed: { '@type': 'City', name: 'Auckland' },
  openingHours: 'Mo-Su 08:00-17:00',
};

const TrailerHireAuckland = () => (
  <SimpleHubPage
    slug="/trailer-hire-auckland"
    title="Trailer Hire Auckland — Cage, Luggage & Car Transporter Trailers"
    description="Trailer hire in Auckland from $40/day. Cage, luggage and car-transporter trailers. Same-day pickup across Auckland, tow on a standard NZ car licence."
    h1="Trailer Hire Auckland — Cage, Luggage & Car Transporters"
    intro="Whether it's a tip run, a house move or shifting a vehicle across town, our Auckland trailers are WOF'd, registered and ready to go. Same-day pickup, daily and weekly rates, and easy online booking."
    bullets={[
      'Caged trailers for tip runs, garden waste and bulky loads',
      'Luggage trailers for house moves, road trips and ski gear',
      'Car-transporter trailers for vehicle relocations across Auckland',
      'WOF and registration always current',
      'Same-day pickup from Auckland branches',
      'Tow on a standard NZ Class 1 licence (most trailers)',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a trailer"
    cities={cities}
    localBusiness={localBusiness}
    faq={[
      { q: 'How much does trailer hire cost in Auckland?', a: 'Cage trailer hire in Auckland starts from around $40/day. Luggage trailers and car transporters are slightly higher. Online booking shows live availability and the exact daily rate for your dates.' },
      { q: 'What types of trailers can I hire in Auckland?', a: 'We hire caged trailers (tip runs, green waste, bulky goods), lockable luggage trailers (moves, road trips) and car-transporter trailers for shifting cars around Auckland or further afield.' },
      { q: 'Do I need a special licence to tow a trailer in Auckland?', a: 'No — all standard caged and luggage trailers can be towed on a Class 1 NZ car licence. Heavier combinations may need a Class 2 endorsement; we flag this at booking.' },
      { q: 'Where do I pick up the trailer in Auckland?', a: 'Trailers are available at our Auckland branches for same-day pickup. Enter your dates in the booking form for the closest branch to you.' },
      { q: 'Is insurance included with trailer hire?', a: 'Basic cover is included with a standard excess. Damage caused by your towing vehicle is generally covered by your own vehicle insurance — check with your insurer before towing.' },
      { q: 'Does my vehicle need a tow bar?', a: 'Yes — your vehicle needs a properly fitted tow bar with the correct rating for the trailer and load. Ask us at the counter if you are unsure.' },
      { q: 'Can I keep the trailer overnight or for the weekend?', a: 'Yes. Daily, weekend and weekly rates are available. Most customers grab a trailer Friday afternoon and return Monday morning.' },
      { q: 'What is the minimum age to hire a trailer?', a: 'Drivers must be at least 21 years old and hold a full New Zealand licence or an approved overseas equivalent.' },
    ]}
  />
);

export default TrailerHireAuckland;