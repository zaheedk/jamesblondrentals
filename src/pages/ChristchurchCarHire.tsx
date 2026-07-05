import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Car, Plane, Snowflake, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroCar from '@/assets/awd-suv-nz-mountain-adventure.jpg';
import coastal from '@/assets/auckland-car-rental-coastal-road.jpg';
import ski from '@/assets/hero-ski-season.jpg';
import eco from '@/assets/eco-hybrid-car-nz-landscape.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const PAGE_URL = `${SITE_URL}/car-hire-christchurch`;
const FROM_PRICE = '$45';

const cars = [
  {
    no: '01',
    name: 'Premium Economy',
    slug: '/fleet/cars/premium-economy',
    img: eco,
    blurb:
      'A fuel-sipping automatic hatch for solo travellers and short Christchurch stays — easy to park in the CBD, gentle on the tank up to Akaroa or out to Sumner.',
    spec: 'Auto · 5 seats · From $45/day',
  },
  {
    no: '02',
    name: 'Premium Midsize Sedan',
    slug: '/fleet/cars/premium-midsize',
    img: coastal,
    blurb:
      'A comfortable midsize for couples and business travellers — quiet on the motorway to Ashburton and Timaru, with a boot that swallows two large cases.',
    spec: 'Auto · 5 seats · Large boot',
  },
  {
    no: '03',
    name: 'Premium Compact SUV',
    slug: '/fleet/cars/premium-compact-suv',
    img: heroCar,
    blurb:
      'A higher ride for the family weekend — Hanmer Springs, Kaikōura or the wineries of Waipara — with the parking footprint of a hatchback.',
    spec: 'Auto · 5 seats · SUV',
  },
  {
    no: '04',
    name: 'Premium AWD SUV',
    slug: '/fleet/cars/premium-awd-suv',
    img: ski,
    blurb:
      'All-wheel-drive confidence for Mt Hutt, Porters and Arthur\'s Pass. Ski racks and chains available on request through winter.',
    spec: 'AWD · Auto · 5 seats',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does car hire cost in Christchurch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Car hire in Christchurch starts from ${FROM_PRICE} per day with James Blond Rentals. Weekly rates work out cheaper per day, and midweek pick-ups (Monday–Thursday) attract further discounts. See our hot deals page for current specials.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I pick up a hire car in Christchurch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'James Blond has two Christchurch pickup points: our central branch at 515 Moorhouse Avenue (five minutes from Cathedral Square, the Bus Interchange and Hagley Park) and a Christchurch Airport service with meet-and-greet on arrival.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I do a one-way rental from Christchurch to Queenstown?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. One-way car hire from Christchurch to Queenstown, Wānaka, Dunedin, Nelson, Picton and the North Island is available on request. See our one-way car hire page for routes and typical fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a 4WD or AWD in Christchurch in winter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For city driving in winter a 2WD is fine, but if you\'re heading to Mt Hutt, Porters, Cheeseman or over Arthur\'s Pass we strongly recommend our Premium AWD SUV. Snow chains can be added at booking.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum age to hire a car in Christchurch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Drivers must be at least 21 years old with a full licence held for a minimum of 12 months. Drivers aged 21–24 may incur a young-driver surcharge, but there is no upper age limit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is unlimited kilometres included?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Weekly rates typically include unlimited kilometres within the South Island. Daily rates include a generous distance allowance — confirm at booking if you\'re planning a long tour.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is the best car rental company in Christchurch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'James Blond Rentals is a New Zealand-owned car hire company independently rated 4.8 out of 5 across 1,200+ reviews, with two Christchurch pickup locations, transparent pricing and no hidden fees.',
      },
    },
  ],
};

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  name: 'James Blond Rentals — Christchurch Car Hire',
  image: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
  url: PAGE_URL,
  telephone: '+6433651122',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '515 Moorhouse Avenue, Waltham',
    addressLocality: 'Christchurch',
    addressRegion: 'Canterbury',
    postalCode: '8011',
    addressCountry: 'NZ',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -43.5406, longitude: 172.6395 },
  areaServed: [
    'Christchurch',
    'Canterbury',
    'Christchurch Airport',
    'Riccarton',
    'Addington',
    'Sydenham',
    'Sumner',
    'Akaroa',
    'Hanmer Springs',
    'Ashburton',
    'Timaru',
    'Mt Hutt',
  ],
  openingHours: 'Mo-Fr 07:30-17:30 Sa 08:00-14:00 Su 09:00-13:00',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1200' },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Car Hire', item: `${SITE_URL}/fleet/cars` },
    { '@type': 'ListItem', position: 3, name: 'Christchurch', item: PAGE_URL },
  ],
};

