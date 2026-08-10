import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, CreditCard, IdCard, MapPin, CheckCircle2, PoundSterling } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Helmet } from 'react-helmet-async';

const PAGE_URL = 'https://www.jamesblond.co.nz/car-hire-new-zealand-from-uk';

const faqs: [string, string][] = [
  [
    'Can I drive in New Zealand on a UK driving licence?',
    'Yes. A full UK photocard licence in English is accepted in New Zealand for up to 12 months from your arrival date — you do not need an International Driving Permit. Bring the physical card, not a digital copy.',
  ],
  [
    'Which side of the road do you drive on in New Zealand?',
    'The left, the same as the UK, and most of our cars are automatic. The main differences to learn are unmarked rural intersections, single-lane bridges and gravel side roads.',
  ],
  [
    'Can I pay with a UK card in GBP?',
    'Our rates are set in New Zealand dollars and we accept UK Visa, Mastercard and Amex credit and debit cards. James Blond adds no overseas card surcharge; your own bank applies its conversion rate, so a travel card avoids the usual 2–3% fee.',
  ],
  [
    'Do I need to book before I fly from the UK?',
    'For December to March travel, yes — that is New Zealand’s peak season and the fleet books out weeks ahead. Booking online before you fly also locks in the rate rather than the walk-up airport price.',
  ],
  [
    'Can I pick up in Auckland and drop off in Christchurch?',
    'Yes. One-way rentals between our Auckland, Wellington and Christchurch branches are available on request, which suits the classic North Island to South Island route. Relocation fees vary by route and season.',
  ],
  [
    'How long does it take to drive around New Zealand?',
    'Allow far longer than the map suggests: Auckland to Wellington is roughly 8 hours of driving, and Christchurch to Queenstown around 6. Two weeks comfortably covers one island; three weeks covers both.',
  ],
  [
    'Is a car or a campervan better for a New Zealand trip?',
    'A car plus accommodation is usually cheaper, faster on the road and easier to park in cities. A campervan suits remote South Island touring. Many UK visitors hire a car for the North Island and add a van for the South.',
  ],
];

