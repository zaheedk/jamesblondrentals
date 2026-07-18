import React from 'react';
import RelatedLocations from '@/components/RelatedLocations';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import minibusHero from '@/assets/12-seater-van-auckland-sky-tower.jpg';
import minibusInterior from '@/assets/12-seater-van-interior-auckland.jpg';
import minibusGroup from '@/assets/wellington-12-seat-van-family-group.jpg';

const buses = [
  {
    no: '01',
    name: 'Premium 12-Seat Minibus',
    slug: '/fleet/minibus/premium-12-seat-minibus',
    img: 'https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw',
    blurb:
      'Late-model LDV Deliver 9 with luxury interior, tow bar and air-con throughout. The most comfortable way to move twelve people around Canterbury.',
    spec: '12 seats · Auto · Diesel · Car licence',
  },
  {
    no: '02',
    name: '12-Seat Minibus',
    slug: '/fleet/minibus/12-seat-minibus',
    img: '/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png',
    blurb:
      'The proven Toyota Hiace ZX — full-height seats, cargo barrier and tow bar. The workhorse of Christchurch sports clubs, tour operators and church groups.',
    spec: '12 seats · Auto · Diesel',
  },
  {
    no: '03',
    name: '10-Seat Minibus',
    slug: '/fleet/minibus/10-seat-minibus',
    img: '/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png',
    blurb:
      'A Toyota Hiace ZL for the mid-size group — ten adults, luggage in the back, and the same easy car-licence drive. A favourite for wedding shuttles.',
    spec: '10 seats · Auto · Petrol',
  },
  {
    no: '04',
    name: '8-Seat Van',
    slug: '/fleet/minibus',
    img: '/lovable-uploads/959f182c-4210-4140-a46a-86ced485f4bd.png',
    blurb:
      'Toyota Estima — twin side doors, bluetooth and luxury trim. The quiet, refined pick for airport transfers and small group tours around Christchurch.',
    spec: '8 seats · Auto · Petrol',
  },
];

const ChristchurchMinibusHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I need a special licence to drive a 12-seater minibus in Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Every minibus in our Christchurch fleet is set up as a Class 1 vehicle — you can drive it on your standard New Zealand car licence, or a valid overseas equivalent.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do I collect the minibus in Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pick-up is from our central Christchurch branch at 515 Moorhouse Avenue — five minutes from the CBD, with easy motorway access south and free on-site parking.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does 12-seater minibus hire cost in Christchurch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Daily rates start from around $189 for a 12-seat minibus, with cheaper weekend, weekly and multi-day rates. Ring 0800 525 663 for a live quote — group and sports-club rates are available.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there space for luggage as well as 12 passengers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our 12-seat Hiace ZX has a cargo barrier behind the last row of seats keeping soft bags and day packs secure. For full luggage plus twelve passengers we recommend towing a luggage trailer — we can add one at pick-up.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I take the minibus to Queenstown, Wanaka or the West Coast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our minibuses come with unlimited kilometres and are welcome anywhere on the South Island. One-way hires between Christchurch and Queenstown are available on request.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Minibus Hire Christchurch | 10 & 12 Seater Vans | James Blond"
        description="12-seater and 10-seater minibus hire in Christchurch from 515 Moorhouse Avenue. Automatic, car-licence, tow bar, unlimited kms."
        canonical="/christchurch-minibus-hire"
        ogImage="https://jamesblond.co.nz/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png"
      />
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Christchurch · 515 Moorhouse Ave
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Minibus hire in Christchurch,
                <span className="italic text-primary"> for groups that go together.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                Twelve seats, one driver, one bill. Whether it's a wedding shuttle to
                Akaroa, a sports weekend to Timaru or a church trip to Hanmer, our
                Christchurch minibuses go on a car licence and come with unlimited kms.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                Also from this branch:{' '}
                <Link to="/van-hire-christchurch" className="underline hover:text-primary">van hire</Link>,{' '}
                <Link to="/12-seater-van-hire-christchurch" className="underline hover:text-primary">12-seater van hire</Link>{' '}
                and{' '}
                <Link to="/truck-hire-christchurch" className="underline hover:text-primary">truck hire</Link>.
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
                  src={minibusHero}
                  alt="12 seater minibus for hire in Christchurch"
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
            { n: '01', t: 'Car-licence, automatic', d: 'Every minibus is automatic and Class 1 — no special endorsement, no manual gearbox.' },
            { n: '02', t: '515 Moorhouse Ave pickup', d: 'Central Christchurch branch, five minutes from the CBD and on the Brougham arterial south.' },
            { n: '03', t: 'Unlimited South Island kms', d: 'Take it to Akaroa, Hanmer, Tekapo, Queenstown — every km included in the daily rate.' },
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
            Four minibuses. Every Christchurch group covered.
          </h2>
        </div>

        <div className="space-y-24">
          {buses.map((v, idx) => (
            <article
              key={v.no}
              className={`grid md:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div className="md:col-span-7">
                <img
                  src={v.img}
                  alt={`${v.name} for Christchurch hire`}
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
              src={minibusGroup}
              alt="Group boarding a 12-seat minibus in Christchurch"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Made for Canterbury groups
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Weddings, teams, tours — one vehicle, one driver.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              We keep a rotating line-up of minibuses in central Christchurch year-round,
              serviced and detailed between hires. Grab the keys on Moorhouse Avenue and
              you're on the motorway inside ten minutes.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'Wedding shuttles from the CBD to Akaroa and Banks Peninsula',
                'Sports-team travel to Timaru, Nelson and the West Coast',
                'Church, school and community-group tours across the South Island',
                'Airport transfers for corporate and conference groups',
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

      <section className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
          What groups tell us
        </p>
        <blockquote className="font-serif text-3xl md:text-4xl leading-snug">
          "Picked the 12-seater up on Friday for the wedding shuttle, back Sunday. Drove
          like a car, the whole bridal party fit, and the team on Moorhouse were
          brilliant."
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
          — Recent customer, Fendalton
        </p>
      </section>

      <section className="container mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4">
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Field notes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Plan a smoother minibus day.
          </h2>
          <img
            src={minibusInterior}
            alt="Interior of a 12-seat minibus"
            className="mt-8 w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </aside>
        <ol className="md:col-span-8 space-y-8">
          {[
            ['Count heads honestly', 'Twelve seats means twelve adults. If you have thirteen bodies and bags, ask about the luggage trailer at booking.'],
            ['Nominate two drivers', 'For runs to Queenstown or the coast, share the wheel — we add a second driver at no cost.'],
            ['Fuel it once', 'Diesel is friendly on long South Island runs. Fill at the Mobil on Moorhouse before drop-off to avoid the refill fee.'],
            ['Book early in wedding season', 'November through March our minibuses go weeks ahead. Lock in your date early.'],
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
            <h2 className="font-serif text-4xl md:text-5xl">Book your Christchurch minibus</h2>
            <p className="mt-4 text-muted-foreground">
              Check live availability and lock in a group rate in under a minute.
            </p>
          </div>
          <SearchForm defaultPickupLocation="14" defaultDropoffLocation="14" />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Questions
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Christchurch minibus hire FAQ</h2>
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
          515 Moorhouse Avenue, Waltham, Christchurch 8011
        </div>
      </section>
      <RelatedLocations vehicleType="minibuses" currentCity="christchurch" title="More hire options in Christchurch" />
    </div>
  );
};

export default ChristchurchMinibusHire;