import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TruckQuoteSearchForm from '@/components/home/TruckQuoteSearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import truckOpenDoors from '@/assets/truck-open-doors-loading-boxes.jpg';
import familyUnpacking from '@/assets/family-unpacking-moving-truck.jpg';
import coupleMoving from '@/assets/couple-moving-boxes-truck.jpg';

const trucks = [
  {
    no: '01',
    name: '2 Tonne Box · 12m³',
    slug: '/fleet/trucks/2-tonne-box-12m3',
    img: '/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png',
    blurb:
      'A right-sized mover for apartments, single bedrooms and furniture pickups around Hamilton East, Chartwell and Rototuna. Automatic, car-license friendly.',
    spec: '3100 × 1750 × 2050 mm · Auto',
  },
  {
    no: '02',
    name: '2 Tonne Box · 12m³ + Tail Lift',
    slug: '/fleet/trucks/2-tonne-box-12m3-tail',
    img: '/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png',
    blurb:
      'The same easy-to-drive truck with a 400 kg hydraulic tail lift — ideal for whiteware, gym gear and heavy furniture from Hamilton homes and stores.',
    spec: '12 m³ · 400 kg tail lift',
  },
  {
    no: '03',
    name: '2 Tonne Box · 16m³',
    slug: '/fleet/trucks/2-tonne-box-16m3',
    img: '/lovable-uploads/a00bb0d9-fccc-4d69-a9ab-28d894f74538.png',
    blurb:
      'Built for a full two-to-three bedroom move. Air-con, generous floor space and enough room to clear the Waikato in one trip.',
    spec: '3800 × 2000 × 2000 mm · Auto',
  },
  {
    no: '04',
    name: '3 Tonne Box · 19m³ + Tail Lift',
    slug: '/fleet/trucks/3-tonne-box-19m3',
    img: '/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png',
    blurb:
      'Our largest mover. Family homes, country relocations and commercial moves from Hamilton to Auckland, Tauranga or Wellington — all in a single load.',
    spec: '4800 × 2100 × 2100 mm · Class 2',
  },
];

