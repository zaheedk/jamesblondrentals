import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Package, GraduationCap, Truck, MapPin, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import vanHero from '@/assets/cargo-van-south-auckland-skyline.jpg';
import vanInterior from '@/assets/cargo-van-interior-south-auckland.jpg';
import vanFleet from '@/assets/south-auckland-cargo-van-fleet.jpg';
import minibus from '@/assets/12-seater-van-auckland-sky-tower.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const PAGE_URL = `${SITE_URL}/van-hire-auckland`;

const vans = [
  {
    no: '01',
    name: 'Standard Cargo Van',
    slug: '/fleet/vans/standard-van',
    img: vanHero,
    blurb:
      'The everyday workhorse for Auckland trades, couriers and small moves around Ponsonby, Newmarket and Penrose. Easy car-licence drive, sliding side door and a flat cargo floor.',
    spec: '6–8 m³ · Auto · Car licence',
  },
  {
    no: '02',
    name: 'Standard Van · Rear Seat',
    slug: '/fleet/vans/standard-rear-seat-van',
    img: vanInterior,
    blurb:
      'Five seats up front and cargo behind — the smartest pick when the crew, the tools and a couple of pallets all need to travel together across Auckland.',
    spec: '5 seats + cargo · Auto',
  },
  {
    no: '03',
    name: 'Jumbo / Premium Van',
    slug: '/fleet/vans/jumbo-van',
    img: vanFleet,
    blurb:
      'Long-wheelbase, high-roof load space for the bigger Auckland jobs. A real alternative to a small truck when you still want a van that drives like a car.',
    spec: '10–12 m³ · Auto',
  },
  {
    no: '04',
    name: '12-Seat Minibus',
    slug: '/fleet/minibus/12-seat-minibus',
    img: minibus,
    blurb:
      'Sports teams, weddings, airport runs and day trips to Waiheke Ferry or Piha — twelve seats with belts, air-con and luggage space behind the back row.',
    spec: '12 seats · Auto',
  },
];

const relatedLinks = [
  { label: 'Cargo van hire Central Auckland', to: '/central-auckland-cargo-van-rentals-hire' },
  { label: 'Cargo van hire South Auckland', to: '/south-auckland-cargo-van-rentals-hire' },
  { label: 'Van hire West Auckland', to: '/west-auckland-van-hire' },
  { label: 'Cargo van hire Auckland Airport', to: '/auckland-airport-cargo-van-rentals-hire' },
  { label: '12-seater van hire Auckland', to: '/12-seater-van-hire-auckland' },
  { label: 'Auckland Airport minibus rentals', to: '/auckland-airport-minibus-rentals' },
  { label: 'Truck hire Auckland', to: '/auckland-truck-rentals-hire' },
  { label: 'Car hire Auckland', to: '/car-hire-auckland' },
  { label: 'Van hire Wellington', to: '/van-hire-wellington' },
  { label: 'Van hire Christchurch', to: '/van-hire-christchurch' },
];

