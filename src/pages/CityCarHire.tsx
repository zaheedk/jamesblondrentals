import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Car, GraduationCap, MapPin, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import RelatedLocations from '@/components/RelatedLocations';
import heroSuv from '@/assets/auckland-7-seater-suv-family.jpg';
import coastal from '@/assets/auckland-car-rental-coastal-road.jpg';
import awd from '@/assets/awd-suv-nz-mountain-adventure.jpg';
import eco from '@/assets/eco-hybrid-car-nz-landscape.jpg';

const SITE_URL = 'https://jamesblond.co.nz';

export interface CityCarHireProps {
  city: string;
  region: string;
  slug: string; // e.g. /car-hire-hamilton
  phone: string; // tel link e.g. +6478383150
  phoneDisplay: string; // pretty phone
  intro: string;
  neighbourhoods: string[];
  fromPrice?: string;
}

const CityCarHire: React.FC<CityCarHireProps> = ({
  city,
  region,
  slug,
  phone,
  phoneDisplay,
  intro,
  neighbourhoods,
  fromPrice = '$49',
}) => {
  const PAGE_URL = `${SITE_URL}${slug}`;

  const cars = [
    {
      no: '01',
      name: 'Premium Economy',
      slug: '/fleet/cars/premium-economy',
      img: eco,
      blurb: `The smart pick for ${city} commuters and short stays — modern, automatic and easy on fuel.`,
      spec: 'Auto · 5 seats · Fuel-efficient',
    },
    {
      no: '02',
      name: 'Premium Midsize',
      slug: '/fleet/cars/premium-midsize',
      img: coastal,
      blurb: `More boot space and highway comfort for road trips out of ${city}.`,
      spec: 'Auto · 5 seats · Spacious boot',
    },
    {
      no: '03',
      name: 'Premium Compact SUV',
      slug: '/fleet/cars/premium-compact-suv',
      img: heroSuv,
      blurb: `A higher driving position and easy parking around ${city} — great for families and weekend escapes.`,
      spec: 'Auto · 5 seats · SUV',
    },
    {
      no: '04',
      name: 'Premium AWD SUV',
      slug: '/fleet/cars/premium-awd-suv',
      img: awd,
      blurb: `All-wheel drive confidence for ski runs, alpine roads and long South Island drives from ${city}.`,
      spec: 'AWD · Auto · 5 seats',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does car hire cost in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Car hire in ${city} starts from around ${fromPrice} per day with James Blond Rentals. Multi-day, weekly and midweek rates lower the daily price further — see our hot deals page for current discounts.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the best car rental company in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `James Blond Rentals is one of the top-rated car hire companies in ${city}, with a modern fleet of economy cars, midsize cars and SUVs, transparent pricing and no hidden fees. We are independently rated 4.8 / 5 across 1,200+ reviews.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do I need to be 25 to hire a car in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `No. Drivers from 21 years of age with a full licence held for at least 12 months can hire a car from our ${city} branch. A young-driver fee may apply for drivers under 25.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I hire a car for one-way travel from ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. One-way car hire from ${city} to other James Blond branches around New Zealand is available on request when booking online or by phone.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where do I pick up my hire car in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Cars are picked up from our ${city} branch with easy access to the city centre, motorways and the airport. Free parking is available while you arrange paperwork.`,
        },
      },
    ],
  };

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: `James Blond Rentals — ${city} Car Hire`,
    image: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
    url: PAGE_URL,
    telephone: phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: region,
      addressCountry: 'NZ',
    },
    areaServed: [city, region, ...neighbourhoods],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1200',
    },
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title={`Car Hire ${city} | Cheap Car Rental from ${fromPrice}/day | James Blond`}
        description={`Car hire in ${city} from ${fromPrice} per day. Economy cars, midsize sedans and SUVs from a top-rated local rental company. Transparent pricing, no hidden fees.`}
        canonical={slug}
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={localBusinessLd} />

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[80vh]">
        <div className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)] flex flex-col justify-between p-8 md:p-16">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{city} · {region}</span>
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <Car className="h-5 w-5" />
              <span className="text-lg font-semibold">Car Hire</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-10" />
            <h1 className="font-sans font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05]">
              Car Hire in {city} — Economy Cars, Sedans &amp; SUVs from {fromPrice}/day
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button asChild size="lg" className="rounded-none px-7">
                <a href="#booking">Check availability</a>
              </Button>
              <a href={`tel:${phone}`} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                <Phone className="h-4 w-4" /> {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
        <div className="bg-[hsl(0_0%_18%)] flex items-center justify-center p-8 md:p-16">
          <div className="relative w-full max-w-md">
            <img src={heroSuv} alt={`Hire car available in ${city}`} className="w-full aspect-square object-cover rounded-3xl shadow-2xl" loading="eager" />
            <div className="absolute -bottom-5 -left-5 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-xl">
              <p className="text-[10px] uppercase tracking-widest opacity-80">From</p>
              <p className="font-extrabold text-2xl leading-none">{fromPrice} / day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered intro */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'Modern fleet', d: 'Late-model automatic cars serviced locally.' },
            { n: '02', t: `${city}-based pickup`, d: `Pick up minutes from the ${city} city centre.` },
            { n: '03', t: 'Transparent pricing', d: 'No surprise fees — what you quote is what you pay.' },
          ].map((row, i) => (
            <div key={row.n} className={`flex gap-6 py-6 md:py-2 ${i > 0 ? 'md:border-l md:pl-10 border-border' : ''}`}>
              <span className="font-sans font-extrabold text-3xl text-primary leading-none">{row.n}</span>
              <div>
                <h2 className="text-base font-semibold">{row.t}</h2>
                <p className="text-sm text-muted-foreground mt-1">{row.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet zigzag */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-3">
            <Car className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">The Fleet</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
            One car for every {city} trip.
          </h2>
        </div>
        <div className="space-y-24">
          {cars.map((v, idx) => (
            <article key={v.no} className={`grid md:grid-cols-12 gap-10 items-center ${idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''}`}>
              <div className="md:col-span-7">
                <img src={v.img} alt={`${v.name} for ${city} car hire`} className="w-full aspect-[4/3] object-cover rounded-2xl" loading="lazy" />
              </div>
              <div className="md:col-span-5">
                <span className="font-sans font-extrabold text-5xl text-primary">{v.no}</span>
                <h3 className="font-sans font-extrabold text-3xl mt-4 tracking-tight">{v.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{v.spec}</p>
                <p className="mt-5 text-muted-foreground leading-relaxed">{v.blurb}</p>
                <Link to={v.slug} className="mt-6 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
                  View details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Editorial */}
      <section className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)]">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Local to {city}</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-6" />
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
              Built for the way {city} drives.
            </h2>
            <p className="mt-6 text-lg text-[hsl(0_0%_30%)]">{intro}</p>
            <ul className="mt-10 divide-y divide-[hsl(0_0%_75%)] border-y border-[hsl(0_0%_75%)]">
              {neighbourhoods.map((row) => (
                <li key={row} className="flex items-center justify-between py-4 text-sm md:text-base">
                  <span>Serving {row}</span>
                  <Car className="h-4 w-4 text-primary shrink-0 ml-4" />
                </li>
              ))}
            </ul>
          </div>
          <div className="relative md:order-first">
            <div className="bg-[hsl(0_0%_18%)] p-6 md:p-10 rounded-2xl">
              <img src={coastal} alt={`${city} car rental coastal drive`} className="w-full aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Quote className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">From the counter</span>
        </div>
        <div className="h-px w-24 mx-auto bg-border mb-8" />
        <blockquote className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl leading-snug">
          “Clean cars, honest pricing and a real human at the desk. The way {city} car hire should feel.”
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">— Local customer</p>
      </section>

      {/* Booking */}
      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Reserve</span>
            </div>
            <div className="h-px w-24 mx-auto bg-border mb-6" />
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl">Book your {city} car</h2>
            <p className="mt-4 text-muted-foreground">Live availability across our economy, midsize and SUV fleet.</p>
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
        <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl mb-10">Car hire {city} FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {faqJsonLd.mainEntity.map((q) => (
            <div key={q.name} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-sans font-bold text-xl tracking-tight">{q.name}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{q.acceptedAnswer.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 p-6 border border-border rounded-2xl bg-card">
          <p className="text-sm uppercase tracking-widest text-primary font-semibold">One-way trip?</p>
          <p className="mt-2 text-lg">
            Picking up in {city} and dropping off in a different city?{' '}
            <Link to="/one-way-car-hire" className="font-semibold underline hover:text-primary">
              See one-way car hire across New Zealand →
            </Link>
          </p>
        </div>
      </section>
      <RelatedLocations
        vehicleType="cars"
        currentCity={
          slug.includes('auckland')
            ? 'auckland'
            : slug.includes('christchurch')
            ? 'christchurch'
            : slug.includes('wellington')
            ? 'wellington'
            : slug.includes('hamilton')
            ? 'hamilton'
            : undefined
        }
        title={`More hire options in ${city}`}
      />
    </div>
  );
};

export default CityCarHire;