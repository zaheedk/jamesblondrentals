import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Truck, CheckCircle2, MapPin, Phone, Clock, Star, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import JsonLd from '@/components/JsonLd';
import PageSEO from '@/components/PageSEO';
import RelatedLocations from '@/components/RelatedLocations';

const SITE_URL = 'https://www.jamesblond.co.nz';
const PAGE_PATH = '/small-truck-hire-christchurch';

const trucks = [
  {
    name: '2 Tonne Box 9m³ — Small Moving Truck',
    tagline: 'Best for studio & 1-bedroom moves',
    specs: ['Box 3.1m × 1.6m × 1.8m', 'Automatic transmission', 'Car licence — no HT required', 'From $35/hr'],
    path: '/fleet/trucks/2-tonne-box-9m3',
    image: '/lovable-uploads/072db196-b7e0-4726-bd11-9dd208534e9e.png',
  },
  {
    name: '2 Tonne Box 12m³',
    tagline: 'Perfect for 1-2 bedroom apartments',
    specs: ['Box 3.1m × 1.75m × 2.05m', 'Automatic transmission', 'Fits queen bed, sofa, fridge + 30 boxes', 'Same-day pickup'],
    path: '/fleet/trucks/2-tonne-box-12m3',
    image: '/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png',
  },
  {
    name: '2 Tonne Box 12m³ + Tail Lift',
    tagline: 'For heavy fridges, washers & pianos',
    specs: ['400kg hydraulic tail lift', 'Automatic transmission', 'Skip the lifting', 'Car licence approved'],
    path: '/fleet/trucks/2-tonne-box-12m3-tail',
    image: '/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png',
  },
];

const suburbs = [
  'Riccarton', 'Addington', 'Papanui', 'Hornby', 'Merivale', 'Fendalton',
  'Ilam', 'Sydenham', 'St Albans', 'Halswell', 'Rangiora', 'Rolleston',
  'Kaiapoi', 'Belfast', 'Sumner', 'New Brighton',
];

const testimonials = [
  { name: 'Sarah M.', suburb: 'Riccarton', rating: 5, text: 'Booked a small truck for our 1-bedroom apartment move to Addington. Pickup at Moorhouse Ave took 10 minutes — friendly team, spotless truck, and the automatic made it easy for my partner to drive. Half the price of a removal quote.' },
  { name: 'James T.', suburb: 'Rolleston', rating: 5, text: 'Needed a small truck same-day from the Airport branch to shift a fridge and washing machine out to Rolleston. Tail lift made it a one-person job. Straightforward booking, no surprises on the bill.' },
  { name: 'Priya K.', suburb: 'Papanui', rating: 5, text: 'The 9m³ was the perfect size for our student flat move. Way cheaper than a full mover, and I could drive it on my car licence. Will book again next semester.' },
];

const faqs = [
  {
    q: 'How much is small truck hire in Christchurch?',
    a: 'Small truck hire in Christchurch starts from $35/hr with a 2-tonne 9m³ or 12m³ box truck. Daily rates are available for longer moves. Prices include GST, unlimited hours on daily rates, and standard insurance — a mileage charge applies per km driven.',
  },
  {
    q: 'What size truck do I need for a Christchurch apartment move?',
    a: 'For a studio or 1-bedroom Christchurch apartment, a 9m³ small box truck is usually plenty. For a 1-2 bedroom flat with a queen bed, sofa, fridge and around 30 boxes, step up to the 12m³. Larger 3-bedroom houses need a 16m³ or 19m³ truck.',
  },
  {
    q: 'Can I drive a small hire truck on my car licence in NZ?',
    a: 'Yes. All of our small trucks (2-tonne 9m³, 12m³ and 12m³ tail lift) can be driven on a standard NZ Class 1 car licence — no truck or HT licence required. They\'re automatic transmission and easy to drive around Christchurch.',
  },
  {
    q: 'Where can I pick up a small truck in Christchurch?',
    a: 'James Blond has two Christchurch pickup points: the Airport branch at 17/25 Logistics Drive, Harewood (best for north/west suburbs like Papanui, Rangiora, Rolleston and Belfast) and the Central branch at 515 Moorhouse Avenue (best for CBD, Riccarton, Addington, Sydenham and eastern suburbs).',
  },
  {
    q: 'Do you offer same-day small truck hire in Christchurch?',
    a: 'Yes — same-day small truck hire is available at both Christchurch branches, subject to availability. Call 0800 525 663 or book online and we\'ll usually have you on the road within the hour.',
  },
  {
    q: 'Is a tail lift worth it for a small move?',
    a: 'If you\'re moving whiteware (fridge, washing machine, dryer), a piano or a heavy sofa on your own, yes — the 400kg hydraulic tail lift on our 12m³ turns a two-person lift into a one-person job. For a light apartment with boxes only, the standard 9m³ or 12m³ is cheaper.',
  },
  {
    q: 'What areas around Christchurch do you cover?',
    a: 'Our Christchurch trucks are used every day across Riccarton, Addington, Papanui, Hornby, Merivale, Fendalton, Ilam, Sydenham, St Albans, Halswell, Sumner, New Brighton, plus Rangiora, Rolleston, Kaiapoi and greater Canterbury.',
  },
];