const AucklandVanHireHub = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I need a special licence to hire a van in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Every van in our Auckland fleet — including the 12-seat minibus — is automatic and can be driven on a standard New Zealand car (Class 1) licence.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does van hire cost in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Auckland van hire starts from around $69 per day plus kilometres for a cargo van. Multi-day, weekly and midweek rates lower the daily price further — check the hot deals page for current discounts.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do I pick up my Auckland van?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vans can be picked up from our Central Auckland, South Auckland, West Auckland and Auckland Airport branches — pick the closest at booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I hire a van for a one-way move out of Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. One-way van hire from Auckland to Hamilton, Wellington, Christchurch and other James Blond branches is available on request when booking online or by phone.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best van hire company in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'James Blond Rentals is consistently rated among the top-rated and most affordable van hire companies in Auckland, with a modern fleet of cargo vans, jumbo vans and minibuses, transparent pricing, and no hidden fees.',
        },
      },
    ],
  };

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'James Blond Rentals — Auckland Van Hire',
    image: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
    url: PAGE_URL,
    telephone: '+64-9-3661-122',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Auckland',
      addressRegion: 'Auckland',
      addressCountry: 'NZ',
    },
    areaServed: ['Auckland', 'Central Auckland', 'South Auckland', 'West Auckland', 'North Shore', 'Auckland Airport'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1247',
    },
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Van Hire Auckland from $69/Day | Same-Day Pickup — James Blond"
        description="Van hire in Auckland from $69/day — cargo, jumbo and 12-seat vans. Same-day pickup at Penrose, Airport, South & West Auckland. Drive on a car licence. Book online."
        canonical="/van-hire-auckland"
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={localBusinessLd} />

      {/* Split-screen Hero */}
      <section className="grid md:grid-cols-2 min-h-[80vh]">
        <div className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)] flex flex-col justify-between p-8 md:p-16">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Auckland · New Zealand</span>
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-5 w-5" />
              <span className="text-lg font-semibold">Van Hire</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-10" />
            <h1 className="font-sans font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05]">
              Cargo Vans, Jumbo Vans &amp; 12-Seat Minibuses for Hire in Auckland
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button asChild size="lg" className="rounded-none px-7">
                <a href="#booking">Check availability</a>
              </Button>
              <a
                href="tel:+6493661122"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary"
              >
                <Phone className="h-4 w-4" /> Call our Auckland branch
              </a>
            </div>
          </div>
        </div>
        <div className="bg-[hsl(0_0%_18%)] flex items-center justify-center p-8 md:p-16">
          <div className="relative w-full max-w-md">
            <img
              src={vanHero}
              alt="Cargo van available for Auckland hire"
              className="w-full aspect-square object-cover rounded-3xl shadow-2xl"
              loading="eager"
            />
            <div className="absolute -bottom-5 -left-5 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-xl">
              <p className="text-[10px] uppercase tracking-widest opacity-80">From</p>
              <p className="font-extrabold text-2xl leading-none">$69 / day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered intro */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'Car-licence friendly', d: 'Every van is automatic — no special licence needed.' },
            { n: '02', t: 'Four Auckland pickup points', d: 'Central, South, West and Airport — collect from the closest.' },
            { n: '03', t: 'Daily or weekly hire', d: 'A van for the morning, the weekend or the whole month.' },
          ].map((row, i) => (
            <div
              key={row.n}
              className={`flex gap-6 py-6 md:py-2 ${i > 0 ? 'md:border-l md:pl-10 border-border' : ''}`}
            >
              <span className="font-sans font-extrabold text-3xl text-primary leading-none">{row.n}</span>
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
          <div className="flex items-center gap-3 mb-3">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">The Fleet</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
            One van for every Auckland job.
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
                  alt={`${v.name} for Auckland hire`}
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
              <div className="md:col-span-5">
                <span className="font-sans font-extrabold text-5xl text-primary">{v.no}</span>
                <h3 className="font-sans font-extrabold text-3xl mt-4 tracking-tight">{v.name}</h3>
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
      <section className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)]">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Built for Auckland</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-6" />
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
              Trades, teams and weekend movers — all welcome.
            </h2>
            <p className="mt-6 text-lg text-[hsl(0_0%_30%)]">
              Auckland is a city of working vans: tradies criss-crossing Penrose and East Tamaki,
              couriers hitting Sylvia Park, families picking up flat-packs from IKEA-bound Ponsonby
              flats, and minibuses heading north to Matakana or west to Piha. Our Auckland fleet is
              sized and priced for all of them.
            </p>
            <ul className="mt-10 divide-y divide-[hsl(0_0%_75%)] border-y border-[hsl(0_0%_75%)]">
              {[
                'Daily and weekly hire for trades and courier work',
                'Cargo vans for furniture, white-ware and small moves',
                'Jumbo vans when a small truck is just too much',
                '12-seat minibuses for sports teams, weddings and airport runs',
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
            <div className="bg-[hsl(0_0%_18%)] p-6 md:p-10 rounded-2xl">
              <img
                src={vanInterior}
                alt="Cargo van interior — Auckland van hire"
                className="w-full aspect-[5/6] object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Quote className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">From the counter</span>
        </div>
        <div className="h-px w-24 mx-auto bg-border mb-8" />
        <blockquote className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl leading-snug">
          “Clean vans, honest pricing and a real human at the desk. The way Auckland van hire
          should feel.”
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
          — Local trade customer
        </p>
      </section>

      {/* Use cases / field notes */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">Picking a van</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl leading-[1.05]">
            Match the van to the day.
          </h2>
          <img
            src={vanFleet}
            alt="Auckland van fleet ready to hire"
            className="mt-8 w-full aspect-[4/5] object-cover rounded-2xl"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Couriers & trades', 'Stick with the Standard Cargo Van — light, nimble, and the cheapest per day.'],
            ['Flat-pack runs across Auckland', 'Step up to a Jumbo Van so the boxes fit flat with the side door closed.'],
            ['House moves under a bedroom', 'Pair a Jumbo Van with a hand trolley and you’ll likely skip the truck altogether.'],
            ['Team trips and airport runs', 'The 12-seat minibus drives like a van, fits the team, and still has boot space behind row four.'],
          ].map(([t, d], i) => (
            <li
              key={t}
              className="grid grid-cols-[auto_1fr] gap-6 border-t border-border pt-8 first:border-t-0 first:pt-0"
            >
              <span className="font-sans font-extrabold text-3xl text-primary leading-none">0{i + 1}</span>
              <div>
                <h3 className="font-sans font-extrabold text-2xl tracking-tight">{t}</h3>
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
            <div className="flex items-center justify-center gap-3 mb-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Reserve</span>
            </div>
            <div className="h-px w-24 mx-auto bg-border mb-6" />
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl">Book your Auckland van</h2>
            <p className="mt-4 text-muted-foreground">
              Live availability across our cargo vans, jumbo vans and minibus.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">Questions</span>
        </div>
        <div className="h-px w-full bg-border mb-8" />
        <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl mb-10">Van hire Auckland FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {faqJsonLd.mainEntity.map((q) => (
            <div key={q.name} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-sans font-bold text-xl tracking-tight">{q.name}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{q.acceptedAnswer.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related Auckland van hire */}
      <section className="border-t border-border bg-[hsl(0_0%_18%)] text-[hsl(0_0%_92%)]">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mb-10">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Explore by suburb &amp; vehicle</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_30%)] mb-6" />
            <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl">
              Van hire across Auckland &amp; New Zealand
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="flex items-center justify-between gap-3 border-b border-[hsl(0_0%_30%)] py-3 hover:text-primary transition-colors"
                >
                  <span className="text-sm md:text-base">{l.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AucklandVanHireHub;