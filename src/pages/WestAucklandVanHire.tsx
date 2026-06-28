import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Check, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import TruckQuoteSearchForm from '@/components/home/TruckQuoteSearchForm';

const suburbs = [
  'Henderson', 'New Lynn', 'Te Atatu', 'Massey', 'Swanson',
  'Westgate', 'Hobsonville', 'Kelston', 'Glen Eden', 'Titirangi',
  'Waitakere', 'Ranui',
];

const faq = [
  {
    q: 'How much is van hire in West Auckland?',
    a: 'Standard cargo vans start from $69/day with unlimited kilometres. Jumbo vans for bigger loads from $99/day. Same-day pickup available from our Kelston branch — just minutes from Henderson, New Lynn and Te Atatu.',
  },
  {
    q: 'Where do I pick up the van in West Auckland?',
    a: 'Our nearest branch is James Blond Kelston — 5–15 minutes from Henderson, New Lynn, Te Atatu, Massey, Swanson, Westgate and Hobsonville. We also have Auckland Airport and Penrose branches if you need a different pickup point.',
  },
  {
    q: 'Do I need a special licence to drive your vans?',
    a: 'No — all our cargo vans (Standard, Premium and Jumbo) can be driven on a standard NZ Class 1 car licence. Overseas licences in English are also accepted.',
  },
  {
    q: 'Can I hire a van for one day only?',
    a: 'Yes. We offer daily, weekend and weekly van hire from our West Auckland branch. Pick up in the morning and return same-day, or keep it for the weekend.',
  },
  {
    q: 'Can I move house with one of your vans?',
    a: 'Absolutely — our Jumbo Van (3300mm long, 1900mm high) is ideal for 1–2 bedroom apartment moves. For bigger houses, look at our truck hire range from $35/hr.',
  },
];

const WestAucklandVanHire = () => {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jamesblondrentals.lovable.app/' },
      { '@type': 'ListItem', position: 2, name: 'Van Hire', item: 'https://jamesblondrentals.lovable.app/fleet/vans' },
      { '@type': 'ListItem', position: 3, name: 'West Auckland Van Hire' },
    ],
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        title="Van Hire West Auckland from $69/day — Henderson, New Lynn, Te Atatu"
        description="Cheap van hire in West Auckland — cargo, moving & jumbo vans from $69/day with unlimited km. Pickup minutes from Henderson, New Lynn, Te Atatu, Massey & Swanson. Drive on a car licence."
        canonical="/west-auckland-van-hire"
      />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-10 mb-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Van Hire West Auckland — From $69/day
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Same-day cargo, moving and jumbo van hire from our Kelston branch — minutes
              from Henderson, New Lynn, Te Atatu, Massey, Swanson and Westgate. Unlimited
              kilometres on standard vans, drive on a normal car licence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#booking">Get a Quote</a></Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+6498385300"><Phone className="mr-2 h-4 w-4" /> Call Kelston</a>
              </Button>
            </div>
          </div>
          <img
            src="/lovable-uploads/3cb301ec-ead2-492a-a9a0-3361c1876b76.png"
            alt="Cargo van for hire in West Auckland — Henderson, New Lynn, Te Atatu"
            className="rounded-lg shadow-lg w-full"
            loading="eager"
          />
        </div>
      </section>

      {/* Quick benefits */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Truck, t: 'From $69/day', s: 'Standard cargo van' },
          { icon: MapPin, t: 'Kelston branch', s: 'Near Henderson & New Lynn' },
          { icon: Clock, t: 'Same-day pickup', s: 'Book online or call' },
          { icon: Check, t: 'Car licence OK', s: 'No special licence needed' },
        ].map(({ icon: Icon, t, s }) => (
          <Card key={t}>
            <CardContent className="pt-6 text-center">
              <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-bold">{t}</div>
              <div className="text-xs text-muted-foreground">{s}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Van choices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Which van do I need?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Standard Cargo Van</h3>
              <p className="text-sm text-muted-foreground mb-3">Toyota Hiace · 2.8m × 1.4m × 1.5m · 1,000kg payload</p>
              <p className="mb-4">Perfect for furniture deliveries, courier work, and 1-bedroom apartment moves around West Auckland. Unlimited km.</p>
              <p className="text-2xl font-bold text-primary mb-3">From $69/day</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/fleet/vans/standard-van">View details</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Premium Van (Automatic)</h3>
              <p className="text-sm text-muted-foreground mb-3">Toyota Hiace Auto · twin side doors</p>
              <p className="mb-4">Easy automatic transmission — great for tradies and longer hires. 100 free km per day.</p>
              <p className="text-2xl font-bold text-primary mb-3">From $79/day</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/fleet/vans/premium-van">View details</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Jumbo Van Diesel</h3>
              <p className="text-sm text-muted-foreground mb-3">Ford Transit / Fiat Ducato · 3.3m × 1.6m × 1.9m · 1,350kg</p>
              <p className="mb-4">Best for 1–2 bedroom moves, big furniture, or commercial loads. Stand up inside.</p>
              <p className="text-2xl font-bold text-primary mb-3">From $99/day</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/fleet/vans/jumbo-van">View details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Suburbs */}
      <section className="mb-12 bg-muted/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">We serve all of West Auckland</h2>
        <p className="mb-4 text-muted-foreground">
          Our Kelston branch is the closest van hire to most West Auckland suburbs —
          quick pickup and return from:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {suburbs.map((s) => (
            <div key={s} className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-primary" /> {s}
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Book your West Auckland van</h2>
        <TruckQuoteSearchForm />
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">West Auckland van hire — FAQ</h2>
        <div className="space-y-4">
          {faq.map((f) => (
            <Card key={f.q}>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">{f.q}</h3>
                <p className="text-muted-foreground">{f.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Related pages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/west-auckland-truck-rentals-hire', label: 'West Auckland Truck Hire' },
            { to: '/west-auckland-cargo-van-rentals-hire', label: 'West Auckland Cargo Vans' },
            { to: '/auckland-van-hire', label: 'Auckland Van Hire' },
            { to: '/moving-truck-hire-auckland', label: 'Moving Truck Auckland' },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="border rounded-lg p-3 hover:border-primary hover:bg-primary/5 text-sm font-medium">
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WestAucklandVanHire;