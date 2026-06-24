import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, MapPin, Car, Route as RouteIcon, Clock, Phone, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { getOneWayRoute, oneWayRoutes } from '@/lib/one-way-routes';
import coastal from '@/assets/auckland-car-rental-coastal-road.jpg';
import heroSuv from '@/assets/auckland-7-seater-suv-family.jpg';

const SITE_URL = 'https://jamesblond.co.nz';

const OneWayRoutePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const route = slug ? getOneWayRoute(slug) : undefined;

  if (!route) return <Navigate to="/one-way-car-hire" replace />;

  const canonical = `/one-way-car-hire/${route.slug}`;
  const PAGE_URL = `${SITE_URL}${canonical}`;
  const reverse = getOneWayRoute(route.reverseSlug);
  const otherRoutes = oneWayRoutes.filter((r) => r.slug !== route.slug && r.slug !== route.reverseSlug).slice(0, 6);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can I hire a car one-way from ${route.fromName} to ${route.toName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes — James Blond Rentals offers one-way car hire from ${route.fromName} to ${route.toName}. Pick up at our ${route.fromName} branch and drop off at our ${route.toName} branch. Reserve online to see live availability and the current one-way fee.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long does it take to drive from ${route.fromName} to ${route.toName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `It's about ${route.distance} and roughly ${route.driveTime} of driving. Most travellers split it over 2 days to enjoy stops along the way.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is there a one-way fee from ${route.fromName} to ${route.toName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A one-way relocation fee usually applies and varies by vehicle and season — the live amount for your dates is shown before you pay during online booking.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I drive ${route.fromName} to ${route.toName} in one day?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${route.driveTime.includes('ferry') ? 'No — this route includes a Cook Strait ferry crossing and is best done over 2–3 days.' : `It's possible but tiring. ${route.driveTime} is non-stop driving time — we recommend splitting the trip with at least one overnight stop.`}`,
        },
      },
    ],
  };

  const tripLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: `One-way car hire ${route.fromName} to ${route.toName}`,
    description: route.longIntro,
    url: PAGE_URL,
    touristType: ['Road trip', 'One-way car rental'],
    itinerary: route.highlights.map((h, i) => ({
      '@type': 'TouristAttraction',
      name: h,
      position: i + 1,
    })),
    provider: {
      '@type': 'AutoRental',
      name: 'James Blond Rentals',
      url: `${SITE_URL}/one-way-car-hire`,
      telephone: '+64800525663',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'One-Way Car Hire', item: `${SITE_URL}/one-way-car-hire` },
      { '@type': 'ListItem', position: 3, name: `${route.fromName} to ${route.toName}`, item: PAGE_URL },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title={`One-Way Car Hire ${route.fromName} to ${route.toName} | James Blond Rentals`}
        description={`One-way car hire from ${route.fromName} to ${route.toName} — ${route.distance}, ${route.driveTime}. Pick up in ${route.fromName}, drop off in ${route.toName}. Modern fleet, transparent one-way fee.`}
        canonical={canonical}
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={tripLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container mx-auto px-6 pt-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/one-way-car-hire" className="hover:text-primary">One-Way Car Hire</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{route.fromName} to {route.toName}</span>
      </nav>

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[70vh] mt-4">
        <div className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)] flex flex-col justify-between p-8 md:p-16">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RouteIcon className="h-4 w-4 text-primary" />
            <span>One-Way Route</span>
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-lg font-semibold">{route.fromName} <span className="text-primary">→</span> {route.toName}</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-10" />
            <h1 className="font-sans font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05]">
              One-Way Car Hire {route.fromName} to {route.toName}
            </h1>
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-medium">
              <span className="inline-flex items-center gap-2"><RouteIcon className="h-4 w-4 text-primary" /> {route.distance}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {route.driveTime}</span>
            </div>
            <p className="mt-6 text-lg text-[hsl(0_0%_30%)]">{route.longIntro}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button asChild size="lg" className="rounded-none px-7">
                <a href="#booking">Check availability</a>
              </Button>
              <a href="tel:0800525663" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                <Phone className="h-4 w-4" /> 0800 525 663
              </a>
            </div>
          </div>
        </div>
        <div className="bg-[hsl(0_0%_18%)] flex items-center justify-center p-8 md:p-16">
          <img src={heroSuv} alt={`One-way car hire ${route.fromName} to ${route.toName}`} className="w-full max-w-md aspect-square object-cover rounded-3xl shadow-2xl" loading="eager" />
        </div>
      </section>

      {/* Highlights */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">Along the way</span>
          </div>
          <div className="h-px w-full bg-border mb-8" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {route.highlights.map((h, i) => (
              <li key={h} className="border border-border rounded-xl p-4">
                <span className="font-sans font-extrabold text-2xl text-primary">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 text-sm font-semibold">{h}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Editorial */}
      <section className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)]">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
              Why hire one-way from {route.fromName}?
            </h2>
            <p className="mt-6 text-lg text-[hsl(0_0%_30%)]">
              A one-way rental from {route.fromName} to {route.toName} saves you a full return drive ({route.driveTime}) — that's a day back on your trip and no extra fuel cost. Pick up in {route.fromName}, take your time on the way, and leave the car at our {route.toName} branch.
            </p>
            <ul className="mt-8 space-y-3 text-[hsl(0_0%_25%)]">
              <li className="flex items-start gap-3"><Car className="h-5 w-5 text-primary mt-0.5 shrink-0" /> Modern automatic fleet — economy cars, sedans and SUVs.</li>
              <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" /> Pickup and drop-off at full-service James Blond branches.</li>
              <li className="flex items-start gap-3"><RouteIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" /> One-way fee shown live at booking — no drop-off surprises.</li>
            </ul>
            {reverse && (
              <p className="mt-8 text-sm">
                Going the other way? See{' '}
                <Link to={`/one-way-car-hire/${reverse.slug}`} className="text-primary font-semibold underline">
                  one-way car hire {reverse.fromName} to {reverse.toName}
                </Link>.
              </p>
            )}
          </div>
          <div>
            <img src={coastal} alt={`Road trip from ${route.fromName} to ${route.toName}`} className="w-full aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl">
              Book {route.fromName} → {route.toName}
            </h2>
            <p className="mt-4 text-muted-foreground">
              Set pickup to {route.fromName} and drop-off to {route.toName} to see live one-way rates.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* Other routes */}
      <section className="container mx-auto px-6 pb-24">
        <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl mb-8">Other one-way routes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherRoutes.map((r) => (
            <Link
              key={r.slug}
              to={`/one-way-car-hire/${r.slug}`}
              className="group border border-border rounded-2xl p-5 hover:border-primary hover:shadow-lg transition-all bg-card"
            >
              <h3 className="font-sans font-bold text-lg tracking-tight">
                {r.fromName} <span className="text-primary">→</span> {r.toName}
              </h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{r.distance} · {r.driveTime}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                View route <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">Questions</span>
        </div>
        <div className="h-px w-full bg-border mb-8" />
        <h2 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl mb-10">
          {route.fromName} → {route.toName} FAQ
        </h2>
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

export default OneWayRoutePage;