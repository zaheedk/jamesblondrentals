import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Fuel, ShieldCheck, Car, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import RelatedLocations from '@/components/RelatedLocations';

const SITE_URL = 'https://www.jamesblond.co.nz';
const PAGE_URL = `${SITE_URL}/car-hire-auckland`;

const fleet = [
  {
    name: 'Premium economy cars',
    from: '$49',
    seats: '5 seats',
    blurb:
      'Modern automatic hatchbacks — the cheapest way to get around Auckland. Easy to park in the CBD, Ponsonby and Newmarket, and light on fuel on the motorway.',
    to: '/fleet/cars/premium-economy',
  },
  {
    name: 'Premium midsize cars',
    from: '$59',
    seats: '5 seats',
    blurb:
      'A bigger boot and a quieter highway ride for Coromandel, Rotorua and Bay of Islands road trips, or a full week of work driving.',
    to: '/fleet/cars/premium-midsize',
  },
  {
    name: 'Compact SUVs',
    from: '$79',
    seats: '5 seats',
    blurb:
      'Higher ride height and more luggage room for families, gravel driveways and winter trips south. Popular with visitors touring the North Island.',
    to: '/fleet/cars/premium-compact-suv',
  },
  {
    name: '7-seaters & minibuses',
    from: 'On request',
    seats: '7–12 seats',
    blurb:
      'Seven-seat people movers and 12-seat minibuses for families, sports teams, weddings and airport runs across Auckland.',
    to: '/minibus-hire-auckland',
  },
];

const areas = [
  {
    title: 'Car hire for Central Auckland & the CBD',
    body: 'City-centre customers usually collect from Glen Eden or the Airport branch and keep the car for a few days of meetings, weekend trips or an insurance replacement period. Both branches are a straightforward run in from the CBD, Ponsonby, Grey Lynn and Newmarket.',
    list: 'Auckland CBD · Ponsonby · Grey Lynn · Newmarket · Parnell',
  },
  {
    title: 'Car rental for West Auckland',
    body: 'Our Glen Eden branch on Great North Road is the local option for West Auckland — Henderson, New Lynn, Titirangi and Massey are all within about 15 minutes. Handy for same-day hires when a family car is off the road.',
    list: 'Glen Eden · Henderson · New Lynn · Titirangi · Massey · Te Atatū',
  },
  {
    title: 'Car hire for South Auckland & the Airport',
    body: 'The Mangere branch sits minutes from Auckland Airport and serves Manukau, Papatoetoe, Ōtāhuhu and Papakura. Best pick for flights, cruise arrivals and anyone heading south on SH1.',
    list: 'Māngere · Manukau · Papatoetoe · Ōtāhuhu · Papakura · Wiri',
  },
  {
    title: 'Car rental for the North Shore',
    body: 'North Shore customers cross the bridge for weekly rates that beat the in-terminal brands. Takapuna, Albany and Silverdale customers regularly book online and collect on their way through to the city.',
    list: 'Takapuna · Northcote · Albany · Browns Bay · Silverdale',
  },
];

const faqs = [
  {
    question: 'How much is car hire in Auckland?',
    answer:
      'Car rental in Auckland starts from $49 per day for a premium economy car, around $59 for a midsize car and from $79 for a compact SUV. Weekly and midweek pickups bring the daily rate down further — the booking form shows live pricing for your exact dates.',
  },
  {
    question: 'Where are your Auckland car rental branches?',
    answer:
      'We have two Auckland branches: 4004 Great North Road, Glen Eden, Auckland 0602 (West Auckland) and 203 Kirkbride Road, Māngere, Auckland 2022 (minutes from Auckland Airport). Both are open 8am–5pm daily and can be reached on 0800 525 663.',
  },
  {
    question: 'Do you hire cars at Auckland Airport?',
    answer:
      'Yes. Our Māngere branch on Kirkbride Road is a few minutes from the Auckland Airport terminals, with a free shuttle on request — call 0800 525 663 once you have your bags and we will collect you.',
  },
  {
    question: 'Can I hire a cheap car in Auckland for a week?',
    answer:
      'Weekly hires are our best-value car rates in Auckland. Collecting Monday to Wednesday is cheaper than a Friday pickup, and every hire includes 8 cents per litre off fuel at participating Mobil stations.',
  },
  {
    question: 'What do I need to hire a car in Auckland?',
    answer:
      'A full, current driver licence (New Zealand or overseas — an English translation or International Driving Permit is required if your licence is not in English), a credit or debit card in the hirer\'s name, and you must meet our minimum age requirements.',
  },
  {
    question: 'Can I drop the car off in another New Zealand city?',
    answer:
      'Yes. One-way car hire from Auckland to Hamilton, Wellington and Christchurch is available on request. Tell us your route when you book and we will confirm any one-way fee up front.',
  },
];

