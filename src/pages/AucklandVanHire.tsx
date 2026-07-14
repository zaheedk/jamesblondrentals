import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import hero from '@/assets/12-seater-van-auckland-sky-tower.jpg';
import interior from '@/assets/12-seater-van-interior-auckland.jpg';
import group from '@/assets/wellington-12-seat-van-family-group.jpg';

const options = [
  {
    no: '01',
    name: '12-Seat Van · Toyota Hiace ZX',
    slug: '/fleet/minibus/12-seat-minibus',
    img: '/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png',
    blurb:
      'The proven Auckland workhorse — twelve full-height seats, cargo barrier behind the last row, and a tow bar for the luggage trailer. Auto and diesel.',
    spec: '12 seats · Auto · Diesel · Tow bar',
  },
  {
    no: '02',
    name: 'Premium 12-Seat · LDV Deliver 9',
    slug: '/fleet/minibus/premium-12-seat-minibus',
    img: 'https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw',
    blurb:
      'A step up for the long North Island run — quieter cabin, luxury trim, and generous headroom. The same twelve seats, more comfort per kilometre.',
    spec: '12 seats · Auto · Diesel · Bluetooth',
  },
  {
    no: '03',
    name: '10-Seat Van · Toyota Hiace ZL',
    slug: '/fleet/minibus/10-seat-minibus',
    img: '/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png',
    blurb:
      'When ten is the number — a lighter, more nimble minibus for smaller wedding parties, tour groups and school trips around Auckland.',
    spec: '10 seats · Auto · Petrol',
  },
];

const AucklandVanHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What licence do I need for a 12 seater van in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard New Zealand Class 1 car licence — or a valid overseas equivalent — is all you need. Every 12 seater in our Auckland fleet is set up as a Class 1 vehicle.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a 12 seater van cost to hire in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Daily rates for a 12-seat Toyota Hiace start from around $189, with cheaper weekend, weekly and multi-day rates. Ring 0800 525 663 for a live quote on your dates.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do I pick up the 12 seater in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pick-up is from our Penrose branch in central Auckland or our Auckland Airport branch in Mangere — whichever is closest. Both have easy motorway access.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I fit luggage for 12 people in the van?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Behind the last row of seats there is space for soft bags and day packs. For a full airport or ski-trip load with twelve people, hire a luggage trailer at pick-up — every 12 seater is fitted with a tow bar.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I pick the 12 seater van up at Auckland Airport?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our Auckland Airport branch in Mangere handles 12-seater van pickups with a free shuttle from both terminals — perfect for arriving sports teams, tour groups and family reunions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you also offer 10-seater or 8-seater vans in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — a 10-seat Toyota Hiace ZL and an 8-seat Toyota Estima are both available from our Auckland branches. See our full Auckland minibus hire page for details.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="12 Seater Van Hire Auckland | Toyota Hiace | James Blond"
        description="12 seater van hire in Auckland from Penrose and Auckland Airport. Toyota Hiace and LDV, automatic, car-licence, tow bar and unlimited kms."
        canonical="/12-seater-van-hire-auckland"
        ogImage="https://jamesblond.co.nz/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png"
      />
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Auckland · Penrose &amp; Airport
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                12 seater van hire in Auckland,
                <span className="italic text-primary"> on a car licence.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                One van, twelve adults, one bill. Our Auckland 12-seaters are the
                Toyota Hiace ZX and premium LDV Deliver 9 — automatic, diesel, tow-bar
                fitted and welcome anywhere on the North Island.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                See also:{' '}
                <Link to="/auckland-minibus-hire" className="underline hover:text-primary">Auckland minibus hire</Link>,{' '}
                <Link to="/van-hire-auckland" className="underline hover:text-primary">van hire Auckland</Link>{' '}
                and{' '}
                <Link to="/auckland-airport-minibus-rentals" className="underline hover:text-primary">Auckland Airport minibus</Link>.
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
                  src={hero}
                  alt="12 seater Toyota Hiace van for Auckland hire"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="font-serif text-2xl">$189 / day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'Class 1 car licence', d: 'Automatic — no manual gearbox, no P endorsement. Drive away on a standard NZ licence.' },
            { n: '02', t: 'Tow bar fitted', d: 'Add a luggage trailer at pick-up when twelve people and their bags all need to travel.' },
            { n: '03', t: 'Unlimited kms', d: 'Head to Coromandel, Rotorua, Taupo or the Bay of Islands — every kilometre is included.' },
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
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Your options</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Three 12-seat vans. Pick the one that fits.
          </h2>
        </div>

        <div className="space-y-24">
          {options.map((v, idx) => (
            <article
              key={v.no}
              className={`grid md:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div className="md:col-span-7">
                <img
                  src={v.img}
                  alt={`${v.name} — Auckland hire`}
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
              src={group}
              alt="Group loading a 12-seat van in Auckland"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              What twelve seats are good for
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              From airport pickups to wedding shuttles.
            </h2>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'Airport transfers between Auckland Airport and the CBD',
                'Wedding shuttles across Auckland, Waiheke and Matakana',
                'Sports-team travel to Hamilton, Tauranga and further north',
                'Corporate group and conference transport',
                'North Island tour groups — Auckland to Rotorua and beyond',
              ].map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm md:text-base"
                >
                  <span>{row}</span>
                  <Users className="h-4 w-4 text-primary shrink-0 ml-4" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Reserve
            </p>
            <h2 className="font-serif text-4xl md:text-5xl">Book your 12 seater</h2>
            <p className="mt-4 text-muted-foreground">
              Live availability and instant pricing from our Auckland branches.
            </p>
          </div>
          <SearchForm defaultCategoryName="Minibus" />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Questions
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">12 seater van hire Auckland FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {faqJsonLd.mainEntity.map((q) => (
            <div key={q.name} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-serif text-xl">{q.name}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{q.acceptedAnswer.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Penrose branch &amp; Auckland Airport branch — Auckland
        </div>
      </section>
    </div>
  );
};

export default AucklandVanHire;