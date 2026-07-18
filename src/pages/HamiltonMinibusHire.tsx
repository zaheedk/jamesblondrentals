import React from 'react';
import RelatedLocations from '@/components/RelatedLocations';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import hero from '@/assets/12-seater-van-auckland-sky-tower.jpg';
import interior from '@/assets/12-seater-van-interior-auckland.jpg';
import group from '@/assets/wellington-12-seat-van-family-group.jpg';

const buses = [
  {
    no: '01',
    name: 'Premium 12-Seat · LDV Deliver 9',
    slug: '/fleet/minibus/premium-12-seat-minibus',
    img: 'https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw',
    blurb:
      'The most comfortable way to move twelve people out of Hamilton — luxury trim, air-con throughout, and a tow bar for the luggage trailer.',
    spec: '12 seats · Auto · Diesel · Car licence',
  },
  {
    no: '02',
    name: '12-Seat Minibus · Toyota Hiace ZX',
    slug: '/fleet/minibus/12-seat-minibus',
    img: '/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png',
    blurb:
      'The proven Waikato workhorse — full-height seats, cargo barrier and tow bar. Favourite of sports teams, wedding parties and church groups.',
    spec: '12 seats · Auto · Diesel',
  },
  {
    no: '03',
    name: '10-Seat Minibus · Toyota Hiace ZL',
    slug: '/fleet/minibus/10-seat-minibus',
    img: '/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png',
    blurb:
      'When ten is the number — a lighter minibus for the mid-size Waikato group. Easy car-licence drive, comfortable for the Auckland or Rotorua run.',
    spec: '10 seats · Auto · Petrol',
  },
];

const HamiltonMinibusHire = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What licence do I need for a 12 seater van in Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard New Zealand Class 1 car licence — or a valid overseas equivalent. Every minibus in our Hamilton fleet is Class 1, automatic, and drives like a big van.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do I pick up the minibus in Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pick-up is from our Hamilton branch, with easy access to the Waikato Expressway for runs north to Auckland or south to Rotorua and Taupo.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does 12 seater minibus hire cost in Hamilton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Daily rates for a 12-seat minibus in Hamilton start from around $189, with cheaper weekend, weekly and multi-day rates. Ring 0800 525 663 for a live quote.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I take the Hamilton minibus to Auckland, Rotorua or Taupo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our Hamilton minibuses come with unlimited kilometres and are welcome anywhere in the North Island — Auckland, Rotorua, Taupo, Coromandel and beyond.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there luggage space for a full group?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Soft bags and day packs fit behind the last row of seats. For a full airport or ski-trip load with all twelve seats occupied, add a luggage trailer at pick-up — the tow bar is already fitted.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Minibus & 12 Seater Van Hire Hamilton | James Blond"
        description="12-seater minibus and 10-seater van hire in Hamilton. Automatic, car-licence, tow bar, unlimited kms across the Waikato and North Island."
        canonical="/hamilton-minibus-hire"
        ogImage="https://jamesblond.co.nz/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png"
      />
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Hamilton · Waikato
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Minibus & 12 seater van hire in Hamilton,
                <span className="italic text-primary"> on a car licence.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                Whether it's a sports weekend to Auckland, a wedding shuttle to Raglan
                or a school trip to Rotorua — our Hamilton minibuses seat up to twelve,
                drive on a car licence and come with unlimited kilometres.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                Also from Hamilton:{' '}
                <Link to="/van-hire-hamilton" className="underline hover:text-primary">van hire</Link>,{' '}
                <Link to="/truck-hire-hamilton" className="underline hover:text-primary">truck hire</Link>{' '}
                and{' '}
                <Link to="/car-hire-hamilton" className="underline hover:text-primary">car hire</Link>.
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
                  alt="12 seater minibus for hire in Hamilton"
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
            { n: '01', t: 'Car-licence, automatic', d: 'Class 1 vehicles, automatic gearbox. No P endorsement, no manual required.' },
            { n: '02', t: 'Hamilton to anywhere', d: 'Straight onto the Waikato Expressway — Auckland, Rotorua, Taupo, Coromandel.' },
            { n: '03', t: 'Unlimited kilometres', d: 'Every km included in the daily rate — take it as far as the trip needs to go.' },
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
            Three minibuses. Every Waikato group covered.
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
                  alt={`${v.name} — Hamilton hire`}
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
              alt="Group boarding a 12-seat minibus in Hamilton"
              className="w-full aspect-[5/6] object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Waikato groups, one van
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Weddings, teams, tours — one bill, one driver.
            </h2>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {[
                'Wedding shuttles across the Waikato and out to Raglan',
                'Sports-team travel from Hamilton to Auckland and Rotorua',
                'School, church and community-group day trips',
                'Corporate airport transfers to Auckland Airport',
                'North Island tours — Waitomo, Coromandel, Bay of Plenty',
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
            <h2 className="font-serif text-4xl md:text-5xl">Book your Hamilton minibus</h2>
            <p className="mt-4 text-muted-foreground">
              Live availability and instant pricing from our Hamilton branch.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Questions
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Hamilton minibus hire FAQ</h2>
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
          Hamilton branch · Waikato
        </div>
      </section>
      <RelatedLocations vehicleType="minibuses" currentCity="hamilton" title="More hire options in Hamilton" />
    </div>
  );
};

export default HamiltonMinibusHire;