const HamiltonTruckRentals = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I need a special licence to hire a truck in Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard New Zealand car (Class 1) licence is enough for all of our 2-tonne trucks. A Class 2 (HT) licence is required for the 3-tonne truck.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to rent a truck in Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Truck hire in Hamilton starts from $35 per hour plus a per-kilometre charge. Daily rates are available for longer Waikato or out-of-region moves.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I pick up my Hamilton truck rental?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Trucks are collected from our Hamilton branch, with easy access to State Highway 1 and State Highway 3 for moves across the Waikato.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I take a James Blond truck out of Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. One-way and long-distance moves between Hamilton, Auckland, Tauranga and Wellington are available on request when booking.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Truck Hire Hamilton | Moving Trucks from $35/hr | James Blond"
        description="Affordable truck hire in Hamilton for house moves, furniture pickups and business deliveries. 2-tonne and 3-tonne trucks with optional tail lifts."
        canonical="/truck-hire-hamilton"
      />
      <JsonLd data={faqJsonLd} />

      {/* Editorial Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Hamilton · Waikato
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Truck hire in Hamilton,
                <span className="italic text-primary"> made simple.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                Moving across town or out to the coast? James Blond gives the Waikato a quietly
                excellent fleet of moving trucks — booked online, picked up in minutes,
                priced by the hour.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button asChild size="lg" className="rounded-full px-7">
                  <a href="#booking">Check availability</a>
                </Button>
                <a
                  href="tel:+6478384955"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                >
                  <Phone className="h-4 w-4" /> Call our Hamilton branch
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <img
                  src={truckOpenDoors}
                  alt="Moving truck loaded with boxes in Hamilton"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="font-serif text-2xl">$35 / hour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered intro lines */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'Local Hamilton fleet', d: 'Trucks staged in the Waikato, ready when you need one.' },
            { n: '02', t: 'Pay by the hour', d: 'Hourly rates from $35/hr plus kilometres — no padded day rates.' },
            { n: '03', t: 'Drive on a car licence', d: '2-tonne trucks are automatic and Class 1 friendly.' },
          ].map((row, i) => (
            <div
              key={row.n}
              className={`flex gap-6 py-6 md:py-2 ${i > 0 ? 'md:border-l md:pl-10 border-border' : ''}`}
            >
              <span className="font-serif text-3xl text-primary leading-none">{row.n}</span>
              <div>
                <h2 className="text-base font-semibold">{row.t}</h2>
                <p className="text-sm text-muted-foreground mt-1">{row.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zig-zag editorial fleet */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">The fleet</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Four trucks. Every Hamilton move covered.
          </h2>
        </div>

        <div className="space-y-24">
          {trucks.map((t, idx) => (
            <article
              key={t.no}
              className={`grid md:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div className="md:col-span-7">
                <img
                  src={t.img}
                  alt={`${t.name} truck for Hamilton hire`}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="md:col-span-5">
                <span className="font-serif text-5xl text-primary">{t.no}</span>
                <h3 className="font-serif text-3xl mt-4">{t.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {t.spec}
                </p>
                <p className="mt-5 text-muted-foreground leading-relaxed">{t.blurb}</p>
                <Link
                  to={t.slug}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
                >
                  View details <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={`?truck=${t.slug.replace('/fleet/trucks/', '')}#booking`}
                  className="mt-6 ml-6 inline-flex items-center gap-2 text-sm font-medium text-primary border-b border-primary pb-1 hover:opacity-80 transition-opacity"
                >
                  Book now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Editorial split: why Hamilton */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={familyUnpacking}
              alt="Family unpacking moving truck after a Hamilton move"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Built for the Waikato
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              From Frankton to Cambridge — without the fuss.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Hamilton’s flat streets, long arterials and quick motorway runs to Auckland or
              Tauranga make it one of the easiest cities in the country to move in. We pair
              that with friendly counter staff, a clean fleet and prices that don’t need a
              calculator.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'House moves across Hamilton East, West, Rototuna and Flagstaff',
                'Furniture pickups from The Base, Te Rapa and Chartwell',
                'One-way moves to Auckland, Tauranga and Wellington on request',
                'Trade and courier-friendly weekly hire',
              ].map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm md:text-base"
                >
                  <span>{row}</span>
                  <MapPin className="h-4 w-4 text-primary shrink-0 ml-4" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
          What movers tell us
        </p>
        <blockquote className="font-serif text-3xl md:text-4xl leading-snug">
          “Easiest truck hire we’ve done in Hamilton. Online booking, friendly counter,
          and the tail lift saved our backs.”
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
          — Recent customer, Rototuna
        </p>
      </section>

      {/* Tips, editorial column */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Field notes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Smart moves for a Hamilton move day.
          </h2>
          <img
            src={coupleMoving}
            alt="Couple loading rental truck for Hamilton home move"
            className="mt-8 w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Book midweek when you can', 'Weekends and month-end are the busiest windows across the Waikato — Tuesday to Thursday moves give you the widest pick.'],
            ['Load heavy first, low and forward', 'Whiteware, drawers and the washing machine go in first against the cab wall. Light boxes ride up top.'],
            ['Add a hand trolley', 'A $15 trolley pays for itself the first time you skip carrying a fridge up a Hamilton driveway.'],
            ['Return with the same fuel', 'Snap a photo of the gauge on pickup. Hamilton has Mobil, Z and BP within a few minutes of our branch.'],
          ].map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[auto_1fr] gap-6 border-t border-border pt-8 first:border-t-0 first:pt-0">
              <span className="font-serif text-3xl text-primary leading-none">0{i + 1}</span>
              <div>
                <h3 className="font-serif text-2xl">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Booking */}
      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Reserve
            </p>
            <h2 className="font-serif text-4xl md:text-5xl">Book your Hamilton truck</h2>
            <p className="mt-4 text-muted-foreground">
              Check live availability and lock in a price in under a minute.
            </p>
          </div>
          <TruckQuoteSearchForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Questions
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Truck hire Hamilton FAQ</h2>
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

export default HamiltonTruckRentals;