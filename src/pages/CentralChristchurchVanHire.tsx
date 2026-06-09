import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import vanHero from '@/assets/cargo-van-interior-south-auckland.jpg';
import vanFleet from '@/assets/south-auckland-cargo-van-fleet.jpg';
import vanSkyline from '@/assets/cargo-van-south-auckland-skyline.jpg';

const vans = [
  {
    no: '01',
    name: 'Standard Cargo Van',
    slug: '/fleet/vans/standard-van',
    img: '/lovable-uploads/2c63bb8e-da27-4b78-87cd-9fbf28e2bf45.png',
    blurb:
      'The everyday courier and trade van. Walk-through cab, sliding side door and a load space that swallows pallets, ladders and a weekend worth of gear.',
    spec: '6 m³ · Auto · Car licence',
  },
  {
    no: '02',
    name: 'Standard Rear-Seat Van',
    slug: '/fleet/vans/standard-rear-seat-van',
    img: '/lovable-uploads/91ac2db0-3ab4-4f10-8a09-1f7935cd0a51.png',
    blurb:
      'A crew-cab style van for sports teams, building crews and family runs. Five seats up front and a tidy load bay out back.',
    spec: '5 seats · 4 m³ · Auto',
  },
  {
    no: '03',
    name: 'Premium Van',
    slug: '/fleet/vans/premium-van',
    img: '/lovable-uploads/0a93b9d6-9a4d-465f-8d2e-e76d3cf90ee4.png',
    blurb:
      'A late-model long-wheelbase van for the longer Canterbury runs — quiet, comfortable and full of clever cabin storage.',
    spec: '8 m³ · Auto · Reversing camera',
  },
  {
    no: '04',
    name: 'Jumbo Van',
    slug: '/fleet/vans/jumbo-van',
    img: '/lovable-uploads/5a3d3b21-6e1c-44e9-a05c-2ed12be7e3e8.png',
    blurb:
      'High roof, long wheelbase, stand-up cargo bay. Perfect for studio moves, exhibition kit and full-load courier runs from the CBD.',
    spec: '12 m³ · Auto · Stand-up cargo',
  },
];

const CentralChristchurchVanHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where do I pick up my central Christchurch van rental?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pick-up is from our central branch at 515 Moorhouse Avenue, Waltham — five minutes from the CBD and right on the Brougham Street arterial.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I drive a van on a normal car licence in Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All of our cargo vans are automatic and can be driven on a standard New Zealand Class 1 car licence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer weekly van hire for couriers and trades?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We offer discounted weekly and monthly van rates for couriers, tradespeople and small businesses operating out of central Christchurch.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does van hire cost in central Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cargo van hire from our Moorhouse Avenue branch starts from $79 per day for short hires, with cheaper weekly and monthly rates available.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Central Christchurch Van Hire | Cargo Vans from $79/day | James Blond"
        description="Cargo van hire in central Christchurch from 515 Moorhouse Avenue. Standard, premium and jumbo vans for moves, trades and couriers."
        canonical="/central-christchurch-van-hire"
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
                Van hire in central Christchurch,
                <span className="italic text-primary"> built for the day.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                Whether it's a one-off furniture run or a five-day courier contract, our
                Moorhouse Avenue branch keeps a tidy line-up of cargo vans waiting —
                automatic, easy to drive, and priced honestly.
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
                  src={vanHero}
                  alt="Cargo van interior in central Christchurch"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="font-serif text-2xl">$79 / day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'CBD-adjacent pickup', d: '515 Moorhouse Avenue — five minutes from Cathedral Square and the Bus Interchange.' },
            { n: '02', t: 'Daily, weekly, monthly', d: 'Flexible hire windows for one-off moves, courier contracts and trade fit-outs.' },
            { n: '03', t: 'Automatic, car licence', d: 'Every van is automatic — drive away on your standard Class 1 licence.' },
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
            Four vans. Every central Christchurch job covered.
          </h2>
        </div>

        <div className="space-y-24">
          {vans.map((v, idx) => (
            <article
              key={v.no}
              className={`grid md:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div className="md:col-span-7">
                <img
                  src={v.img}
                  alt={`${v.name} for central Christchurch hire`}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="md:col-span-5">
                <span className="font-serif text-5xl text-primary">{v.no}</span>
                <h3 className="font-serif text-3xl mt-4">{v.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {v.spec}
                </p>
                <p className="mt-5 text-muted-foreground leading-relaxed">{v.blurb}</p>
                <Link
                  to={v.slug}
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
              src={vanFleet}
              alt="Cargo van fleet at central Christchurch branch"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Made for the inner city
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              From Riccarton to Lyttelton — without the headache.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Christchurch's wide one-way streets and easy motorway access make van work
              a pleasure. We keep our fleet new, clean and serviced — so the only thing
              you have to think about is the load in the back.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'Furniture pickups from Riccarton, Addington and Sydenham',
                'Trade and fit-out runs across the CBD and Christchurch East',
                'Daily courier hire for South Island contracts',
                'Weekly and monthly business rates available',
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
          "Booked online, picked up in ten minutes, on the road. The Moorhouse Ave team
          had the van warm and ready before I'd signed the paperwork."
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
          — Recent customer, Sydenham
        </p>
      </section>

      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Field notes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Get more out of your van day.
          </h2>
          <img
            src={vanSkyline}
            alt="Cargo van against Christchurch skyline"
            className="mt-8 w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Match the van to the load', 'A standard van is enough for most furniture runs; only step up to the jumbo when you genuinely need the height.'],
            ['Plan your CBD route', 'Some inner-city streets are still one-way after the rebuild — Google Maps gets it right, hand-drawn memory does not.'],
            ['Strap, don\'t stack', 'A $5 ratchet strap stops a fridge falling on a TV faster than any amount of clever stacking.'],
            ['Lock in a weekly rate', 'If you\'re running a courier or trade contract, our weekly hire works out roughly half the daily rate.'],
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
            <h2 className="font-serif text-4xl md:text-5xl">Book your Christchurch van</h2>
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
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Central Christchurch van hire FAQ</h2>
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

export default CentralChristchurchVanHire;