import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import carHero from '@/assets/auckland-car-rental-coastal-road.jpg';
import familySuv from '@/assets/auckland-7-seater-suv-family.jpg';
import ecoHybrid from '@/assets/eco-hybrid-car-nz-landscape.jpg';

const cars = [
  {
    no: '01',
    name: 'Premium Economy',
    slug: '/fleet/cars/premium-economy',
    from: '$49',
    blurb:
      'A late-model hatch for commuting into the city, school runs and errands around New Lynn and Henderson. Easy to park, light on fuel.',
    spec: '4 doors · 5 seats · Auto',
  },
  {
    no: '02',
    name: 'Premium Midsize',
    slug: '/fleet/cars/premium-midsize',
    from: '$59',
    blurb:
      'A comfortable sedan for business trips and longer drives out of West Auckland — boot space for two large cases.',
    spec: '4 doors · 5 seats · Auto',
  },
  {
    no: '03',
    name: 'Premium Compact SUV',
    slug: '/fleet/cars/premium-compact-suv',
    from: '$79',
    blurb:
      'A higher ride for the Waitākere hills, Piha and Muriwai weekends, with room for boards, bikes and beach gear.',
    spec: '5 doors · 5 seats · Auto',
  },
  {
    no: '04',
    name: 'Premium 7-Seat SUV',
    slug: '/fleet/cars/premium-seven-seat-suv',
    from: 'On request',
    blurb:
      'Three rows for family visits, airport pickups and weekends away with the extended whānau.',
    spec: '5 doors · 7 seats · Auto',
  },
];

const suburbs = [
  ['Glen Eden', 'Our branch suburb — walk-in pickups and after-hours key return.'],
  ['Kelston', 'Five minutes up Great North Road from the branch.'],
  ['New Lynn', 'Ten minutes away, easy from the train and bus interchange.'],
  ['Titirangi', 'Handy for Waitākere Ranges and Piha weekends.'],
  ['Henderson', 'Close by for business hires and West Auckland trades.'],
  ['Avondale', 'Straight down New North Road, minutes from the branch.'],
];

const WestAucklandCarHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is your West Auckland car hire branch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our West Auckland branch is in Glen Eden, minutes from Kelston, New Lynn, Titirangi, Henderson and Avondale. Call 0800 525 663 for directions or after-hours arrangements.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does car hire in West Auckland cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Car hire starts from $49 per day for a premium economy car, around $59 for a midsize and from $79 for a compact SUV. The booking form shows live pricing for your exact dates.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I pick up in West Auckland and drop off at Auckland Airport?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We have an Auckland Airport branch in Māngere, so a Glen Eden pickup with an airport drop-off can be arranged when you book.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the minimum age to hire a car?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Drivers must be 21 or older with at least 12 months of full licence experience. Drivers aged 21–24 may incur a young driver surcharge.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you hire vans and trucks from the same branch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Cargo vans, jumbo vans, utes, trailers and moving trucks are all available from West Auckland alongside the car fleet.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="West Auckland Car Hire from $49/Day | Glen Eden | James Blond"
        description="Car hire in West Auckland from our Glen Eden branch — economy cars, SUVs and 7-seaters for Kelston, New Lynn, Titirangi, Henderson and Avondale. From $49/day."
        canonical="/west-auckland-car-hire"
      />
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                West Auckland · Glen Eden branch
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Car hire in West Auckland,
                <span className="italic text-primary"> close to home.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                A local branch instead of an airport queue. Late-model cars and SUVs from
                Glen Eden, minutes from Kelston, New Lynn, Titirangi, Henderson and
                Avondale — booked online, ready when you arrive.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                Also from this branch:{' '}
                <Link to="/west-auckland-van-hire" className="underline hover:text-primary">van hire</Link>
                {' '}and{' '}
                <Link to="/west-auckland-truck-rentals-hire" className="underline hover:text-primary">truck hire</Link>.
              </p>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Want every Auckland option?{' '}
                <Link to="/car-hire-auckland" className="underline hover:text-primary font-medium">View the Auckland car hire hub</Link>
                {' '}or{' '}
                <Link to="/long-term-car-hire-auckland" className="underline hover:text-primary font-medium">long-term car hire</Link>.
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
                  alt="Rental car on an Auckland coastal road"
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
            { n: '01', t: 'Local pickup', d: 'Glen Eden branch — no airport shuttle, no queue, staff who know the area.' },
            { n: '02', t: 'Late-model fleet', d: 'Recent-model cars and SUVs with reversing cameras, Bluetooth and full safety packs.' },
            { n: '03', t: 'Airport drop-off', d: 'Pick up in the west, drop at our Māngere branch on the way out — arrange at booking.' },
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
        <div className="max-w-2xl mb-14">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">The fleet</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Four cars. Every West Auckland trip covered.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {cars.map((c) => (
            <article key={c.no} className="border-t border-border pt-8">
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="font-serif text-3xl">{c.name}</h3>
                <span className="text-sm font-medium text-primary whitespace-nowrap">
                  {c.from === 'On request' ? 'On request' : `from ${c.from}/day`}
                </span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{c.spec}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{c.blurb}</p>
              <Link
                to={c.slug}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                View details <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Suburbs we serve
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              One branch, the whole west.
            </h2>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {suburbs.map(([name, note]) => (
                <li key={name} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-medium">{name}</span>
                    <p className="text-sm text-muted-foreground mt-1">{note}</p>
                  </div>
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img
              src={familySuv}
              alt="Family loading a 7-seater SUV rental in Auckland"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Cheaper hires
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            How to pay less for a car in West Auckland.
          </h2>
          <img
            src={ecoHybrid}
            alt="Fuel-efficient rental car in the New Zealand landscape"
            className="mt-8 w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Book a local branch, not the airport', 'Airport pickups carry premium location costs. Glen Eden is a short drive or bus ride from most of the west.'],
            ['Pick up Monday to Thursday', 'Midweek is our quietest stretch, so rates are at their lowest — the booking form shows it instantly.'],
            ['Go a size down', 'A premium economy hatch handles the same city driving as a midsize for less per day.'],
            ['Hire by the week', 'Weekly rates work out lower per day than stacking single days — ask us for a weekly or longer quote.'],
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
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Reserve</p>
            <h2 className="font-serif text-4xl md:text-5xl">Book your West Auckland car</h2>
            <p className="mt-4 text-muted-foreground">
              Check live availability and lock in a price in under a minute.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Questions</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">West Auckland car hire FAQ</h2>
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

export default WestAucklandCarHire;
