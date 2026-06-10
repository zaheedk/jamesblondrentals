import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Home, Box, Package, MapPin, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';

const SITE_URL = 'https://jamesblond.co.nz';
const PAGE_URL = `${SITE_URL}/truck-hire`;

const cityLinks = [
  { name: 'Auckland', path: '/auckland-truck-rentals-hire', blurb: 'North Shore to South Auckland — 2-tonne and 3-tonne trucks for house moves and trade jobs.' },
  { name: 'West Auckland', path: '/west-auckland-truck-rentals-hire', blurb: 'Henderson, Te Atatū and Westgate pickup options for furniture and house moves.' },
  { name: 'Wellington', path: '/truck-hire-wellington', blurb: 'CBD-friendly truck sizes for inner-city apartments, Hutt Valley and Porirua moves.' },
  { name: 'Christchurch', path: '/truck-hire-christchurch', blurb: 'Affordable furniture and moving trucks across greater Christchurch.' },
  { name: 'Central Christchurch', path: '/central-christchurch-truck-hire', blurb: 'Inner-city CBD branch, easy pickup for short urban moves.' },
  { name: 'Hamilton', path: '/hamilton-truck-rentals-hire', blurb: 'Waikato truck hire for residential, commercial and trade jobs.' },
];

const truckClasses = [
  {
    name: '2 Tonne Box 9m³',
    description: 'Compact box truck ideal for studio and 1-bedroom moves, courier runs and small deliveries.',
    capacity: '9m³',
    licence: 'Standard Class 1 NZ licence',
    path: '/fleet/trucks/2-tonne-box-9m3',
  },
  {
    name: '2 Tonne Box 12m³',
    description: 'Mid-size furniture truck for apartment and 2-bedroom moves.',
    capacity: '12m³',
    licence: 'Standard Class 1 NZ licence',
    path: '/fleet/trucks/2-tonne-box-12m3',
  },
  {
    name: '2 Tonne Box 12m³ + Tail Lift',
    description: 'Hydraulic tail lift up to 400kg for heavy appliances and bulky furniture.',
    capacity: '12m³',
    licence: 'Standard Class 1 NZ licence',
    path: '/fleet/trucks/2-tonne-box-12m3-tail',
  },
  {
    name: '2 Tonne Tipper',
    description: 'Tipper tray for landscaping, garden waste and light construction jobs.',
    capacity: '3.1m tray',
    licence: 'Standard Class 1 NZ licence',
    path: '/fleet/trucks/2-tonne-tipper',
  },
  {
    name: '2 Tonne Box 16m³',
    description: 'Spacious truck for 2-3 bedroom house moves with air conditioning.',
    capacity: '16m³',
    licence: 'Standard Class 1 NZ licence',
    path: '/fleet/trucks/2-tonne-box-16m3',
  },
  {
    name: '3 Tonne Box 18m³ + Tail Lift',
    description: 'Large commercial truck for office and retail relocations.',
    capacity: '18m³',
    licence: 'Class 2 may be required — check with our team',
    path: '/fleet/trucks/3-tonne-box-18m3',
  },
  {
    name: '3 Tonne Box 19m³ + Tail Lift',
    description: 'Our largest truck for full 3+ bedroom house moves.',
    capacity: '19m³',
    licence: 'Class 2 may be required — check with our team',
    path: '/fleet/trucks/3-tonne-box-19m3',
  },
];

