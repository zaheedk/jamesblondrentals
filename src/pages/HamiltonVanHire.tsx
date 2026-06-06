import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import vanHero from '@/assets/cargo-van-south-auckland-skyline.jpg';
import vanInterior from '@/assets/cargo-van-interior-south-auckland.jpg';
import vanFleet from '@/assets/south-auckland-cargo-van-fleet.jpg';
import minibus from '@/assets/12-seater-van-auckland-sky-tower.jpg';

const vans = [
  {
    no: '01',
    name: 'Standard Cargo Van',
    slug: '/fleet/vans',
    img: vanHero,
    blurb:
      'The everyday workhorse for trades, couriers and small moves around Hamilton. Easy car-licence drive, sliding side door and a flat cargo floor.',
    spec: '6–8 m³ · Auto · Car licence',
  },
  {
    no: '02',
    name: 'Standard Van · Rear Seat',
    slug: '/fleet/vans',
    img: vanInterior,
    blurb:
      'Five seats up front and cargo behind — the smartest pick when the crew, the tools and a couple of pallets all need to travel together.',
    spec: '5 seats + cargo · Auto',
  },
  {
    no: '03',
    name: 'Jumbo / Premium Van',
    slug: '/fleet/vans',
    img: vanFleet,
    blurb:
      'Long-wheelbase, high-roof load space for the bigger jobs. A real alternative to a small truck when you still want a van that drives like a car.',
    spec: '10–12 m³ · Auto',
  },
  {
    no: '04',
    name: '12-Seat Minibus',
    slug: '/fleet/minibuses',
    img: minibus,
    blurb:
      'Sports teams, weddings, Hobbiton day trips and airport runs — twelve seats with belts, air-con and luggage space behind the back row.',
    spec: '12 seats · Auto',
  },
];

const HamiltonVanHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I need a special licence to hire a van in Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Every van in our Hamilton fleet — including the 12-seat minibus — is automatic and can be driven on a standard New Zealand car (Class 1) licence.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does van hire cost in Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hamilton van hire starts from around $69 per day plus kilometres for a cargo van. Multi-day and weekly rates lower the daily price further.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I hire a van for a one-way move out of Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. One-way van hire between Hamilton, Auckland, Tauranga and Wellington is available on request when booking online or by phone.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do I collect my Hamilton van?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vans are picked up from our Hamilton branch with easy access to State Highway 1 and State Highway 3 for trips across the Waikato.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Van Hire Hamilton | Cargo Vans & Minibuses | James Blond"
        description="Van hire in Hamilton for trades, couriers, moves and group travel. Standard cargo vans, jumbo vans and 12-seat minibuses — all on a car licence."
        canonical="/hamilton-van-hire"
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
                Van hire in Hamilton,
                <span className="italic text-primary"> on your terms.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                Cargo vans for trades and couriers, jumbo vans for the bigger jobs, and a
                12-seat minibus for the team — booked in a minute, collected from our
                Hamilton branch.
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
                  src={vanHero}
                  alt="Cargo van available for Hamilton hire"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="font-serif text-2xl">$69 / day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered intro */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'Car-licence friendly', d: 'Every van is automatic — no special licence needed.' },
            { n: '02', t: 'Hamilton-based fleet', d: 'Local vans, local people, no airport detours.' },
            { n: '03', t: 'Daily or weekly hire', d: 'A van for the morning, the weekend or the whole month.' },
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

      {/* Zigzag fleet */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">The fleet</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            One van for every Hamilton job.
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
                  alt={`${v.name} for Hamilton hire`}
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

      {/* Editorial split */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Built for the Waikato
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Trades, teams and weekend movers — all welcome.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Hamilton’s a city of working vans: tradies criss-crossing Te Rapa, couriers
              hitting The Base, families collecting flat-packs and minibuses heading to
              Hobbiton. Our fleet is sized and priced for all of them.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'Daily and weekly hire for trades and courier work',
                'Cargo vans for furniture, white-ware and small moves',
                'Jumbo vans when a small truck is just too much',
                '12-seat minibuses for sports teams, weddings and tours',
              ].map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm md:text-base"
                >
                  <span>{row}</span>
                  <Package className="h-4 w-4 text-primary shrink-0 ml-4" />
                </li>
              ))}
            </ul>
          </div>
          <div className="relative md:order-first">
            <img
              src={vanInterior}
              alt="Cargo van interior — Hamilton van hire"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
          From the counter
        </p>
        <blockquote className="font-serif text-3xl md:text-4xl leading-snug">
          “Clean vans, honest pricing and a real human at the desk. The way Hamilton van
          hire should feel.”
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
          — Local trade customer
        </p>
      </section>

      {/* Use cases / field notes */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Picking a van
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Match the van to the day.
          </h2>
          <img
            src={vanFleet}
            alt="Hamilton van fleet ready to hire"
            className="mt-8 w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Couriers & trades', 'Stick with the Standard Cargo Van — light, nimble, and the cheapest per day.'],
            ['Flat-pack runs from The Base', 'Step up to a Jumbo Van so the boxes fit flat with the side door closed.'],
            ['House moves under a bedroom', 'Pair a Jumbo Van with a hand trolley and you’ll likely skip the truck altogether.'],
            ['Team trips and airport runs', 'The 12-seat minibus drives like a van, fits the team, and still has boot space behind row four.'],
          ].map(([t, d], i) => (
            <li
              key={t}
              className="grid grid-cols-[auto_1fr] gap-6 border-t border-border pt-8 first:border-t-0 first:pt-0"
            >
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
            <h2 className="font-serif text-4xl md:text-5xl">Book your Hamilton van</h2>
            <p className="mt-4 text-muted-foreground">
              Live availability across our cargo vans, jumbo vans and minibus.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Questions
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Van hire Hamilton FAQ</h2>
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

export default HamiltonVanHire;