const branches = [
  {
    name: 'Auckland — Glen Eden (West Auckland)',
    address: ['4004 Great North Road', 'Glen Eden', 'Auckland 0602'],
    email: 'auckland@jamesblond.co.nz',
    contact: '/contact/auckland',
  },
  {
    name: 'Auckland Airport — Māngere',
    address: ['203 Kirkbride Road', 'Māngere', 'Auckland 2022'],
    email: 'aucklandairport@jamesblond.co.nz',
    contact: '/contact/auckland-airport',
  },
];

const AucklandCarHire = () => {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const businessLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'James Blond Rentals — Auckland Car Hire',
    url: PAGE_URL,
    image: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
    telephone: '+64800525663',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4004 Great North Road',
      addressLocality: 'Glen Eden, Auckland',
      addressRegion: 'Auckland',
      postalCode: '0602',
      addressCountry: 'NZ',
    },
    areaServed: [
      'Auckland',
      'Auckland CBD',
      'West Auckland',
      'South Auckland',
      'North Shore',
      'Auckland Airport',
      'Manukau',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    makesOffer: fleet.map((f) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: `${f.name} — Auckland car hire` },
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        title="Car Hire Auckland from $49/Day — Car Rental, No Hidden Fees"
        description="Car hire in Auckland from $49/day. Economy cars, SUVs, 7-seaters and minibuses from our Glen Eden and Auckland Airport branches. No hidden fees — book online or call 0800 525 663."
        canonical="/car-hire-auckland"
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Car Hire Auckland', url: PAGE_URL },
        ]}
      />
      <JsonLd data={faqLd} />
      <JsonLd data={businessLd} />

      {/* Hero */}
      <section className="bg-primary/5 rounded-lg p-6 md:p-10 mb-12">
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Car Hire Auckland — Car Rental from $49 a Day</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Local Auckland car rental from our Glen Eden and Auckland Airport branches. Economy cars, midsize
            sedans, SUVs, 7-seat people movers and 12-seat minibuses — for customers across the CBD, West
            Auckland, South Auckland, the North Shore and Auckland Airport.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {[
              'Cars from $49/day, no hidden fees',
              'Daily, weekly and midweek rates',
              'Free 8c/litre Mobil fuel discount',
              'One-way hire to Hamilton, Wellington & Christchurch',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="bg-primary p-4 text-primary-foreground text-center rounded-t-lg">
                  <h2 className="text-xl font-bold">Check Auckland car availability</h2>
                </div>
                <div className="p-4">
                  <SearchForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fleet & rates */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Auckland car rental rates &amp; fleet</h2>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Indicative daily rates for hires collected from an Auckland branch. Longer hires and midweek pickups
          are cheaper per day — the booking form above shows live pricing for your dates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleet.map((v) => (
            <Card key={v.name} className="flex flex-col">
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  {v.seats.includes('12') ? (
                    <Users className="h-5 w-5 text-primary" />
                  ) : (
                    <Car className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm text-muted-foreground">{v.seats}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{v.name}</h3>
                <p className="text-2xl font-bold text-primary mb-3">
                  {v.from}
                  {v.from.startsWith('$') && (
                    <span className="text-sm font-normal text-muted-foreground"> /day</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground flex-1">{v.blurb}</p>
                <Button variant="link" className="justify-start px-0 mt-3" asChild>
                  <Link to={v.to}>
                    View options <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Full rate card, kilometre allowances and insurance options are on our{' '}
          <Link to="/price-guide" className="text-primary hover:underline">
            price guide
          </Link>
          .
        </p>
      </section>

      <Separator className="my-8" />

      {/* Cheap car hire intent */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Cheap car hire in Auckland — how to get the lowest rate</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <Clock className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Collect midweek</h3>
              <p className="text-sm text-muted-foreground">
                Monday to Wednesday pickups are the quietest days in Auckland, so that is where our best rates
                and early-week discounts land. Shifting a Friday pickup to a Thursday often saves real money.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Fuel className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Take the fuel discount</h3>
              <p className="text-sm text-muted-foreground">
                Every hire includes 8 cents off per litre at participating Mobil stations — worth having across a
                week of Auckland motorway driving.{' '}
                <Link to="/hot-deals/mobil-fuel-discount" className="text-primary hover:underline">
                  See the deal
                </Link>
                .
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <ShieldCheck className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Book direct, not via a broker</h3>
              <p className="text-sm text-muted-foreground">
                Booking on this site means no broker margin, no surprise counter fees and an Auckland phone
                number a local answers. What you see at checkout is what you pay.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Area intent */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Car rental across Auckland</h2>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Two branches, the whole region. Here is how customers across Auckland usually use us.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {areas.map((a) => (
            <Card key={a.title}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{a.body}</p>
                <p className="text-xs text-muted-foreground">{a.list}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Airport + one way */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Auckland Airport car hire</h3>
              <p className="text-muted-foreground mb-4">
                Our Māngere branch on Kirkbride Road is minutes from the domestic and international terminals,
                with a free shuttle on request — no in-terminal premium and no long counter queue.
              </p>
              <Button variant="outline" asChild>
                <Link to="/car-rental-auckland-airport">Auckland Airport pickup details</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">One-way car hire from Auckland</h3>
              <p className="text-muted-foreground mb-4">
                Driving the country one way? We run one-way hires between Auckland and Hamilton, Wellington and
                Christchurch, so you can fly in one end and drive out the other.
              </p>
              <Button variant="outline" asChild>
                <Link to="/one-way-car-hire/auckland-to-wellington">See one-way routes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Visitors */}
      <section className="mb-12">
        <div className="bg-muted/40 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Visiting Auckland from overseas?</h2>
          <p className="text-muted-foreground mb-4 max-w-3xl">
            A full overseas licence in English is accepted in New Zealand for up to 12 months, our fleet is
            almost entirely automatic, and we do not charge an overseas card surcharge.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link to="/car-hire-auckland-airport-from-australia">Hiring in Auckland from Australia</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/car-hire-new-zealand-from-uk">NZ car hire for UK visitors</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/blog/driving-in-new-zealand-with-overseas-license">Driving here on an overseas licence</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bigger vehicles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-3">Need something bigger than a car?</h2>
        <p className="text-muted-foreground mb-4 max-w-3xl">
          We are Auckland&apos;s commercial-vehicle specialists as well as a car rental company. Moving house or
          shifting stock is usually cheaper in one van or truck run than several car trips.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/van-hire-auckland">Van hire Auckland</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auckland-truck-rentals-hire">Truck hire Auckland</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/minibus-hire-auckland">Minibus hire Auckland</Link>
          </Button>
        </div>
      </section>

      {/* Branch NAP */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland branch information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {branches.map((b) => (
            <Card key={b.name}>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">{b.name}</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    {b.address.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="tel:0800525663" className="hover:text-primary">
                    0800 525 663
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${b.email}`} className="hover:text-primary">
                    {b.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-1 text-primary" />
                  <p>Open 7 days, 8:00am – 5:00pm</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to={b.contact}>Branch details &amp; directions</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland car hire FAQs</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.question} className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">{f.question}</h3>
              <p className="text-muted-foreground">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <RelatedLocations vehicleType="cars" currentCity="auckland" title="More hire options in Auckland" />
    </div>
  );
};

export default AucklandCarHire;
