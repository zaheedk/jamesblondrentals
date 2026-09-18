import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Plane, MapPin, IdCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Helmet } from 'react-helmet-async';
import heroImg from '@/assets/locations/christchurch-airport.jpg';
import suvImg from '@/assets/awd-suv-nz-mountain-adventure.jpg';

const PAGE_URL = 'https://www.jamesblond.co.nz/car-rental-christchurch-airport';

const itineraries = [
  {
    no: '01',
    title: 'Christchurch → Lake Tekapo → Mount Cook',
    detail: '227 km to Tekapo (about 3 hours), then 105 km to Aoraki/Mount Cook Village. Sealed roads the whole way. Two nights is the comfortable minimum.',
    car: 'Compact or intermediate car',
  },
  {
    no: '02',
    title: 'Christchurch → Queenstown, one way',
    detail: '480 km, roughly 6 hours of driving, best split over 3–4 days via Tekapo, Twizel and the Lindis Pass. Drop the car in Queenstown instead of doubling back.',
    car: 'Intermediate car or SUV',
    to: '/one-way-car-hire',
    linkLabel: 'One-way hire options',
  },
  {
    no: '03',
    title: 'Christchurch → Kaikōura → Marlborough',
    detail: '183 km up the coast to Kaikōura (about 2.5 hours) for whale watching, then 130 km on to Blenheim wine country and the Picton ferry.',
    car: 'Any car — easy motorway and coastal driving',
  },
  {
    no: '04',
    title: 'Christchurch base, day trips only',
    detail: 'Akaroa 75 km, Hanmer Springs 135 km, Arthur’s Pass 155 km, Mt Hutt 100 km. Home each night, no packing and unpacking.',
    car: 'Economy hatch, or AWD in winter',
    to: '/car-hire-christchurch',
    linkLabel: 'Christchurch car hire range',
  },
];

const faqs = [
  {
    q: 'Where do I collect my rental car at Christchurch Airport?',
    a: "We are just outside the airport at 17/25 Logistics Drive, Harewood — about five minutes from the terminal. Once you have your bags, call 0800 525 663 and our shuttle collects you from the arrivals pickup area.",
  },
  {
    q: 'Can I drive in New Zealand on my Australian or overseas licence?',
    a: 'Yes. A full Australian licence is valid in New Zealand with no International Driving Permit needed. Other overseas licences are accepted if they are in English, or accompanied by an approved translation or an International Driving Permit. Bring the physical card — a licence on your phone is not accepted.',
  },
  {
    q: 'Do you meet late-evening and early-morning flights?',
    a: 'Yes, by arrangement. Tell us your flight number when you book and we will have the vehicle and shuttle ready, including outside standard hours.',
  },
  {
    q: 'Can I pick up at Christchurch Airport and drop off in Auckland or Queenstown?',
    a: 'Yes. One-way hires to Queenstown, Auckland and other branch cities are available. A relocation fee applies and depends on the route and time of year — ask when you book.',
  },
  {
    q: 'Is October to March a busy time to hire a car in Christchurch?',
    a: 'It is our peak season. October and November still have good availability, but mid-December through January books out early and a minimum hire length applies over the Christmas and New Year period. Book as soon as your flights are confirmed.',
  },
  {
    q: 'Are kilometres unlimited on a South Island road trip?',
    a: 'Yes — every car hire includes unlimited kilometres, so a Christchurch to Queenstown to West Coast loop costs no more in distance charges than a week of day trips.',
  },
  {
    q: 'What do I need to bring to collect the car?',
    a: "Your full driver's licence and a credit or debit card in the driver's name for the bond. Prepaid cards are not accepted. Minimum driver age is 21.",
  },
];

