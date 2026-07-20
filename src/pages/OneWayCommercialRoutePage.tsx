import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, MapPin, Truck, Route as RouteIcon, Clock, Phone, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import {
  getOneWayCommercialRoute,
  oneWayCommercialRoutes,
  variantConfig,
  CommercialVariant,
} from '@/lib/one-way-commercial-routes';
import coastal from '@/assets/auckland-car-rental-coastal-road.jpg';
import heroImg from '@/assets/auckland-7-seater-suv-family.jpg';

const SITE_URL = 'https://jamesblond.co.nz';

interface Props { variant: CommercialVariant }

const OneWayCommercialRoutePage: React.FC<Props> = ({ variant }) => {
  const { slug } = useParams<{ slug: string }>();
  const route = slug ? getOneWayCommercialRoute(slug) : undefined;
  const cfg = variantConfig[variant];

  if (!route) return <Navigate to={cfg.urlBase} replace />;

  const label = cfg.label;
  const canonical = `${cfg.urlBase}/${route.slug}`;
  const PAGE_URL = `${SITE_URL}${canonical}`;
  const reverse = getOneWayCommercialRoute(route.reverseSlug);
  const otherRoutes = oneWayCommercialRoutes.filter((r) => r.slug !== route.slug && r.slug !== route.reverseSlug).slice(0, 6);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can I hire a ${label.toLowerCase()} one-way from ${route.fromName} to ${route.toName}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Yes — James Blond Rentals offers one-way ${label.toLowerCase()} hire from ${route.fromName} to ${route.toName}. Pick up at our ${route.fromName} branch and drop off at our ${route.toName} branch. Reserve online to see live availability and the current one-way fee for your dates.` },
      },
      {
        '@type': 'Question',
        name: `How long does it take to drive ${route.fromName} to ${route.toName} in a ${label.toLowerCase()}?`,
        acceptedAnswer: { '@type': 'Answer', text: `It's about ${route.distance} and roughly ${route.driveTime}. ${label === 'Truck' ? 'Loaded trucks sit at 90 km/h max, so allow a bit longer than a car.' : `Loaded vans travel at normal traffic speeds.`} Most one-way movers split it over 2 days.` },
      },
      {
        '@type': 'Question',
        name: `Is there a one-way ${label.toLowerCase()} relocation fee?`,
        acceptedAnswer: { '@type': 'Answer', text: `A one-way relocation fee usually applies and varies by vehicle size and season. The live amount for your dates is shown in our booking form before you pay — no surprises at drop-off.` },
      },
      {
        '@type': 'Question',
        name: `Do I need a special licence?`,
        acceptedAnswer: { '@type': 'Answer', text: `No. Every ${label.toLowerCase()} in our fleet — including our largest 3-tonne 19m³ furniture trucks — is driveable on a standard NZ Class 1 car licence or equivalent overseas licence. All vehicles are automatic.` },
      },
    ],
  };

  const tripLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: `One-way ${label.toLowerCase()} hire ${route.fromName} to ${route.toName}`,
    description: route.longIntro,
    url: PAGE_URL,
    touristType: ['One-way vehicle rental', 'House move', 'Business relocation'],
    itinerary: route.highlights.map((h, i) => ({ '@type': 'TouristAttraction', name: h, position: i + 1 })),
    provider: {
      '@type': 'AutoRental',
      name: 'James Blond Rentals',
      url: `${SITE_URL}${cfg.urlBase}`,
      telephone: '+64800525663',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: `One-Way ${label} Hire`, item: `${SITE_URL}${cfg.urlBase}` },
      { '@type': 'ListItem', position: 3, name: `${route.fromName} to ${route.toName}`, item: PAGE_URL },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title={`One-Way ${label} Hire ${route.fromName} to ${route.toName} | James Blond Rentals`}
        description={`One-way ${label.toLowerCase()} hire ${route.fromName} to ${route.toName} — ${route.distance}, ${route.driveTime}. From ${cfg.fromPrice}. Pick up in ${route.fromName}, drop off in ${route.toName}. Perfect for moving house.`}
        canonical={canonical}
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={tripLd} />
      <JsonLd data={breadcrumbLd} />

      <nav aria-label="Breadcrumb" className="container mx-auto px-6 pt-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to={cfg.urlBase} className="hover:text-primary">One-Way {label} Hire</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{route.fromName} to {route.toName}</span>
      </nav>

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[70vh] mt-4">
        <div className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)] flex flex-col justify-between p-8 md:p-16">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RouteIcon className="h-4 w-4 text-primary" />
            <span>One-Way {label} Route</span>
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-lg font-semibold">{route.fromName} <span className="text-primary">→</span> {route.toName}</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-10" />
            <h1 className="font-sans font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.05]">
              One-Way {label} Hire {route.fromName} to {route.toName}
            </h1>
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-medium">
              <span className="inline-flex items-center gap-2"><RouteIcon className="h-4 w-4 text-primary" /> {route.distance}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {route.driveTime}</span>
              <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> from {cfg.fromPrice}</span>
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
          <img src={heroImg} alt={`One-way ${label.toLowerCase()} hire ${route.fromName} to ${route.toName}`} className="w-full max-w-md aspect-square object-cover rounded-3xl shadow-2xl" loading="eager" />
        </div>
      </section>

      {/* Highlights */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">What the trip looks like</span>
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
              Why hire a {label.toLowerCase()} one-way from {route.fromName}?
            </h2>
            <p className="mt-6 text-lg text-[hsl(0_0%_30%)]">
              A one-way {label.toLowerCase()} rental from {route.fromName} to {route.toName} saves you a full return leg ({route.driveTime}) — no empty drive, no return fuel, no extra rental days. Pick up in {route.fromName}, load up, and leave the vehicle at our {route.toName} branch.
            </p>
            <ul className="mt-8 space-y-3 text-[hsl(0_0%_25%)]">
              {cfg.vehicleBullets.slice(0, 4).map((b) => (
                <li key={b} className="flex items-start gap-3"><Truck className="h-5 w-5 text-primary mt-0.5 shrink-0" /> {b}</li>
              ))}
            </ul>
            {reverse && (
              <p className="mt-8 text-sm">
                Moving the other way? See{' '}
                <Link to={`${cfg.urlBase}/${reverse.slug}`} className="text-primary font-semibold underline">
                  one-way {label.toLowerCase()} hire {reverse.fromName} to {reverse.toName}
                </Link>.
              </p>
            )}
            <p className="mt-3 text-sm">
              Need a {variant === 'truck' ? 'van' : 'truck'} instead? See{' '}
              <Link to={`${variantConfig[variant === 'truck' ? 'van' : 'truck'].urlBase}/${route.slug}`} className="text-primary font-semibold underline">
                one-way {variant === 'truck' ? 'van' : 'truck'} hire {route.fromName} to {route.toName}
              </Link>.
            </p>
          </div>
          <div>
            <img src={coastal} alt={`Moving from ${route.fromName} to ${route.toName}`} className="w-full aspect-[5/6] object-cover rounded-2xl" loading="lazy" />
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
        <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl mb-8">Other one-way {label.toLowerCase()} routes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherRoutes.map((r) => (
            <Link key={r.slug} to={`${cfg.urlBase}/${r.slug}`} className="group border border-border rounded-2xl p-5 hover:border-primary hover:shadow-lg transition-all bg-card">
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

export default OneWayCommercialRoutePage;