const ChristchurchCarHire = () => {
  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title={`Car Hire Christchurch | Cheap Car Rental from ${FROM_PRICE}/day | James Blond`}
        description="Car hire in Christchurch from $45/day. Two pickup locations — city (Moorhouse Ave) and Christchurch Airport. Economy cars, SUVs and AWD for South Island road trips. No hidden fees."
        canonical="/car-hire-christchurch"
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={localBusinessLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Christchurch · Canterbury · South Island
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Car hire in Christchurch,
                <span className="italic text-primary"> priced like a local.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                From weekend runs to Akaroa and Hanmer Springs to full South Island tours down to Queenstown, our Christchurch car hire fleet is set up for every kind of Canterbury trip — with two convenient pickup points and rates from just {FROM_PRICE} a day.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button asChild size="lg" className="rounded-full px-7">
                  <a href="#booking-form">Check availability</a>
                </Button>
                <a href="tel:0800525663" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
                  <Phone className="h-4 w-4" /> Call 0800 525 663
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <img src={heroCar} alt="AWD SUV rental for Christchurch car hire — Canterbury mountain road" className="w-full aspect-[4/5] object-cover" loading="eager" />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="font-serif text-2xl">{FROM_PRICE} / day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pickup locations */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-6 py-14 grid md:grid-cols-2 gap-10">
          <div className="bg-background p-8 border border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-widest">City branch</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Central Christchurch — 515 Moorhouse Ave</h2>
            <p className="text-muted-foreground">Five minutes from Cathedral Square, the Bus Interchange and Hagley Park. Free parking while you complete paperwork.</p>
            <Link to="/central-christchurch-car-hire" className="mt-5 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary">
              City branch details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="bg-background p-8 border border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Plane className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-widest">Airport service</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Christchurch Airport (CHC)</h2>
            <p className="text-muted-foreground">Meet-and-greet at Christchurch Airport arrivals — no long shuttle rides, no queues at the terminal desks.</p>
            <Link to="/airport/christchurch" className="mt-5 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary">
              Airport pickup details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          { icon: Car, t: 'Modern local fleet', d: 'Late-model automatic cars and SUVs serviced in Christchurch — reversing cameras, Bluetooth and full safety packs across the range.' },
          { icon: Route, t: 'Built for the South Island', d: 'From Arthur\'s Pass to the Lindis, our vehicles are chosen for real Canterbury roads — not just city loops.' },
          { icon: Snowflake, t: 'Ski-ready in winter', d: 'AWD SUVs, ski racks and chain hire for Mt Hutt, Porters, Cheeseman and Broken River.' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="p-6 border border-border rounded-2xl">
            <Icon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-serif text-xl mb-2">{t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </section>

      {/* Fleet zigzag */}
      <section className="container mx-auto px-6 py-16 md:py-24 border-t border-border">
        <div className="max-w-2xl mb-16">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">The Christchurch fleet</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">Four cars. Every Canterbury trip covered.</h2>
        </div>
        <div className="space-y-24">
          {cars.map((c, idx) => (
            <article key={c.no} className={`grid md:grid-cols-12 gap-10 items-center ${idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''}`}>
              <div className="md:col-span-7">
                <img src={c.img} alt={`${c.name} available for Christchurch car hire`} className="w-full aspect-[4/3] object-cover rounded-2xl" loading="lazy" />
              </div>
              <div className="md:col-span-5">
                <span className="font-serif text-5xl text-primary">{c.no}</span>
                <h3 className="font-serif text-3xl mt-4">{c.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{c.spec}</p>
                <p className="mt-5 text-muted-foreground leading-relaxed">{c.blurb}</p>
                <Link to={c.slug} className="mt-6 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
                  View details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Local editorial */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative md:order-first">
            <img src={coastal} alt="Rental car on a Canterbury coastal road near Christchurch" className="w-full aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Local knowledge</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">Driving out of Christchurch.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Christchurch sits at the crossroads of the South Island. In an hour you can be on the Banks Peninsula, in the vineyards of Waipara or climbing towards Arthur's Pass. Two hours south the road opens onto the Canterbury Plains and the run to Tekapo and Queenstown. Whatever the trip, we\'ll size the car to it — a compact for the CBD, a midsize for the wineries, an AWD for the mountains.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                { label: 'Weekend to Akaroa & Banks Peninsula', to: '/car-hire-christchurch' },
                { label: 'Ski runs to Mt Hutt, Porters & Cheeseman', to: '/fleet/cars/premium-awd-suv' },
                { label: 'One-way Christchurch → Queenstown', to: '/one-way-car-hire' },
                { label: 'Hanmer Springs, Kaikōura & Waipara', to: '/car-hire-christchurch' },
                { label: 'Christchurch Airport pickups', to: '/airport/christchurch' },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between py-4 text-sm md:text-base">
                  <Link to={row.to} className="hover:text-primary">{row.label}</Link>
                  <MapPin className="h-4 w-4 text-primary shrink-0 ml-4" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related hire */}
      <section className="container mx-auto px-6 py-16 border-t border-border">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Also from Christchurch</p>
        <h2 className="font-serif text-3xl md:text-4xl mb-8">Van and truck hire from the same team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { to: '/central-christchurch-van-hire', label: 'Christchurch Van Hire', d: 'Cargo vans for moves, deliveries and courier work.' },
            { to: '/central-christchurch-truck-hire', label: 'Christchurch Truck Hire', d: '2-tonne and 3-tonne moving trucks with tail-lift options.' },
            { to: '/one-way-car-hire', label: 'One-Way Car Hire NZ', d: 'Drive Christchurch → Queenstown, Nelson, Picton or the North Island.' },
          ].map((r) => (
            <Link key={r.to} to={r.to} className="p-6 border border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="font-serif text-xl">{r.label}</div>
              <p className="text-sm text-muted-foreground mt-2">{r.d}</p>
              <ArrowRight className="h-4 w-4 text-primary mt-3" />
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="container mx-auto px-6 py-20 md:py-28 text-center max-w-4xl">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">Rated 4.8 / 5 across 1,200+ reviews</p>
        <blockquote className="font-serif text-3xl md:text-4xl leading-snug">
          "Best-value car hire in Christchurch we\'ve found. Picked up in the city, dropped at the airport a week later, no drama. The AWD handled the Lewis Pass in the wet perfectly."
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">— Recent customer, Fendalton</p>
      </section>

      {/* Booking */}
      <section id="booking-form" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Reserve</p>
            <h2 className="font-serif text-4xl md:text-5xl">Book your Christchurch car</h2>
            <p className="mt-4 text-muted-foreground">Live availability across the economy, midsize, SUV and AWD fleet.</p>
          </div>
          <SearchForm defaultPickupLocation="14" defaultDropoffLocation="14" />
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Questions</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Car hire Christchurch FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {faqJsonLd.mainEntity.map((q) => (
            <div key={q.name} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-serif text-xl">{q.name}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{q.acceptedAnswer.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};

export default ChristchurchCarHire;