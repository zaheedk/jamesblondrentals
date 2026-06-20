import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Check, Phone, ArrowRight } from 'lucide-react';

interface UteHireProps {
  variant: 'ute' | 'pickup';
}

const UteHire = ({ variant }: UteHireProps) => {
  const isPickup = variant === 'pickup';
  const slug = isPickup ? '/pickup-truck-rental' : '/ute-hire';
  const h1 = isPickup
    ? 'Pickup Truck Rental NZ — Same-Day Ute & Pickup Hire'
    : 'Ute Hire NZ — Single & Double Cab Ute Rental, Same-Day Pickup';
  const title = isPickup
    ? 'Pickup Truck Rental NZ from $79/day — Same-Day Ute & Pickup Hire'
    : 'Ute Hire NZ from $79/day — Single & Double Cab Ute Rental';
  const description = isPickup
    ? 'Pickup truck rental near you from $79/day. Single cab and double cab utes (Hilux & equivalents) for trades, tip runs and weekend projects. Same-day pickup, drive on a car licence.'
    : 'Ute hire NZ from $79/day. Single cab and double cab utes for trades, tip runs and weekend projects. Tow up to 3,500kg, deck up to 2.4m, same-day pickup at Auckland, Wellington, Christchurch & Hamilton.';

  const utes = [
    {
      title: 'Single Cab Ute — Petrol',
      sub: 'Toyota Hilux 2.7L petrol',
      bullets: ['Deck 2.4m × 1.8m', 'Max load 1,000kg', 'Manual transmission', 'Unlimited km'],
      to: '/fleet/utes/single-cab-ute-petrol',
    },
    {
      title: 'Single Cab Ute — Diesel',
      sub: 'Toyota Hilux 3.0L diesel turbo',
      bullets: ['Deck 2.4m × 1.8m', 'Max load 1,000kg', 'Strong towing & torque', 'First 100km free, 25c/km after'],
      to: '/fleet/utes/single-cab-ute-diesel',
    },
    {
      title: 'Premium Double Cab Ute',
      sub: 'Toyota Hilux Workmate 2.7L petrol',
      bullets: ['5 seats + tray', 'Tray 1.7m × 1.8m, 900kg load', 'Tow up to 3,500kg', 'Auto, Bluetooth, towbar, roof racks'],
      to: '/fleet/utes/premium-double-cab-ute',
    },
  ];

  const cities = [
    { name: 'Auckland', to: '/auckland-truck-rentals-hire' },
    { name: 'Wellington', to: '/truck-hire-wellington' },
    { name: 'Christchurch', to: '/truck-hire-christchurch' },
    { name: 'Hamilton', to: '/truck-hire-hamilton' },
  ];

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isPickup ? 'Do you have pickup truck rental near me?' : 'Where can I hire a ute?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'James Blond rents utes and pickups from branches in Auckland (CBD, Penrose, Airport, West Auckland, South Auckland), Wellington CBD, Christchurch (CBD & Airport) and Hamilton — same-day pickup is available 7 days a week.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a special licence to drive a ute or pickup?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Every ute and pickup in our fleet can be driven on a standard NZ Class 1 car licence — no truck or trailer endorsement required.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to rent a ute in NZ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Single cab utes start from $79/day and double cab utes from $99/day, with weekend, weekly and monthly rates available. Tip-run hourly rates are also available — call your nearest branch for a quote.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I tow a trailer or boat with a rental ute?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our double cab utes are rated to tow up to 3,500kg braked and come with a towbar fitted. We also rent caged, luggage and car-transporter trailers.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO title={title} description={description} canonical={slug} />
      <JsonLd data={faq} />

      <section className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
          {isPickup ? 'Pickup truck rental · New Zealand' : 'Ute hire · New Zealand'}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight max-w-4xl">
          {h1}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          {isPickup
            ? 'Need a pickup truck right now? Rent a single cab or double cab Hilux for tip runs, trade work, weekend projects or moving heavy gear. Same-day pickup at branches across Auckland, Wellington, Christchurch and Hamilton — drive on a standard car licence.'
            : 'Single cab and double cab utes for trades, tip runs, weekend projects and moving big gear. 1-tonne deck capacity, towbars fitted, 3,500kg braked towing on the double cab. Same-day pickup at every branch.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link to="/booking">Book a ute now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="tel:+64800832636"><Phone className="mr-2 h-4 w-4" /> 0800 UTE HIRE</a>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {utes.map((u) => (
            <Card key={u.title} className="h-full">
              <CardContent className="p-6">
                <Truck className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-bold">{u.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{u.sub}</p>
                <ul className="space-y-2 mb-6">
                  {u.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={u.to}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="font-serif text-3xl md:text-4xl mb-6">
          {isPickup ? 'Pickup truck rental near you' : 'Ute hire near you'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Pick up from any James Blond branch — same-day available 7 days a week. Trucks, vans and trailers are also available at every location if you need more capacity.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.map((c) => (
            <Link key={c.name} to={c.to} className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="font-bold">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">Truck, van & ute hire</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16 mt-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Common questions</h2>
          <div className="space-y-6">
            {faq.mainEntity.map((q) => (
              <div key={q.name}>
                <h3 className="font-bold mb-2">{q.name}</h3>
                <p className="text-muted-foreground">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UteHire;