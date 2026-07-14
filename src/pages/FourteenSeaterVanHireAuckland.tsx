import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Users, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import hero from '@/assets/12-seater-van-auckland-sky-tower.jpg';
import interior from '@/assets/12-seater-van-interior-auckland.jpg';

const options = [
  {
    no: '01',
    name: '12-Seat Van · Toyota Hiace ZX',
    slug: '/fleet/minibus/12-seat-minibus',
    img: '/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png',
    blurb:
      'Our closest match to a 14 seater — the 12-seat Toyota Hiace ZX. Automatic, diesel, tow-bar fitted and welcome anywhere in New Zealand on a car licence.',
    spec: '12 seats · Auto · Diesel · Tow bar',
  },
  {
    no: '02',
    name: 'Premium 12-Seat · LDV Deliver 9',
    slug: '/fleet/minibus/premium-12-seat-minibus',
    img: 'https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw',
    blurb:
      'The premium 12-seater for longer North Island trips — quieter cabin, luxury trim, generous headroom and Bluetooth.',
    spec: '12 seats · Auto · Diesel · Bluetooth',
  },
  {
    no: '03',
    name: '10-Seat Van · Toyota Hiace ZL',
    slug: '/fleet/minibus/10-seat-minibus',
    img: '/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png',
    blurb:
      'When your group is smaller — a lighter 10-seat Hiace for wedding parties, sports teams and airport transfers around Auckland.',
    spec: '10 seats · Auto · Petrol',
  },
];

const FourteenSeaterVanHireAuckland = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you hire 14 seater vans in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The largest passenger van we run in Auckland is a 12 seater — the Toyota Hiace ZX and premium LDV Deliver 9. A true 14 seater would require a P endorsement and Class 2 licence, whereas our 12 seaters can be driven on a standard NZ car licence.',
        },
      },
      {
        '@type': 'Question',
        name: 'What licence do I need for a 12 seater van in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard New Zealand Class 1 car licence — or a valid overseas equivalent — is all you need. No P endorsement is required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I split a group of 14 across two vehicles?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — a common option is a 12 seater plus a car or ute for the remaining passengers and luggage. Call 0800 525 663 and we will build the combined quote for you.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a 12 seater van cost to hire in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Daily rates start from around $189 for the 12-seat Toyota Hiace, with cheaper weekend, weekly and multi-day rates. Get a live quote in the booking form below.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do I pick up in Auckland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We have Auckland Airport, West Auckland, Central Auckland and South Auckland branches. Free shuttle from Auckland Airport on request.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="14 Seater Van Hire Auckland | Our Largest is a 12-Seater | James Blond"
        description="Looking for a 14 seater van in Auckland? Our largest passenger van is a 12-seater Toyota Hiace on a car licence — same drop-off, same simplicity, from $189/day."
        canonical="/14-seater-van-hire-auckland"
        ogImage="https://jamesblond.co.nz/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png"
      />
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Auckland · A note on 14 seaters
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                14 seater van hire, Auckland —
                <span className="italic text-primary"> our largest is a 12-seater.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                We are asked for 14 seaters every week. The honest answer: in New Zealand a
                true 14 seater needs a Class 2 licence and P endorsement. Our 12-seat Toyota
                Hiace and LDV Deliver 9 go on a standard car licence — which is almost always
                what people actually need.
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground max-w-xl">
                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p>
                  Got 13–14 people? Book a 12 seater and add a car for the extras — we quote it
                  together on one contract. Call <a href="tel:0800525663" className="underline">0800 525 663</a>.
                </p>
              </div>
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
              <p className="mt-8 text-sm text-muted-foreground max-w-xl">
                See also:{' '}
                <Link to="/auckland-minibus-hire" className="underline hover:text-primary">Auckland minibus hire</Link>,{' '}
                <Link to="/12-seater-van-hire-auckland" className="underline hover:text-primary">12 seater van hire</Link>{' '}
                and{' '}
                <Link to="/people-mover" className="underline hover:text-primary">people movers</Link>.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <img
                  src={hero}
                  alt="12 seater Toyota Hiace van in Auckland — our largest passenger van"
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
            { n: '01', t: 'Car licence, not Class 2', d: 'Every 12 seater goes on a standard NZ Class 1 licence — no P endorsement, no manual gearbox.' },
            { n: '02', t: 'Tow bar fitted', d: 'Add a luggage trailer at pick-up for group airport runs, ski trips or wedding shuttles.' },
            { n: '03', t: 'Split-vehicle quotes', d: '13–14 people? We quote the 12 seater plus a second car together on one contract.' },
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
            The nearest thing to a 14 seater.
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
              src={interior}
              alt="Interior of the 12-seat Toyota Hiace we hire in Auckland"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              What twelve seats are good for
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Wedding parties, sports teams, corporate shuttles.
            </h2>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'Wedding and funeral shuttles around Auckland',
                'Sports-team travel — Auckland to Hamilton and beyond',
                'Corporate airport transfers from Auckland Airport',
                'Ski weekends to Whakapapa and Tūroa',
                'Church and community group day trips',
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
        <h2 className="font-serif text-4xl md:text-5xl mb-10">14 seater van hire Auckland FAQ</h2>
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
          Auckland Airport · West Auckland · Central Auckland · South Auckland
        </div>
      </section>
    </div>
  );
};

export default FourteenSeaterVanHireAuckland;