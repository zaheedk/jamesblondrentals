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
      'A nimble mover for inner-city apartments, Sydenham units and furniture pickups around Addington and Riccarton. Automatic, car-licence friendly.',
    spec: '3100 × 1750 × 2050 mm · Auto',
  },
  {
    no: '02',
    name: '2 Tonne Box · 12m³ + Tail Lift',
    slug: '/fleet/trucks/2-tonne-box-12m3-tail',
    img: '/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png',
    blurb:
      'The same easy-to-drive truck with a 400 kg hydraulic tail lift — ideal for whiteware, gym gear and heavy furniture from central Christchurch homes and CBD retailers.',
    spec: '12 m³ · 400 kg tail lift',
  },
  {
    no: '03',
    name: '2 Tonne Box · 16m³',
    slug: '/fleet/trucks/2-tonne-box-16m3',
    img: '/lovable-uploads/a00bb0d9-fccc-4d69-a9ab-28d894f74538.png',
    blurb:
      'Built for a full two-to-three bedroom move from Merivale, St Albans or Beckenham — generous floor space and plenty of headroom.',
    spec: '3800 × 2000 × 2000 mm · Auto',
  },
  {
    no: '04',
    name: '3 Tonne Box · 19m³ + Tail Lift',
    slug: '/fleet/trucks/3-tonne-box-19m3',
    img: '/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png',
    blurb:
      'Our largest mover. Family homes in Fendalton and Cashmere, country relocations and commercial moves out to Rangiora, Rolleston or Ashburton in one load.',
    spec: '4800 × 2100 × 2100 mm · Class 2',
  },
];

const CentralChristchurchTruckHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is your central Christchurch truck hire branch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our central Christchurch branch is at 515 Moorhouse Avenue, Waltham — minutes from the CBD with easy access to Brougham Street and the southern motorway.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a special licence to hire a truck in Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard New Zealand car (Class 1) licence is enough for all of our 2-tonne trucks. A Class 2 (HT) licence is required for the 3-tonne truck.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does truck hire cost in central Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Truck hire from our central Christchurch branch starts from $35 per hour plus a per-kilometre charge. Daily and weekly rates are available for longer moves.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I take a James Blond truck out of Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. One-way and long-distance moves across Canterbury and the South Island are available on request when booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you also offer van and car hire from the same branch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We also have a range of cargo vans and passenger cars available for hire from 515 Moorhouse Avenue. Browse our central Christchurch van hire and car hire pages for details.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Central Christchurch Truck Hire | From $35/hr | James Blond"
        description="Truck hire in central Christchurch from 515 Moorhouse Avenue. 2-tonne and 3-tonne moving trucks with optional tail lifts. Book online from $35/hour."
        canonical="/central-christchurch-truck-hire"
        ogImage="https://jamesblond.co.nz/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png"
      />
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Central Christchurch · 515 Moorhouse Ave
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Truck hire in central Christchurch,
                <span className="italic text-primary"> done properly.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                Moving across the city or out to the Plains? Our Moorhouse Avenue branch
                keeps a quietly excellent fleet of trucks ready to go — booked online,
                picked up in minutes, priced by the hour.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                Also available from this branch:{' '}
                <Link to="/central-christchurch-van-hire" className="underline hover:text-primary">van hire</Link>
                {' '}and{' '}
                <Link to="/central-christchurch-car-hire" className="underline hover:text-primary">car hire</Link>.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button asChild size="lg" className="rounded-full px-7">
                  <a href="#booking">Check availability</a>
                </Button>
                <a
                  href="tel:0800525663"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                >
                  <Phone className="h-4 w-4" /> Call 0800 525 663
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <img
                  src={truckOpenDoors}
                  alt="Moving truck loaded with boxes in central Christchurch"
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

      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'Central CBD location', d: '515 Moorhouse Avenue — minutes from Cathedral Square and the Four Avenues.' },
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

      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">The fleet</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Four trucks. Every central Christchurch move covered.
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
                  alt={`${t.name} truck for central Christchurch hire`}
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

      <section className="bg-muted/40">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={familyUnpacking}
              alt="Family unpacking moving truck in central Christchurch"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Built for the inner city
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              From Sydenham to St Albans — without the fuss.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Christchurch's flat grid, wide one-way streets and quick motorway runs to
              Rolleston and Rangiora make it one of the easiest cities in the country to
              move in. We pair that with friendly counter staff, a clean fleet and prices
              that don't need a calculator.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'House moves across Addington, Sydenham, St Albans and Merivale',
                'Furniture pickups from The Colombo, Tannery and Riccarton',
                'One-way moves to Ashburton, Timaru and Dunedin on request',
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

      <section className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
          What movers tell us
        </p>
        <blockquote className="font-serif text-3xl md:text-4xl leading-snug">
          "Easiest truck hire we've done in Christchurch. Moorhouse Ave is two minutes
          off the motorway and the tail lift saved our backs."
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
          — Recent customer, Beckenham
        </p>
      </section>

      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Field notes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Smart moves for a Christchurch move day.
          </h2>
          <img
            src={coupleMoving}
            alt="Couple loading rental truck in central Christchurch"
            className="mt-8 w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Book midweek when you can', 'Weekends and month-end are busiest across Canterbury — Tuesday to Thursday moves give you the widest pick.'],
            ['Load heavy first, low and forward', 'Whiteware, drawers and the washing machine go in first against the cab wall. Light boxes ride up top.'],
            ['Add a hand trolley', 'A $15 trolley pays for itself the first time you skip carrying a fridge up a Cashmere driveway.'],
            ['Return with the same fuel', 'Snap a photo of the gauge on pickup. There are Z, BP and Mobil stations within minutes of Moorhouse Ave.'],
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

      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Reserve
            </p>
            <h2 className="font-serif text-4xl md:text-5xl">Book your Christchurch truck</h2>
            <p className="mt-4 text-muted-foreground">
              Check live availability and lock in a price in under a minute.
            </p>
          </div>
          <TruckQuoteSearchForm
            defaultPickupLocation="14"
            defaultDropoffLocation="14"
            defaultCarCategory="12"
          />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Questions
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Central Christchurch truck hire FAQ</h2>
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

export default CentralChristchurchTruckHire;