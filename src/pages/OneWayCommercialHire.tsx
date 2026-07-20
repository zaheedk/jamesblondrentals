import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Truck, Route as RouteIcon, ShieldCheck, Phone, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { oneWayCommercialRoutes, variantConfig, CommercialVariant } from '@/lib/one-way-commercial-routes';
import coastal from '@/assets/auckland-car-rental-coastal-road.jpg';
import heroImg from '@/assets/auckland-7-seater-suv-family.jpg';

const SITE_URL = 'https://jamesblond.co.nz';

interface Props { variant: CommercialVariant }

const OneWayCommercialHire: React.FC<Props> = ({ variant }) => {
  const cfg = variantConfig[variant];
  const label = cfg.label;
  const PAGE_URL = `${SITE_URL}${cfg.urlBase}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is one-way ${label.toLowerCase()} hire?`,
        acceptedAnswer: { '@type': 'Answer', text: `One-way ${label.toLowerCase()} hire lets you pick up a ${label.toLowerCase()} at one James Blond branch and drop it off at a different branch — perfect for moving house, business relocations and interisland freight. You only pay for the days you use the vehicle plus a one-way relocation fee shown live at booking.` },
      },
      {
        '@type': 'Question',
        name: `Is there a one-way ${label.toLowerCase()} relocation fee?`,
        acceptedAnswer: { '@type': 'Answer', text: `Yes — a one-way fee applies and varies by route, vehicle size and season. It's calculated live in our online booking based on your pickup and drop-off branches. Interisland routes cost more due to the Cook Strait ferry crossing.` },
      },
      {
        '@type': 'Question',
        name: `Which routes do you offer for one-way ${label.toLowerCase()} hire?`,
        acceptedAnswer: { '@type': 'Answer', text: `We offer one-way ${label.toLowerCase()} hire between all James Blond branches: Auckland, Auckland Airport (limited), Hamilton, Wellington and Christchurch — in any combination.` },
      },
      {
        '@type': 'Question',
        name: `Can I take a ${label.toLowerCase()} on the Cook Strait ferry?`,
        acceptedAnswer: { '@type': 'Answer', text: `Yes. All our ${cfg.pluralLabel.toLowerCase()} are approved for the Interislander and Bluebridge ferries between Wellington and Picton. We'll tell you the exact vehicle length at booking so you can book the crossing at the correct rate.` },
      },
      {
        '@type': 'Question',
        name: `Do I need a special licence for the ${label.toLowerCase()}?`,
        acceptedAnswer: { '@type': 'Answer', text: `No. Our entire ${label.toLowerCase()} fleet — including 3-tonne furniture trucks — is driveable on a standard NZ Class 1 car licence, or an equivalent overseas licence. All vehicles are automatic.` },
      },
    ],
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `One-way ${label.toLowerCase()} hire routes — James Blond Rentals`,
    itemListElement: oneWayCommercialRoutes.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `One-way ${label.toLowerCase()} hire ${r.fromName} to ${r.toName}`,
      url: `${SITE_URL}${cfg.urlBase}/${r.slug}`,
    })),
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title={`One-Way ${label} Hire NZ | Auckland · Wellington · Christchurch | James Blond`}
        description={`One-way ${label.toLowerCase()} hire across New Zealand from ${cfg.fromPrice}. Pick up in Auckland, Hamilton, Wellington or Christchurch and drop off at any other branch. Perfect for moving house and business relocations. Transparent one-way fees.`}
        canonical={cfg.urlBase}
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={itemListLd} />

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)] flex flex-col justify-between p-8 md:p-16">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RouteIcon className="h-4 w-4 text-primary" />
            <span>One-Way {label} Hire · New Zealand</span>
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-5 w-5" />
              <span className="text-lg font-semibold">Move one direction. Don't pay for the return.</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-10" />
            <h1 className="font-sans font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05]">
              One-Way {label} Hire NZ — from {cfg.fromPrice}
            </h1>
            <p className="mt-6 text-lg text-[hsl(0_0%_30%)]">{cfg.intro}</p>
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
          <img src={heroImg} alt={`One-way ${label.toLowerCase()} hire New Zealand`} className="w-full max-w-md aspect-square object-cover rounded-3xl shadow-2xl" loading="eager" />
        </div>
      </section>

      {/* Why one-way */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3">
          {[
            { n: '01', t: 'No return leg', d: `Move one direction and skip the empty drive back — a full day and tank of fuel saved.` },
            { n: '02', t: 'Ferry-approved fleet', d: `All ${cfg.pluralLabel.toLowerCase()} cross Cook Strait — we help book Interislander/Bluebridge at the right vehicle length.` },
            { n: '03', t: 'Car licence, automatic', d: `No truck licence needed — even our 3-tonne furniture trucks. Everything automatic and easy to drive.` },
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

      {/* Route grid */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-3">
            <RouteIcon className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">Popular one-way {label.toLowerCase()} routes</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
            Pick your route. We've got the {label.toLowerCase()}.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {oneWayCommercialRoutes.map((r) => (
            <Link key={r.slug} to={`${cfg.urlBase}/${r.slug}`} className="group border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all bg-card">
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

      {/* Fleet */}
      <section className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)]">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Which {label.toLowerCase()} do you need?</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-6" />
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
              Sized for your move.
            </h2>
            <ul className="mt-8 space-y-3 text-[hsl(0_0%_25%)]">
              {cfg.vehicleBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary mt-0.5 shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild variant="outline" className="rounded-none">
                <Link to={cfg.fleetPath}>See full {label.toLowerCase()} fleet</Link>
              </Button>
            </div>
          </div>
          <div>
            <img src={coastal} alt={`One-way ${label.toLowerCase()} hire between NZ cities`} className="w-full aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl">Book your one-way {label.toLowerCase()}</h2>
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
        <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl mb-10">One-way {label.toLowerCase()} hire FAQ</h2>
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

export default OneWayCommercialHire;