const CarHireNewZealandFromUK = () => (
  <div className="container mx-auto px-4 py-10 space-y-10">
    <PageSEO
      title="Car Hire New Zealand from the UK | James Blond Rentals"
      description="Planning a NZ trip from the UK? Kiwi-owned car hire in Auckland, Wellington & Christchurch. UK licences accepted, no IDP needed, no overseas card surcharge."
      canonical="/car-hire-new-zealand-from-uk"
    />
    <Helmet>
      <link rel="alternate" hrefLang="en-gb" href={PAGE_URL} />
      <link rel="alternate" hrefLang="en-au" href="https://www.jamesblond.co.nz/car-hire-auckland-airport-from-australia" />
      <link rel="alternate" hrefLang="en-nz" href="https://www.jamesblond.co.nz/car-hire-auckland" />
      <link rel="alternate" hrefLang="x-default" href="https://www.jamesblond.co.nz/car-hire-auckland" />
    </Helmet>
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'James Blond Rentals — car hire in New Zealand for UK visitors',
        url: PAGE_URL,
        telephone: '+64800525663',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '5/203 Kirkbride Road',
          addressLocality: 'Mangere',
          addressRegion: 'Auckland',
          postalCode: '2022',
          addressCountry: 'NZ',
        },
        areaServed: [
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'New Zealand' },
          { '@type': 'City', name: 'Auckland' },
          { '@type': 'City', name: 'Wellington' },
          { '@type': 'City', name: 'Christchurch' },
        ],
      }}
    />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(([name, text]) => ({
          '@type': 'Question',
          name,
          acceptedAnswer: { '@type': 'Answer', text },
        })),
      }}
    />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jamesblond.co.nz/' },
          { '@type': 'ListItem', position: 2, name: 'Car hire New Zealand from the UK', item: PAGE_URL },
        ],
      }}
    />

    {/* Hero */}
    <section className="text-center">
      <p className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
        🇬🇧 For visitors flying in from the UK
      </p>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Car Hire in New Zealand for UK Visitors</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
        James Blond Rentals is a Kiwi-owned rental company with branches in Auckland, Wellington
        and Christchurch. Your UK licence is accepted, we drive on the left just like home, and
        our rates are typically well below the global brands at the airport desks.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" variant="cta" asChild>
          <Link to="/fleet/cars">View cars &amp; book</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="tel:+64800525663">Call NZ: +64 800 525 663</a>
        </Button>
      </div>
    </section>

    {/* Why UK visitors choose us */}
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Why UK travellers hire with James Blond</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: IdCard, title: 'UK licence accepted', body: 'A full UK photocard licence is valid here for 12 months. No International Driving Permit and no translation required.' },
          { icon: PoundSterling, title: 'No overseas card surcharge', body: 'We never add a foreign-card fee. Rates are in NZD, so a travel card such as Monzo, Starling or Chase avoids your bank’s conversion charge.' },
          { icon: CreditCard, title: 'UK cards welcome', body: 'UK Visa, Mastercard and Amex credit and debit cards are accepted for both the rental and the bond.' },
          { icon: Plane, title: 'Airport pickup, three cities', body: 'Auckland, Wellington and Christchurch branches, with a free shuttle from the Auckland terminal — handy after a 24-hour flight.' },
          { icon: MapPin, title: 'Local Kiwi advice', body: 'Not a global chain. Our team drives these roads and will tell you honestly how long each leg really takes.' },
          { icon: CheckCircle2, title: 'Unlimited kilometres', body: 'Every rental includes unlimited kilometres, so a long South Island loop costs no more than a city break.' },
        ].map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <Icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    {/* Where to pick up */}
    <section>
      <h2 className="text-3xl font-bold mb-6">Where UK visitors usually start</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Auckland</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Most UK flights land here via Dubai, Singapore, Doha or Los Angeles. Start with the
              Bay of Islands, Coromandel and Rotorua before heading south.
            </p>
            <Link to="/car-hire-auckland" className="text-primary hover:underline text-sm font-medium">
              → Auckland car hire
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Wellington</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The natural mid-point of a two-island trip and the gateway to the Interislander
              ferry across Cook Strait to Picton.
            </p>
            <Link to="/car-hire-wellington" className="text-primary hover:underline text-sm font-medium">
              → Wellington car hire
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Christchurch</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The best base for the South Island: Aoraki/Mt Cook, Tekapo, the West Coast glaciers
              and the drive through to Queenstown.
            </p>
            <Link to="/christchurch-car-hire" className="text-primary hover:underline text-sm font-medium">
              → Christchurch car hire
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* Driving distances */}
    <section className="bg-muted/30 rounded-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">How far is it really? NZ driving times</h2>
      <p className="text-muted-foreground mb-6">
        New Zealand looks compact on a map, but the roads are two-lane and winding. These are
        realistic driving times without stops — add at least a third for photo breaks and coffee.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-right">Distance</th>
              <th className="p-3 text-right">Driving time</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Auckland → Rotorua', '235 km', '~3 h'],
              ['Auckland → Wellington', '640 km', '~8 h'],
              ['Wellington → Picton (ferry)', 'Cook Strait', '~3 h 30 m sailing'],
              ['Picton → Christchurch', '335 km', '~4 h 30 m'],
              ['Christchurch → Tekapo', '225 km', '~3 h'],
              ['Christchurch → Queenstown', '480 km', '~6 h'],
              ['Christchurch → Franz Josef', '390 km', '~5 h 30 m'],
            ].map(([route, km, time]) => (
              <tr key={route} className="border-t">
                <td className="p-3">{route}</td>
                <td className="p-3 text-right">{km}</td>
                <td className="p-3 text-right">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Distances are approximate via the main state highways. Winter conditions on alpine passes
        can add significant time.
      </p>
    </section>

    {/* Trip shapes */}
    <section>
      <h2 className="text-3xl font-bold mb-6">Choosing the right vehicle for a long-haul trip</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Couple, two to three weeks</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A premium compact or compact SUV handles motorway legs, gravel access roads and a
              couple of large suitcases without feeling oversized in city car parks.
            </p>
            <Link to="/fleet/cars" className="text-primary hover:underline text-sm font-medium">
              → Browse the car fleet
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Family visiting relatives</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A 7-seat SUV or a 10 to 12-seat minibus keeps everyone together for Christmas and
              school-holiday trips. Child seats can be added at booking.
            </p>
            <Link to="/fleet/minibuses" className="text-primary hover:underline text-sm font-medium">
              → Minibus &amp; people mover hire
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">One-way, North to South Island</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Fly into Auckland, drive south, cross on the ferry and fly home from Christchurch or
              Queenstown. One-way hire between our branches is available on request.
            </p>
            <Link to="/one-way-car-hire" className="text-primary hover:underline text-sm font-medium">
              → One-way car hire options
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Emigrating or moving in</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Plenty of UK arrivals need a van or small truck for the first flat move, then a car
              for a few weeks while they buy one.
            </p>
            <Link to="/van-hire-auckland" className="text-primary hover:underline text-sm font-medium">
              → Van hire in Auckland
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* Rules of the road */}
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">What UK drivers should know before setting off</h2>
      <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
        <ul className="list-disc list-inside space-y-2">
          <li>Drive on the left, as at home — most of our fleet is automatic.</li>
          <li>Open-road limit is 100 km/h; urban limits are usually 50 km/h.</li>
          <li>Seatbelts are compulsory for every passenger, and phone use is hands-free only.</li>
          <li>Speed cameras and police patrols are common on the main highways.</li>
        </ul>
        <ul className="list-disc list-inside space-y-2">
          <li>Many rural roads are unsealed, single-lane or have one-lane bridges — slow down and give way as signposted.</li>
          <li>Fuel stations can be 100 km apart on the West Coast and in Central Otago; fill up when you can.</li>
          <li>Alpine passes may require chains in winter (June–September).</li>
          <li>Jet lag after a long-haul flight is real — plan a short first drive.</li>
        </ul>
      </div>
      <p className="text-sm mt-4">
        Full detail is in our guide to{' '}
        <Link to="/blog/driving-in-new-zealand-with-overseas-license" className="text-primary hover:underline">
          driving in New Zealand on an overseas licence
        </Link>
        .
      </p>
    </section>

    {/* FAQ */}
    <section className="border-t pt-8">
      <h2 className="text-3xl font-bold mb-6">UK visitor FAQs</h2>
      <div className="space-y-4">
        {faqs.map(([q, a]) => (
          <details key={q} className="border rounded-lg p-4 group">
            <summary className="font-semibold cursor-pointer">{q}</summary>
            <p className="text-sm text-muted-foreground mt-2">{a}</p>
          </details>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="text-center bg-primary/5 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-3">Book your New Zealand car hire before you fly</h2>
      <p className="text-muted-foreground mb-5">
        December to March books out early. Reserve online in a couple of minutes, or call our
        Auckland team — we are 11 to 13 hours ahead of the UK.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" variant="cta" asChild>
          <Link to="/fleet/cars">Book a car</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/contact">Ask us a question</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default CarHireNewZealandFromUK;