const faqs = [
  {
    q: 'How much does it cost to hire a truck in NZ?',
    a: 'James Blond truck hire starts from competitive daily rates — actual price depends on truck size, hire duration, location and any extras like a tail lift or hand trolley. Use our online booking form for an instant quote at your nearest branch.',
  },
  {
    q: 'What is the cheapest way to rent a truck?',
    a: 'Midweek hires are typically cheapest. Pick the smallest truck that comfortably fits your load, book a few days in advance, return on time and refuel before drop-off to avoid surcharges. Check our hot deals page for current discounts.',
  },
  {
    q: 'Do I need a special licence to drive a hire truck?',
    a: 'Most of our 2-tonne box trucks and tippers can be driven on a standard NZ Class 1 car licence. The largest 3-tonne trucks may require a Class 2 licence depending on gross vehicle mass — our team will confirm when you book.',
  },
  {
    q: 'How much can a 4.2m / 12m³ truck fit?',
    a: 'A 12m³ box truck typically fits the contents of a 1-2 bedroom apartment — a queen bed, sofa, dining table, fridge, washing machine and around 30-40 medium boxes.',
  },
  {
    q: 'Where can I pick up a rental truck near me?',
    a: 'James Blond has truck rental branches in Auckland (city and West Auckland), Wellington, Christchurch (greater area and central CBD) and Hamilton. Choose the closest branch from our locations list to book.',
  },
  {
    q: 'Can I hire a truck with a tail lift?',
    a: 'Yes. We offer 2-tonne and 3-tonne box trucks with hydraulic tail lifts (up to 400kg), perfect for moving fridges, washing machines, pianos and heavy furniture without lifting.',
  },
];

const TruckHire = () => {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Truck Hire NZ', item: PAGE_URL },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'James Blond Truck Hire Locations',
    itemListElement: cityLinks.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Truck Hire ${c.name}`,
      url: `${SITE_URL}${c.path}`,
    })),
  };

  const productsLd = truckClasses.map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t.name,
    description: t.description,
    category: 'Truck Rental',
    brand: { '@type': 'Brand', name: 'James Blond Rentals' },
    url: `${SITE_URL}${t.path}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'NZD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'James Blond Rentals' },
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        title="Truck Hire NZ | Furniture & Moving Trucks — James Blond Rentals"
        description="Truck hire across Auckland, Wellington, Christchurch and Hamilton. 2-tonne and 3-tonne box trucks, tippers and tail-lift trucks. Book online for instant rates."
        canonical="/truck-hire"
      />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={itemListLd} />
      <JsonLd data={productsLd} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-10 mb-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Truck Hire NZ — Furniture, Moving & Commercial Trucks</h1>
          <p className="text-lg text-muted-foreground mb-6">
            James Blond Rentals has affordable truck hire across Auckland, Wellington, Christchurch and Hamilton. Choose from 2-tonne and 3-tonne box trucks, tail-lift trucks and tippers — drive on a standard car licence on most models.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/booking">Book a Truck</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/fleet/trucks">View All Trucks</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="tel:0800525663" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> 0800 525 663
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why hire a truck with James Blond?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Modern Fleet', text: 'Late-model trucks serviced regularly and ready to go.' },
            { icon: Home, title: 'Drive On Your Car Licence', text: 'Most 2-tonne models can be driven on a standard NZ Class 1 licence.' },
            { icon: Box, title: 'Tail Lift Options', text: 'Hydraulic tail lifts up to 400kg for heavy furniture & whiteware.' },
            { icon: MapPin, title: 'Branches Nationwide', text: 'Auckland, Wellington, Christchurch & Hamilton pickup points.' },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full inline-flex mb-3">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Truck Hire Near You</h2>
        <p className="text-muted-foreground mb-6">Pick the closest James Blond branch for the best rates and easy pickup.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityLinks.map((c) => (
            <Card key={c.path} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Truck Hire {c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.blurb}</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={c.path} className="flex items-center">
                    View {c.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Truck classes */}
      <section className="mb-12 bg-muted/30 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Our Truck Range</h2>
        <p className="text-muted-foreground mb-6">From compact 9m³ box trucks to 19m³ tail-lift movers — pick the right size for your job.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {truckClasses.map((t) => (
            <Card key={t.path}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-2">
                  <Truck className="h-6 w-6 text-primary mt-1 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{t.description}</p>
                    <ul className="text-sm space-y-1 mb-3">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Capacity: {t.capacity}</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {t.licence}</li>
                    </ul>
                    <Button asChild variant="link" size="sm" className="px-0">
                      <Link to={t.path}>View details <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Truck Hire FAQs</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to book your truck?</h2>
        <p className="mb-6 opacity-90">Instant online quotes across all James Blond branches.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to="/booking">Book Online</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <a href="tel:0800525663">Call 0800 525 663</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TruckHire;