const SmallTruckHireChristchurch = () => {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Small Truck Hire Christchurch',
    name: 'Small Truck Hire Christchurch — James Blond Rentals',
    url: `${SITE_URL}${PAGE_PATH}`,
    areaServed: { '@type': 'City', name: 'Christchurch' },
    provider: {
      '@type': 'AutoRental',
      name: 'James Blond Rentals',
      url: 'https://www.jamesblond.co.nz',
      telephone: '+64800525663',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '17/25 Logistics Drive, Harewood',
        addressLocality: 'Christchurch',
        postalCode: '8544',
        addressCountry: 'NZ',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '412',
      },
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'NZD',
      lowPrice: '35',
      highPrice: '89',
      offerCount: '3',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Truck Hire', item: `${SITE_URL}/truck-hire` },
      { '@type': 'ListItem', position: 3, name: 'Truck Hire Christchurch', item: `${SITE_URL}/truck-hire-christchurch` },
      { '@type': 'ListItem', position: 4, name: 'Small Truck Hire Christchurch', item: `${SITE_URL}${PAGE_PATH}` },
    ],
  };

  return (
    <>
      <PageSEO
        title="Small Truck Hire Christchurch from $35/Hr | 9m³ & 12m³ Movers"
        description="Small truck hire Christchurch from $35/hr. 9m³ & 12m³ box trucks, tail-lift option, same-day pickup at Airport & Moorhouse Ave. Drive on a car licence — book online."
        canonical={PAGE_PATH}
      />
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-10 mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                <Star className="h-4 w-4 fill-current" /> Rated 4.8/5 by 412+ Christchurch customers
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Small Truck Hire Christchurch — from $35/hr
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Need a <strong>small truck for a Christchurch move</strong>? Our 9m³ and 12m³ box trucks are the sweet spot for apartments, flats and 1–2 bedroom houses. Automatic, drive on a car licence, same-day pickup from the Airport or Moorhouse Ave branch.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg"><Link to="/booking">Book Small Truck</Link></Button>
                <Button asChild size="lg" variant="outline">
                  <a href="tel:0800525663" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> 0800 525 663
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Car licence OK</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Same-day pickup</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> No hidden fees</span>
              </div>
            </div>
            <img
              src="/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png"
              alt="Small 12m³ box truck for hire in Christchurch"
              className="rounded-lg shadow-lg w-full"
              loading="eager"
              width="600"
              height="400"
            />
          </div>
        </section>

        {/* Why small truck */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why hire a small truck in Christchurch?</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Easy to drive', text: 'Automatic transmission and car-licence approved — no HT licence needed for a Christchurch small truck.' },
              { icon: Clock, title: 'Cheaper by the hour', text: 'From $35/hr — half the cost of a removal company for a 1–2 hour local move.' },
              { icon: MapPin, title: '2 pickup points', text: 'Airport (Harewood) for north/west jobs. Moorhouse Ave for CBD & east.' },
              { icon: Package, title: 'Fits an apartment', text: 'A 12m³ small truck fits a queen bed, sofa, fridge and ~30 boxes.' },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardContent className="pt-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full inline-flex mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trucks */}
        <section className="mb-12 bg-muted/30 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Our small truck range</h2>
          <p className="text-muted-foreground mb-6">Three small truck sizes to match your Christchurch move.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {trucks.map((t) => (
              <Card key={t.path} className="flex flex-col">
                <img src={t.image} alt={t.name} className="rounded-t-lg w-full h-48 object-cover" loading="lazy" width="500" height="300" />
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1">{t.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-3">{t.tagline}</p>
                  <ul className="text-sm space-y-1 mb-4 flex-1">
                    {t.specs.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={t.path}>Details</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link to="/booking">Book</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Local proof */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">What Christchurch customers say</h2>
          <p className="text-muted-foreground mb-6">Real reviews from small truck hires around Canterbury.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-2 text-primary">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-3">"{t.text}"</p>
                  <p className="text-sm font-semibold">{t.name} <span className="text-muted-foreground font-normal">— {t.suburb}, Christchurch</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Suburbs served */}
        <section className="mb-12 bg-muted/30 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Christchurch suburbs we serve</h2>
          <p className="text-muted-foreground mb-4">Small truck pickups and drop-offs across greater Christchurch and Canterbury:</p>
          <div className="flex flex-wrap gap-2">
            {suburbs.map((s) => (
              <span key={s} className="bg-background border border-border px-3 py-1 rounded-full text-sm">{s}</span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Small truck hire Christchurch — FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Related */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Other Christchurch hire options</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/truck-hire-christchurch" className="block p-4 border rounded-lg hover:border-primary">
              <h3 className="font-semibold flex items-center gap-2">All Christchurch Trucks <ArrowRight className="h-4 w-4" /></h3>
              <p className="text-sm text-muted-foreground">Full range including 16m³ and 19m³ movers.</p>
            </Link>
            <Link to="/christchurch-van-hire" className="block p-4 border rounded-lg hover:border-primary">
              <h3 className="font-semibold flex items-center gap-2">Christchurch Van Hire <ArrowRight className="h-4 w-4" /></h3>
              <p className="text-sm text-muted-foreground">Smaller cargo vans for lighter loads.</p>
            </Link>
            <Link to="/trailer-hire-christchurch" className="block p-4 border rounded-lg hover:border-primary">
              <h3 className="font-semibold flex items-center gap-2">Christchurch Trailer Hire <ArrowRight className="h-4 w-4" /></h3>
              <p className="text-sm text-muted-foreground">Tow-behind option if you have a hitch.</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book your small Christchurch truck</h2>
          <p className="mb-6 opacity-90">Same-day pickup from Airport or Moorhouse Ave — from $35/hr.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/booking">Book Online</Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="tel:0800525663">Call 0800 525 663</a>
            </Button>
          </div>
        </section>

        <RelatedLocations vehicleType="trucks" title="Truck hire elsewhere in NZ" />
      </div>
    </>
  );
};

export default SmallTruckHireChristchurch;