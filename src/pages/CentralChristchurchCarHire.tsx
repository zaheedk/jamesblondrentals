import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import carHero from '@/assets/auckland-car-rental-coastal-road.jpg';
import suvMountain from '@/assets/awd-suv-nz-mountain-adventure.jpg';
import ecoHybrid from '@/assets/eco-hybrid-car-nz-landscape.jpg';

const cars = [
  {
    no: '01',
    name: 'Premium Economy',
    slug: '/fleet/cars/premium-economy',
    img: '/lovable-uploads/8d8b0a6f-91e1-4f8f-90b3-0a0b21b4d12c.png',
    blurb:
      'A late-model hatch for solo travellers and city errands. Easy to park on Colombo Street, gentle on fuel up to Akaroa.',
    spec: '4 doors · 5 seats · Auto',
  },
  {
    no: '02',
    name: 'Premium Midsize',
    slug: '/fleet/cars/premium-midsize',
    img: '/lovable-uploads/4e3a3b21-6e1c-44e9-a05c-2ed12be7e3e8.png',
    blurb:
      'A comfortable midsize sedan for couples and short business trips. Boot swallows two large cases and there\'s room to stretch out for the run to Tekapo.',
    spec: '4 doors · 5 seats · Auto',
  },
  {
    no: '03',
    name: 'Premium Compact SUV',
    slug: '/fleet/cars/premium-compact-suv',
    img: '/lovable-uploads/0b75b9d6-9a4d-465f-8d2e-e76d3cf90ee4.png',
    blurb:
      'A higher ride for the family weekend — easy to load, easy to park, and quietly capable from Sumner to Hanmer Springs.',
    spec: '5 doors · 5 seats · Auto',
  },
  {
    no: '04',
    name: 'Premium 7-Seat SUV',
    slug: '/fleet/cars/premium-seven-seat-suv',
    img: '/lovable-uploads/3a93b9d6-9a4d-465f-8d2e-e76d3cf90ee4.png',
    blurb:
      'Three rows, full luggage space and a turn of pace for family ski trips, wedding parties and South Island road trips.',
    spec: '5 doors · 7 seats · Auto',
  },
];

const CentralChristchurchCarHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is your central Christchurch car hire branch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our central Christchurch car hire branch is at 515 Moorhouse Avenue, Waltham — five minutes from Cathedral Square, the Bus Interchange and Hagley Park.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer one-way car hire from central Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. One-way rentals to Christchurch Airport, Queenstown, Dunedin and elsewhere in the South Island are available on request when booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the minimum age to hire a car in Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Drivers must be 21 or older with at least 12 months of full licence experience. Drivers aged 21–24 may incur a young driver surcharge.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is unlimited kilometres included?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most weekly rates include unlimited kilometres within the South Island. Daily rates include a generous distance allowance — confirm at booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you also offer van and truck hire from the same branch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We also have cargo vans and moving trucks available for hire from 515 Moorhouse Avenue. Browse our central Christchurch van hire and truck hire pages for details.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Central Christchurch Car Hire | From $49/day | James Blond"
        description="Car hire in central Christchurch from 515 Moorhouse Avenue. Economy, midsize, SUV and 7-seater rentals for city trips and South Island road trips."
        canonical="/central-christchurch-car-hire"
        ogImage="https://jamesblond.co.nz/lovable-uploads/8d8b0a6f-91e1-4f8f-90b3-0a0b21b4d12c.png"
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
                Car hire in central Christchurch,
                <span className="italic text-primary"> made effortless.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                From a weekend run to Akaroa to a fortnight tracing the West Coast, our
                Moorhouse Avenue branch keeps a quietly excellent line-up of late-model
                cars and SUVs — booked online, ready to drive.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                Also available from this branch:{' '}
                <Link to="/central-christchurch-van-hire" className="underline hover:text-primary">van hire</Link>
                {' '}and{' '}
                <Link to="/central-christchurch-truck-hire" className="underline hover:text-primary">truck hire</Link>.
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
                  src={carHero}
                  alt="Rental car on a Canterbury coastal road"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="font-serif text-2xl">$49 / day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'Inner-city pickup', d: '515 Moorhouse Avenue — minutes from Cathedral Square, the Tannery and Hagley Park.' },
            { n: '02', t: 'Late-model fleet', d: 'Recent-model cars and SUVs with reversing cameras, Bluetooth and full safety packs.' },
            { n: '03', t: 'One-way South Island', d: 'Drop in Queenstown, Dunedin or the airport — one-ways on request.' },
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
            Four cars. Every Canterbury trip covered.
          </h2>
        </div>

        <div className="space-y-24">
          {cars.map((c, idx) => (
            <article
              key={c.no}
              className={`grid md:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div className="md:col-span-7">
                <img
                  src={c.img}
                  alt={`${c.name} for central Christchurch car hire`}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="md:col-span-5">
                <span className="font-serif text-5xl text-primary">{c.no}</span>
                <h3 className="font-serif text-3xl mt-4">{c.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {c.spec}
                </p>
                <p className="mt-5 text-muted-foreground leading-relaxed">{c.blurb}</p>
                <Link
                  to={c.slug}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
                >
                  View details <ArrowRight className="h-4 w-4" />
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
              src={suvMountain}
              alt="AWD SUV rental at a Canterbury mountain pass"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Built for South Island roads
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              From Cathedral Square to Milford — without the fuss.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Christchurch is the gateway to some of the best driving on earth. We keep
              our cars serviced, our paperwork short and our counter staff friendly so
              you can spend less time at the desk and more time on the road.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'Weekend trips to Akaroa, Hanmer Springs and Kaikōura',
                'Ski-season hires to Mt Hutt, Porters and Methven',
                'One-way drives to Queenstown, Wānaka and Dunedin',
                'Business and corporate weekly rates',
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
          What drivers tell us
        </p>
        <blockquote className="font-serif text-3xl md:text-4xl leading-snug">
          "Picked up in town, dropped at the airport on the way home. Easiest South
          Island rental we've ever done — and the SUV handled Arthur's Pass beautifully."
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
          — Recent customer, Merivale
        </p>
      </section>

      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Field notes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Plan your Canterbury drive.
          </h2>
          <img
            src={ecoHybrid}
            alt="Hybrid rental car in the New Zealand landscape"
            className="mt-8 w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Book early in ski season', 'July through September fill up fast — lock in the SUV class as soon as you have dates.'],
            ['Pick the right size', 'A compact SUV is plenty for two with luggage; the 7-seater is the one for families and ski gear.'],
            ['Check the alpine forecast', 'Conditions over Arthur\'s Pass and the Lewis can change quickly — carry chains in winter.'],
            ['Add the airport drop-off', 'A one-way fee is usually cheaper than the parking and shuttle for a week-long trip.'],
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
            <h2 className="font-serif text-4xl md:text-5xl">Book your Christchurch car</h2>
            <p className="mt-4 text-muted-foreground">
              Check live availability and lock in a price in under a minute.
            </p>
          </div>
          <SearchForm
            defaultPickupLocation="14"
            defaultDropoffLocation="14"
          />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Questions
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Central Christchurch car hire FAQ</h2>
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

export default CentralChristchurchCarHire;