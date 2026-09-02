import React from 'react';
import { Link } from 'react-router-dom';
import WellingtonInternalLinks from '@/components/WellingtonInternalLinks';
import WellingtonBreadcrumb from '@/components/WellingtonBreadcrumb';
import { MapPin, Phone, Mail, ArrowRight, Fuel, Clock, Users, Car, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';

const SITE_URL = 'https://www.jamesblond.co.nz';

const fleet = [
  {
    name: 'Economy & compact cars',
    from: '$45',
    seats: '4–5 seats',
    blurb: 'Small hatchbacks built for Wellington parking, hill starts and cheap fuel bills. The default choice for city trips and short hires.',
    to: '/vehicles',
  },
  {
    name: 'Medium & family cars',
    from: '$55',
    seats: '5 seats',
    blurb: 'More boot space and a quieter ride for Wairarapa, Kāpiti and Palmerston North road trips, or a week of work driving.',
    to: '/vehicles',
  },
  {
    name: 'SUVs & AWD',
    from: '$79',
    seats: '5 seats',
    blurb: 'Higher ride height and all-wheel drive for winter travel over the Remutakas, ski trips and gravel-road holiday houses.',
    to: '/vehicles',
  },
  {
    name: 'People movers & 7-seaters',
    from: 'On request',
    seats: '7–12 seats',
    blurb: 'Seven-seat people movers and 12-seat minibuses for families, sports teams and wedding parties across the Wellington region.',
    to: '/minibus-hire-wellington',
  },
];

const suburbs = [
  {
    title: 'Car rental for Lower Hutt & Petone',
    body: 'Our Te Aro branch is about 15 minutes from Lower Hutt and 10 from Petone via SH2. Hutt Valley customers regularly collect here for weekly work hires, insurance replacement periods and weekend trips — it is usually quicker than waiting on a Hutt-based depot to have the right car free.',
    areas: 'Petone · Lower Hutt · Naenae · Wainuiomata · Upper Hutt',
  },
  {
    title: 'Car hire for Porirua, Tawa & Johnsonville',
    body: 'Porirua sits 20 minutes north of the branch on SH1. If you are between cars, hosting visitors or need a second vehicle for a few days, we can have an economy car or SUV ready the same day for pickup on your way through town.',
    areas: 'Johnsonville · Tawa · Porirua · Whitby · Plimmerton',
  },
  {
    title: 'Car rental on the Kāpiti Coast',
    body: 'Paraparaumu and Waikanae are a 40-minute run down the Kāpiti Expressway. Coast customers often pair a car hire with a one-way drop in Auckland or Christchurch — ask the branch when you book and we will price the route for you.',
    areas: 'Raumati · Paraparaumu · Waikanae · Ōtaki',
  },
];

const faqs = [
  {
    question: 'How much is car hire in Wellington?',
    answer:
      'Car rental in Wellington starts from $45 per day for an economy car, around $55 for a medium car and from $79 for an SUV. Multi-day and weekly hires bring the daily rate down further, and midweek pickups are usually the cheapest days of the week to collect.',
  },
  {
    question: 'Where is your Wellington car rental branch?',
    answer:
      'We are at 24 Abel Smith Street, Te Aro, Wellington 6011 — a few minutes from the CBD, Te Papa and the waterfront, and roughly 10 minutes from Wellington Airport by taxi or rideshare.',
  },
  {
    question: 'Do you rent cars at Wellington Airport?',
    answer:
      'We do not have an in-terminal desk at Wellington Airport, but our Te Aro branch is about 10 minutes away. Call the branch when your flight lands and we will have the car keys ready when you arrive.',
  },
  {
    question: 'Can I hire a 7-seater or people mover in Wellington?',
    answer:
      'Yes. We hire 7-seat people movers and 10 and 12-seat minibuses from the Wellington branch. Rates for the larger seaters vary with demand, so they are quoted on request — call 0800 525 663 or use the minibus hire page.',
  },
  {
    question: 'What do I need to hire a car in Wellington?',
    answer:
      'A full, current driver licence (New Zealand or overseas — an English translation or International Driving Permit is required if your licence is not in English), a credit or debit card in the hirer\'s name, and you must meet our minimum age requirements.',
  },
  {
    question: 'Can I drop the car off in another city?',
    answer:
      'Yes. One-way car hire from Wellington to Auckland, Hamilton, Christchurch and other branches is available on request. Tell us your route when you book and we will confirm any one-way fee up front.',
  },
];

const CarRentalWellington = () => {
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
    name: 'James Blond Rentals — Wellington Car Hire',
    url: `${SITE_URL}/car-rental-wellington-new-zealand`,
    image: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
    telephone: '+64800525663',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '24 Abel Smith Street',
      addressLocality: 'Wellington',
      addressRegion: 'Wellington',
      postalCode: '6011',
      addressCountry: 'NZ',
    },
    areaServed: ['Wellington', 'Lower Hutt', 'Upper Hutt', 'Petone', 'Porirua', 'Tawa', 'Johnsonville', 'Kāpiti Coast'],
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
      itemOffered: { '@type': 'Service', name: `${f.name} — Wellington car hire` },
    })),
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <WellingtonBreadcrumb currentLabel="Wellington" isHub={true} />
        <PageSEO
          title="Car Hire Wellington from $45/Day — Car Rental, No Hidden Fees"
          description="Car hire in Wellington from $45/day. Economy cars, SUVs, 7-seaters and people movers from our Te Aro branch, serving Lower Hutt, Petone, Porirua and Kāpiti. No hidden fees — book online or call 0800 525 663."
          canonical="/car-rental-wellington-new-zealand"
        />
        <JsonLd data={faqLd} />
        <JsonLd data={businessLd} />

        {/* Hero */}
        <section className="bg-primary/5 rounded-lg p-6 md:p-10 mb-12">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Car Hire Wellington — Car Rental from $45 a Day
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Local car rental from our Te Aro branch, five minutes from the Wellington CBD and ten from Wellington
              Airport. Economy cars, family cars, SUVs, 7-seat people movers and 12-seat minibuses — with pickup for
              customers across Wellington city, Lower Hutt, Petone, Upper Hutt, Porirua, Tawa, Johnsonville and the
              Kāpiti Coast.
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {[
                'Cars from $45/day, no hidden fees',
                'Daily, weekly and midweek rates',
                'Free 8c/litre Mobil fuel discount',
                'One-way hire to other NZ branches',
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
                    <h2 className="text-xl font-bold">Check Wellington car availability</h2>
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
          <h2 className="text-2xl font-bold mb-2">Wellington car rental rates &amp; fleet</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Indicative daily rates for hires collected from our Wellington branch. Longer hires and midweek pickups are
            cheaper per day — the booking form above shows live pricing for your exact dates.
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
                    {v.from.startsWith('$') && <span className="text-sm font-normal text-muted-foreground"> /day</span>}
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
          <h2 className="text-2xl font-bold mb-6">Cheap car hire in Wellington — how to get the lowest rate</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Collect midweek</h3>
                <p className="text-sm text-muted-foreground">
                  Monday to Wednesday pickups are the quietest days in Wellington, so that is where our best rates and
                  early-week discounts land. Shifting a Friday pickup to a Thursday often saves real money.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Fuel className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Take the fuel discount</h3>
                <p className="text-sm text-muted-foreground">
                  Every hire includes 8 cents off per litre at participating Mobil stations. Over a week of Wellington
                  and Wairarapa driving that quietly takes a chunk off the total cost.{' '}
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
                  Booking on this site means no broker margin, no surprise counter fees and a Wellington phone number
                  that a local answers. What you see at checkout is what you pay.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Suburb / area intent */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Car rental across the Wellington region</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            One branch, the whole region. Here is how customers outside the city centre usually use us.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {suburbs.map((s) => (
              <Card key={s.title}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.body}</p>
                  <p className="text-xs text-muted-foreground">{s.areas}</p>
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
                <h3 className="text-xl font-semibold mb-3">Wellington Airport car hire</h3>
                <p className="text-muted-foreground mb-4">
                  Our Te Aro branch is roughly 10 minutes from the Wellington Airport (WLG) terminal by taxi or
                  rideshare — no shuttle queue, no in-terminal premium. Give the branch a call when you land and the car
                  will be waiting.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/airport/wellington">Wellington Airport pickup details</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">One-way car hire from Wellington</h3>
                <p className="text-muted-foreground mb-4">
                  Driving the country one way? We run one-way hires between Wellington and Auckland, Hamilton and
                  Christchurch, so you can fly in one end and drive out the other.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/one-way-car-hire/wellington-to-auckland">See one-way routes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Also need a van or truck */}
        <section className="mb-12">
          <div className="bg-muted/40 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-3">Need something bigger than a car?</h2>
            <p className="text-muted-foreground mb-4 max-w-3xl">
              We are Wellington&apos;s commercial-vehicle specialists as well as a car rental company. If you are moving
              house or shifting stock, a van or small truck is usually cheaper and faster than multiple car trips.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/van-hire-wellington">Van hire Wellington</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/truck-hire-wellington">Truck hire Wellington</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/minibus-hire-wellington">Minibus hire Wellington</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Branch Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Wellington branch information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 text-primary" />
                    <div>
                      <p className="font-medium">Address:</p>
                      <p>24 Abel Smith Street</p>
                      <p>Te Aro</p>
                      <p>Wellington 6011</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone:</p>
                      <a href="tel:0800525663" className="hover:text-primary">0800 525 663</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email:</p>
                      <a href="mailto:wellington@jamesblond.co.nz" className="hover:text-primary">
                        wellington@jamesblond.co.nz
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Opening hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Saturday:</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>After hours pick up and drop off available on request</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Map */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Where to find us</h2>
              <div className="aspect-video">
                <iframe
                  title="James Blond Wellington branch location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.048034246072!2d174.90435287674043!3d-41.23354017131868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d38abe0ba3b16a5%3A0x8e5b3b5c2fec3821!2s24%20Abel%20Smith%20St%2C%20Te%20Aro%2C%20Wellington%206011!5e0!3m2!1sen!2snz!4v1682305436010!5m2!1sen!2snz"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Things to do */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Where Wellington customers drive</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="mb-4 text-muted-foreground">
                Wellington is compact, but the good driving starts as soon as you leave it. Most of our car hires head
                out to the Wairarapa wineries, over to the Kāpiti Coast, around the south coast to Red Rocks, or north
                towards Palmerston North and Taupō.
              </p>
              <p className="text-muted-foreground">
                Within the city, having your own car makes the hill suburbs, the Miramar peninsula and evening trips
                across town far easier than working around bus timetables.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                ['Wellington waterfront & Te Papa', '5–10 min drive from the branch'],
                ['Mount Victoria Lookout', '15 min drive for the classic harbour view'],
                ['Wētā Workshop, Miramar', '20 min drive across the city'],
                ['Martinborough & Wairarapa wineries', 'About 1 hr 20 over the Remutaka Hill'],
              ].map(([place, note]) => (
                <li key={place} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">{place}</span> — {note}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Wellington car hire FAQ</h2>
          <dl className="divide-y border-y">
            {faqs.map((f) => (
              <div key={f.question} className="py-5 grid md:grid-cols-3 gap-4">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="md:col-span-2 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-primary/5 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to book your Wellington car hire?</h2>
            <p className="mb-6 max-w-2xl mx-auto text-muted-foreground">
              Check live availability online, or call the Te Aro branch and talk to someone local about rates and
              one-way drop-offs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/vehicles">View our vehicle range</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:0800525663">Call us: 0800 525 663</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <WellingtonInternalLinks currentPath="/car-rental-wellington-new-zealand" />
    </>
  );
};

export default CarRentalWellington;