const CarRentalChristchurchAirport = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Car Rental Christchurch Airport | Free Shuttle | James Blond"
        description="Car rental at Christchurch Airport with free shuttle, unlimited kilometres and overseas licences accepted. South Island road trip cars, SUVs and one-way hires to Queenstown."
        canonical="/car-rental-christchurch-airport"
      />
      <Helmet>
        <link rel="alternate" hrefLang="en-nz" href={PAGE_URL} />
        <link rel="alternate" hrefLang="en-au" href="https://www.jamesblond.co.nz/car-hire-christchurch-airport-from-australia" />
        <link rel="alternate" hrefLang="x-default" href={PAGE_URL} />
      </Helmet>
      <JsonLd data={faqJsonLd} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AutoRental',
          name: 'James Blond Rentals — Christchurch Airport',
          url: PAGE_URL,
          telephone: '+64800525663',
          email: 'info@jamesblond.co.nz',
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '17/25 Logistics Drive, Harewood',
            addressLocality: 'Christchurch',
            postalCode: '8544',
            addressCountry: 'NZ',
          },
          geo: { '@type': 'GeoCoordinates', latitude: '-43.4841', longitude: '172.5358' },
          areaServed: [
            { '@type': 'City', name: 'Christchurch' },
            { '@type': 'Place', name: 'South Island, New Zealand' },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Christchurch Airport · Free shuttle
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Car rental at Christchurch Airport,
                <span className="italic text-primary"> ready when you land.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                Land, call us, and be on the road in about fifteen minutes. Unlimited
                kilometres, overseas licences accepted and one-way drop-offs to
                Queenstown or Auckland — the whole South Island from one counter.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button asChild variant="cta" size="lg">
                  <a href="#booking" className="inline-flex items-center gap-2">
                    Check availability <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <a href="tel:0800525663" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
                  <Phone className="h-4 w-4" /> Call 0800 525 663
                </a>
              </div>
              <p className="mt-6 text-sm text-muted-foreground max-w-xl">
                Flying in from Australia?{' '}
                <Link to="/car-hire-christchurch-airport-from-australia" className="underline hover:text-primary">
                  See our Australian traveller guide
                </Link>
                .
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <img
                  src={heroImg}
                  alt="Rental cars at Christchurch Airport, New Zealand"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Cars from</p>
                  <p className="font-serif text-2xl">$45 / day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          {[
            { icon: Plane, t: 'Free airport shuttle', d: 'Five minutes from the terminal to our Harewood depot, both directions.' },
            { icon: IdCard, t: 'Overseas licences OK', d: 'Australian and English-language licences accepted. No IDP needed for Australians.' },
            { icon: MapPin, t: 'Unlimited kilometres', d: 'Drive the full South Island loop with no distance charges.' },
            { icon: Clock, t: 'Late flights met', d: 'Early and after-hours pickups and returns by arrangement.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t}>
              <Icon className="h-5 w-5 text-primary mb-3" />
              <h2 className="text-base font-semibold">{t}</h2>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Arrival steps */}
      <section className="container mx-auto px-6 py-20 md:py-24">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">On arrival</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              From baggage claim to the driver's seat.
            </h2>
            <ol className="divide-y divide-border border-y border-border">
              {[
                'Clear customs and collect your bags at Christchurch International.',
                "Call 0800 525 663, or dial 'M1' on the airport freephone at the international arrivals exit.",
                'Wait at Domestic arrivals Door 1 or Door 2 — our shuttle is usually there within ten minutes.',
                'Five-minute drive to 17/25 Logistics Drive, Harewood. Licence and card at the counter.',
                'Paperwork, a quick walk-around, and you are away.',
              ].map((step, i) => (
                <li key={step} className="flex gap-5 py-4">
                  <span className="font-serif text-2xl text-primary leading-none">{i + 1}</span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-muted-foreground">
              Returning the car? Drop it at Harewood, and after a quick check we shuttle you
              straight to your terminal at no charge.{' '}
              <Link to="/airport/christchurch" className="underline hover:text-primary">
                Full pickup and drop-off detail
              </Link>
              .
            </p>
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Driving here</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              What visitors ask before they set off.
            </h2>
            <ul className="space-y-5 text-muted-foreground">
              <li><strong className="text-foreground">We drive on the left</strong> — the same as Australia, the UK, Japan and South Africa.</li>
              <li><strong className="text-foreground">Open roads are 100 km/h</strong>, towns 50 km/h, and rural roads are narrower and windier than the map distance suggests. Allow more time than your GPS estimate.</li>
              <li><strong className="text-foreground">One-lane bridges are common</strong> in the South Island — the larger arrow on the sign has right of way.</li>
              <li><strong className="text-foreground">Alpine passes in winter</strong> (Arthur's Pass, Lindis, ski roads) can require chains — an AWD SUV is the safer choice from June to September.</li>
              <li><strong className="text-foreground">Fuel up before the long gaps</strong>: between Twizel and Wanaka, and along the West Coast, stations are far apart.</li>
            </ul>
            <img
              src={suvImg}
              alt="AWD SUV on a South Island mountain road in New Zealand"
              className="mt-10 w-full aspect-[16/10] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mb-14">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Where people go</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Four South Island trips from the airport gate.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {itineraries.map((it) => (
              <article key={it.no} className="bg-background border border-border p-8">
                <span className="font-serif text-4xl text-primary">{it.no}</span>
                <h3 className="font-serif text-2xl mt-4">{it.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{it.detail}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{it.car}</p>
                {it.to && (
                  <Link
                    to={it.to}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
                  >
                    {it.linkLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Season */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">October to March</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Book early for the summer season.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">
            Christchurch is the busiest South Island gateway over summer, and our airport
            fleet is at its tightest from mid-December to the end of January. October and
            November are still comfortable, and midweek pickups give you the best choice of
            vehicle. Over Christmas and New Year a minimum hire length applies, so lock in
            your dates as soon as your flights are booked.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link to="/price-guide" className="underline hover:text-primary">Car and van rates</Link>
            <Link to="/car-hire-christchurch" className="underline hover:text-primary">Christchurch car hire</Link>
            <Link to="/van-hire-christchurch" className="underline hover:text-primary">Van hire Christchurch</Link>
            <Link to="/one-way-car-hire" className="underline hover:text-primary">One-way hire</Link>
            <Link to="/christchurch-minibus-hire" className="underline hover:text-primary">Minibus hire (quote on request)</Link>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Reserve</p>
            <h2 className="font-serif text-4xl md:text-5xl">Book your Christchurch Airport car</h2>
            <p className="mt-4 text-muted-foreground">Live availability and instant pricing.</p>
          </div>
          <SearchForm defaultPickupLocation="14" defaultDropoffLocation="14" />
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Questions</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Christchurch Airport car rental FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <div key={f.q} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-serif text-xl">{f.q}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          17/25 Logistics Drive, Harewood, Christchurch 8544 · <a href="tel:0800525663" className="underline hover:text-primary">0800 525 663</a>
        </div>
      </section>
    </div>
  );
};

export default CarRentalChristchurchAirport;
