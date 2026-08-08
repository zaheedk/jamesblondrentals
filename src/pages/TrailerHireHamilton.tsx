import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Hamilton Truck Hire', to: '/truck-hire-hamilton' },
  { name: 'Hamilton Van Hire', to: '/van-hire-hamilton' },
  { name: 'Hamilton Car Hire', to: '/car-hire-hamilton' },
  { name: 'Contact Hamilton', to: '/contact/hamilton' },
  { name: 'Cheap Trailer Hire NZ', to: '/cheap-trailer-hire' },
  { name: 'Trailer Hire Auckland', to: '/trailer-hire-auckland' },
];

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  "name": "James Blond Rentals — Hamilton",
  "url": "https://jamesblond.co.nz/trailer-hire-hamilton",
  "telephone": "+64800525663",
  "email": "info@jamesblond.co.nz",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "17 Bandon Street",
    "addressLocality": "Frankton",
    "addressRegion": "Hamilton",
    "postalCode": "3204",
    "addressCountry": "NZ",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-37.7833",
    "longitude": "175.2667",
  },
  "openingHours": "Mo-Su 08:00-17:00",
  "areaServed": {
    "@type": "City",
    "name": "Hamilton",
  },
};

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
    priceTable={{
      heading: 'Hamilton trailer hire rates',
      note: 'Indicative rates from our Frankton branch — live availability and the exact price for your dates show in online booking.',
      rows: [
        { item: 'Caged trailer', daily: 'from $65', weekend: 'from $100', best: 'Tip runs to Lincoln Street, green waste, bulky rubbish' },
        { item: 'Luggage trailer (lockable)', daily: 'from $45', weekend: 'from $90', best: 'Flat moves, road trips, Ruapehu ski gear' },
        { item: 'Car-transporter trailer', daily: 'from $120', weekend: 'from $200', best: 'Shifting a vehicle around the Waikato' },
      ],
    }}
    sections={[
      {
        h2: 'How Hamilton customers search for a trailer',
        body: 'Most Hamilton trailer enquiries fall into three jobs: a weekend tip run, a small flat move, or shifting a car. Our Frankton branch sits minutes from SH1 and SH3, so Chartwell, Rototuna, Te Rapa, Cambridge and Te Awamutu runs are all short hops — and you can grab the trailer on the way out of town rather than doubling back.',
        points: [
          'Tip runs to the Lincoln Street transfer station',
          'Garden and green-waste clean-ups across Rototuna and Chartwell',
          'Small flat and student moves near the University of Waikato',
          'Cambridge, Te Awamutu and Morrinsville pickups and deliveries',
        ],
      },
      {
        h2: 'Trailer, van or truck for a Hamilton move?',
        body: 'A caged trailer is the cheapest option and fine for open loads. If the load needs to stay dry, a lockable luggage trailer or a cargo van is the better call. Anything over roughly a bedroom of furniture is faster in one 2-tonne truck run than three trailer trips — our Hamilton branch carries all three, so you can switch on the day.',
      },
    ]}
    cities={cities}
    localBusiness={localBusiness}
    faq={[
      { q: 'How much does it cost to hire a trailer in Hamilton?', a: 'Trailer hire in Hamilton starts from around $65/day for a caged trailer. Luggage and car-transporter trailers are slightly higher. Online booking shows live availability and the exact daily rate.' },
      { q: 'What kinds of trailers can I hire in Hamilton?', a: 'We hire caged trailers (tip runs, garden waste, bulky goods), luggage trailers (moves, road trips, ski trips) and car-transporter trailers for shifting vehicles around the Waikato.' },
      { q: 'Do I need a special licence to tow your trailers?', a: 'No — all standard caged and luggage trailers can be towed on a Class 1 NZ car licence. Heavier combinations may require a Class 2 endorsement; we’ll flag that at booking.' },
      { q: 'Where do I collect the trailer?', a: 'All Hamilton trailers are picked up from our Frankton branch at 17 Bandon Street, with easy access to SH1 and SH3.' },
      { q: 'Can I keep the trailer overnight or for the weekend?', a: 'Yes — daily, weekend and weekly rates are available. Most customers grab a trailer Friday afternoon and return Monday morning.' },
      { q: 'Does my vehicle need a tow bar?', a: 'Yes, your vehicle needs a properly fitted tow bar with the correct rating for the trailer and load. We can advise at the counter if you’re unsure.' },
      { q: 'What is the minimum age to hire a trailer in Hamilton?', a: 'Drivers must be at least 21 years old and hold a full New Zealand licence (or an approved overseas equivalent). The towing vehicle must also meet the trailer’s tow-rating requirements.' },
      { q: 'Is insurance included with trailer hire?', a: 'Basic cover is included with a standard excess. Note that damage caused by your towing vehicle is generally covered by your own vehicle insurance — check with your insurer before towing.' },
      { q: 'Is a bond required for trailer hire?', a: 'Yes — a refundable pre-authorisation hold is placed on your credit or debit card at pickup. The amount depends on the trailer type. Prepaid cards are not accepted.' },
      { q: 'How heavy can I load a Hamilton trailer?', a: 'Each trailer has a clearly stamped maximum gross weight. Caged trailers typically carry up to 750 kg unbraked; car transporters and braked trailers carry more. Don’t exceed the rated load — overloaded trailers are dangerous and uninsured.' },
      { q: 'Can I take a trailer outside Hamilton?', a: 'Yes — our trailers can be taken anywhere in New Zealand. One-way trailer hire between branches is available on request.' },
      { q: 'Do you supply tie-downs and ratchet straps?', a: 'Ratchet straps and rope are available as low-cost extras at the counter — strongly recommended for any open caged or car-transporter load.' },
      { q: 'Can I pick up or drop off outside opening hours?', a: 'Yes — after-hours pick up and drop off are available on request. Phone 0800 525 663 to arrange in advance.' },
    ]}
  />
);

export default TrailerHireHamilton;