import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Car, Route as RouteIcon, ShieldCheck, Phone, Quote, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { oneWayRoutes } from '@/lib/one-way-routes';
import coastal from '@/assets/auckland-car-rental-coastal-road.jpg';
import heroSuv from '@/assets/auckland-7-seater-suv-family.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const PAGE_URL = `${SITE_URL}/one-way-car-hire`;

const OneWayCarHire: React.FC = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is one-way car hire?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One-way car hire lets you pick up a rental car at one James Blond branch and drop it off at a different branch — for example pick up in Auckland and return in Wellington. Perfect for one-way road trips, relocations and flights out of a different city.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a one-way fee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — a one-way relocation fee usually applies and varies by route, vehicle and season. Quote both pickup and drop-off branches in our online booking to see the exact fee for your trip. Some routes (especially relocations back to a busy branch) are heavily discounted or free at certain times of year.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which one-way routes do you offer in New Zealand?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer one-way car hire between all James Blond branches: Auckland, Auckland Airport, Hamilton, Wellington and Christchurch — in any combination, in either direction.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I do one-way car hire between the North and South Island?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Many customers pick up in Auckland or Wellington and drop off in Christchurch (or vice-versa), combining their rental with the Interislander ferry. We can advise on ferry-friendly vehicles and any inter-island surcharges at booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'How far in advance should I book a one-way rental?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Book as early as possible — one-way vehicles are limited per route and the best fees and availability go to early bookings, especially in summer (Dec–Feb) and ski season (Jul–Sep).',
        },
      },
    ],
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'One-way car hire routes — James Blond Rentals',
    itemListElement: oneWayRoutes.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `One-way car hire ${r.fromName} to ${r.toName}`,
      url: `${SITE_URL}/one-way-car-hire/${r.slug}`,
    })),
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="One-Way Car Hire NZ | Pick Up & Drop Off in Different Cities | James Blond"
        description="One-way car hire across New Zealand. Pick up in Auckland, Hamilton, Wellington or Christchurch and drop off at any other James Blond branch. Transparent one-way fees, modern fleet."
        canonical="/one-way-car-hire"
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={itemListLd} />

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)] flex flex-col justify-between p-8 md:p-16">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RouteIcon className="h-4 w-4 text-primary" />
            <span>One-Way Car Hire · New Zealand</span>
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <Car className="h-5 w-5" />
              <span className="text-lg font-semibold">Pick up here. Drop off there.</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-10" />
            <h1 className="font-sans font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05]">
              One-Way Car Hire NZ — drive between Auckland, Wellington &amp; Christchurch
            </h1>
            <p className="mt-6 text-lg text-[hsl(0_0%_30%)]">
              Skip the return drive. Pick up your rental at one James Blond branch and drop it off at another — Auckland Airport, Hamilton, Wellington or Christchurch — for one-way road trips, relocations and ferry crossings.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button asChild size="lg" className="rounded-none px-7">
                <a href="#booking">Check one-way availability</a>
              </Button>
              <a href="tel:0800525663" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                <Phone className="h-4 w-4" /> 0800 525 663
              </a>
            </div>
          </div>
        </div>
        <div className="bg-[hsl(0_0%_18%)] flex items-center justify-center p-8 md:p-16">
          <img src={heroSuv} alt="One-way car hire New Zealand" className="w-full max-w-md aspect-square object-cover rounded-3xl shadow-2xl" loading="eager" />
        </div>
      </section>

      {/* Why one-way */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'No round-trip needed', d: 'Drive one direction and fly, ferry or train back — save a full day of driving.' },
            { n: '02', t: 'Five NZ branches', d: 'Auckland, Auckland Airport, Hamilton, Wellington and Christchurch.' },
            { n: '03', t: 'Transparent fees', d: 'One-way relocation fees shown live at booking — no surprises at drop-off.' },
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

      {/* Cross-link to commercial one-way */}
      <section className="container mx-auto px-6 pt-16 -mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/one-way-truck-hire" className="border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all bg-card group">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Moving house?</p>
            <h3 className="font-sans font-bold text-xl tracking-tight">One-way truck hire NZ <span className="text-primary group-hover:ml-1 transition-all">→</span></h3>
            <p className="mt-2 text-sm text-muted-foreground">Same routes, 2–3 tonne box &amp; furniture trucks. Car licence, automatic.</p>
          </Link>
          <Link to="/one-way-van-hire" className="border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all bg-card group">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Studio or 1-bed move?</p>
            <h3 className="font-sans font-bold text-xl tracking-tight">One-way van hire NZ <span className="text-primary group-hover:ml-1 transition-all">→</span></h3>
            <p className="mt-2 text-sm text-muted-foreground">Cargo &amp; jumbo vans between all James Blond branches — ferry-approved.</p>
          </Link>
        </div>
      </section>

      {/* Route grid */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-3">
            <RouteIcon className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">Popular One-Way Routes</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
            Pick a route. We've got the car.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {oneWayRoutes.map((r) => (
            <Link
              key={r.slug}
              to={`/one-way-car-hire/${r.slug}`}
              className="group border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all bg-card"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                <MapPin className="h-3.5 w-3.5" /> {r.distance} · {r.driveTime}
              </div>
              <h3 className="font-sans font-bold text-xl tracking-tight">
                {r.fromName} <span className="text-primary">→</span> {r.toName}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{r.shortIntro}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                View route <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial */}
      <section className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)]">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">How one-way hire works</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-6" />
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
              Three steps. Two cities. One car.
            </h2>
            <ol className="mt-8 space-y-6 text-[hsl(0_0%_25%)]">
              <li><span className="font-bold text-primary">1.</span> Choose different pickup and drop-off branches in our booking form.</li>
              <li><span className="font-bold text-primary">2.</span> The one-way relocation fee is calculated live and shown before you pay — it varies by route, vehicle and season.</li>
              <li><span className="font-bold text-primary">3.</span> Pick up your car, drive your trip, leave it at the destination branch. Done.</li>
            </ol>
            <div className="mt-10 p-6 bg-white border border-[hsl(0_0%_75%)] rounded-2xl">
              <p className="text-sm font-semibold mb-1">Tip — ferry-friendly routes</p>
              <p className="text-sm text-[hsl(0_0%_30%)]">Crossing Cook Strait? Most of our fleet is approved for the Interislander and Bluebridge ferries between Wellington and Picton — let us know at booking and we'll confirm.</p>
            </div>
          </div>
          <div>
            <img src={coastal} alt="One-way road trip New Zealand" className="w-full aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="container mx-auto px-6 py-24 text-center max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Quote className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">From the road</span>
        </div>
        <div className="h-px w-24 mx-auto bg-border mb-8" />
        <blockquote className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl leading-snug">
          "Picked up in Auckland, dropped off in Wellington three days later. Cheaper than flying both ways with luggage."
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">— One-way customer</p>
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
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl">Book your one-way car</h2>
            <p className="mt-4 text-muted-foreground">Set a different pickup and drop-off to see live one-way rates.</p>
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
        <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl mb-10">One-way car hire FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {faqJsonLd.mainEntity.map((q) => (
            <div key={q.name} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-sans font-bold text-xl tracking-tight">{q.name}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{q.acceptedAnswer.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};

export default OneWayCarHire;