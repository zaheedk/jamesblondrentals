import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Wellington Truck Hire', to: '/wellington-truck-rentals' },
  { name: 'Wellington Van Hire', to: '/van-hire-wellington' },
  { name: 'Wellington Car Hire', to: '/car-rental-wellington' },
  { name: 'Contact Wellington', to: '/contact/wellington' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Wellington',
  url: 'https://jamesblond.co.nz/trailer-hire-wellington',
  telephone: '+64800525663',
  email: 'info@jamesblond.co.nz',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Wellington',
    addressRegion: 'Wellington',
    addressCountry: 'NZ',
  },
  areaServed: { '@type': 'City', name: 'Wellington' },
  openingHours: 'Mo-Su 08:00-17:00',
};

const TrailerHireWellington = () => (
  <SimpleHubPage
    slug="/trailer-hire-wellington"
    title="Trailer Hire Wellington — Cage, Luggage & Car Transporter Trailers"
    description="Trailer hire in Wellington from $40/day. Cage, luggage and car-transporter trailers with same-day pickup. Tow on a standard NZ car licence."
    h1="Trailer Hire Wellington — Cage, Luggage & Car Transporters"
    intro="Need a trailer for a tip run, a flat move or a weekend project across Wellington? Our trailers are WOF'd, registered and ready. Pickup same day, keep it for the weekend or the week — your call."
    bullets={[
      'Caged trailers for tip runs and bulky loads',
      'Luggage trailers for flat moves and road trips',
      'Car-transporter trailers for vehicle relocations',
      'WOF and registration always current',
      'Same-day pickup from Wellington branches',
      'Tow on a standard NZ Class 1 licence (most trailers)',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a trailer"
    cities={cities}
    localBusiness={localBusiness}
    faq={[
      { q: 'How much does trailer hire cost in Wellington?', a: 'Cage trailer hire in Wellington starts from around $40/day. Luggage and car-transporter trailers are slightly higher. Online booking shows the exact daily rate for your dates.' },
      { q: 'What kinds of trailers can I hire in Wellington?', a: 'Caged trailers for tip runs and green waste, lockable luggage trailers for flat moves and road trips, and car-transporter trailers for shifting a car around the region.' },
      { q: 'Do I need a special licence to tow?', a: 'No — most caged and luggage trailers can be towed on a Class 1 NZ car licence. Heavier combinations may need a Class 2 endorsement; we flag this at booking.' },
      { q: 'Where do I pick up the trailer in Wellington?', a: 'Trailers are available at our Wellington branch for same-day pickup. Enter your dates in the booking form and we will confirm the closest branch.' },
      { q: 'Is insurance included with trailer hire?', a: 'Basic cover is included with a standard excess. Damage caused by your towing vehicle is generally covered by your own vehicle insurance.' },
      { q: 'Does my vehicle need a tow bar?', a: 'Yes — your vehicle needs a properly fitted tow bar rated for the trailer and load. Ask us at the counter if unsure.' },
      { q: 'Can I take a Wellington trailer around the lower North Island?', a: 'Yes — our trailers can go anywhere in New Zealand. Popular runs include Wellington to Palmerston North, the Wairarapa and the Kāpiti Coast.' },
      { q: 'What is the minimum age to hire a trailer?', a: 'Drivers must be at least 21 with a full New Zealand licence or an approved overseas equivalent.' },
    ]}
  />
);

export default TrailerHireWellington;