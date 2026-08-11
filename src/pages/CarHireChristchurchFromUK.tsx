import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, CreditCard, IdCard, MapPin, CheckCircle2, PoundSterling, Snowflake } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Helmet } from 'react-helmet-async';

const PAGE_URL = 'https://www.jamesblond.co.nz/car-hire-christchurch-from-uk';

const faqs: [string, string][] = [
  [
    'Can I hire a car in Christchurch on a UK driving licence?',
    'Yes. A full UK photocard licence in English is valid in New Zealand for up to 12 months from your arrival date, so no International Driving Permit is needed. Bring the physical card with you to the branch — a photo or app version is not accepted.',
  ],
  [
    'How do I get from Christchurch Airport to your branch?',
    'Our Christchurch branch is at 25 Logistics Drive, Harewood, a few minutes from the airport terminal. Let us know your flight number and arrival time when you book and we will arrange the pickup — helpful after a 24-hour flight from Heathrow or Manchester.',
  ],
  [
    'Can I pay with a UK card, and are prices in pounds?',
    'Rates are quoted in New Zealand dollars. We accept UK Visa, Mastercard and Amex credit and debit cards for both the rental and the bond, and we add no overseas card surcharge. A travel card such as Monzo, Starling or Chase avoids your bank’s 2–3% conversion fee.',
  ],
  [
    'How far in advance should UK visitors book Christchurch car hire?',
    'For December to March — New Zealand’s summer and peak season — book several weeks ahead, as the fleet sells out. For April, May, September and October you have more flexibility, and rates are usually lower.',
  ],
  [
    'Can I pick up in Christchurch and drop off in Auckland or Wellington?',
    'Yes. One-way hire between our Christchurch, Wellington and Auckland branches is available on request, which suits UK visitors flying into one island and out of the other. Relocation fees depend on the route and season.',
  ],
  [
    'What can I reach from Christchurch by car?',
    'Christchurch is the natural South Island base. Lake Tekapo is around 3 hours, Aoraki/Mt Cook 4 hours, Franz Josef about 5 hours 30 minutes over Arthur’s Pass, and Queenstown roughly 6 hours. Kaikoura and Akaroa are easy day trips.',
  ],
  [
    'Do I need a 4WD or SUV in the South Island?',
    'Not for the main highways, which are sealed and well maintained year round. An SUV is worth it if you are visiting between June and September for the ski fields, or if your accommodation is up an unsealed access road. Chains may be required on alpine passes in winter.',
  ],
  [
    'Is insurance included in Christchurch car hire?',
    'Basic cover with a standard excess is included. UK visitors often upgrade to Premium or Ultimate cover at checkout to reduce the excess, which is usually cheaper than buying the airport desk’s add-on.',
  ],
];

const CarHireChristchurchFromUK = () => (
  <div className="container mx-auto px-4 py-10 space-y-10">
    <PageSEO
      title="Christchurch Car Hire for UK Visitors | James Blond Rentals"
      description="Flying from the UK to Christchurch? Kiwi-owned car hire near Christchurch Airport. UK licences accepted, no IDP, no overseas card surcharge, unlimited kilometres."
      canonical="/car-hire-christchurch-from-uk"
    />
    <Helmet>
      <link rel="alternate" hrefLang="en-gb" href={PAGE_URL} />
      <link rel="alternate" hrefLang="en-au" href="https://www.jamesblond.co.nz/car-hire-christchurch-airport-from-australia" />
      <link rel="alternate" hrefLang="en-nz" href="https://www.jamesblond.co.nz/car-hire-christchurch" />
      <link rel="alternate" hrefLang="x-default" href="https://www.jamesblond.co.nz/car-hire-christchurch" />
    </Helmet>
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'James Blond Rentals — Christchurch car hire for UK visitors',
        url: PAGE_URL,
        telephone: '+64800525663',
        email: 'christchurch@jamesblond.co.nz',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '25 Logistics Drive',
          addressLocality: 'Harewood',
          addressRegion: 'Christchurch',
          postalCode: '8544',
          addressCountry: 'NZ',
        },
        geo: { '@type': 'GeoCoordinates', latitude: '-43.4841', longitude: '172.5358' },
        openingHours: 'Mo-Su 08:00-17:00',
        areaServed: [
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'City', name: 'Christchurch' },
          { '@type': 'AdministrativeArea', name: 'Canterbury' },
          { '@type': 'AdministrativeArea', name: 'South Island' },
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
          { '@type': 'ListItem', position: 2, name: 'Christchurch', item: 'https://www.jamesblond.co.nz/car-hire-christchurch' },
          { '@type': 'ListItem', position: 3, name: 'Christchurch car hire from the UK', item: PAGE_URL },
        ],
      }}
    />

    {/* Hero */}
    <section className="text-center">
      <p className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
        🇬🇧 For visitors flying in from the UK
      </p>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Christchurch Car Hire for UK Visitors</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
        James Blond Rentals is Kiwi-owned, with a Christchurch branch minutes from the airport at
        25 Logistics Drive, Harewood. Your UK licence is accepted, we drive on the left just like
        home, and our rates sit well below the global brands at the terminal desks.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" variant="cta" asChild>
          <Link to="/booking">Check dates &amp; book</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="tel:+64800525663">Call NZ: +64 800 525 663</a>
        </Button>
      </div>
    </section>

    {/* Why UK visitors choose us */}
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Why UK travellers hire with us in Christchurch</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: IdCard, title: 'UK licence accepted', body: 'A full UK photocard licence is valid here for 12 months. No International Driving Permit and no translation required.' },
          { icon: Plane, title: 'Minutes from the airport', body: 'Harewood branch, a short hop from the Christchurch terminal. Send us your flight number and we will sort the pickup.' },
          { icon: PoundSterling, title: 'No overseas card surcharge', body: 'We never add a foreign-card fee. Rates are in NZD, so a travel card avoids your bank’s conversion charge.' },
          { icon: CreditCard, title: 'UK cards welcome', body: 'UK Visa, Mastercard and Amex credit and debit cards are accepted for the rental and the bond.' },
          { icon: CheckCircle2, title: 'Unlimited kilometres', body: 'Every rental includes unlimited kilometres, so a full South Island loop costs no more than a city break.' },
          { icon: MapPin, title: 'Local South Island advice', body: 'Not a global chain. Our Christchurch team drives these roads and will tell you honestly how long each leg takes.' },
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

    {/* Driving distances */}
    <section className="bg-muted/30 rounded-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Driving times from Christchurch</h2>
      <p className="text-muted-foreground mb-6">
        The South Island looks compact on a map, but the roads are two-lane and winding. These are
        realistic driving times without stops — add at least a third for photo breaks and coffee.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Route from Christchurch</th>
              <th className="p-3 text-right">Distance</th>
              <th className="p-3 text-right">Driving time</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Akaroa (day trip)', '80 km', '~1 h 30 m'],
              ['Kaikoura', '180 km', '~2 h 30 m'],
              ['Lake Tekapo', '225 km', '~3 h'],
              ['Aoraki / Mt Cook Village', '330 km', '~4 h'],
              ['Franz Josef (via Arthur’s Pass)', '390 km', '~5 h 30 m'],
              ['Queenstown', '480 km', '~6 h'],
              ['Picton (for the ferry north)', '335 km', '~4 h 30 m'],
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
        Distances are approximate via the main state highways. Winter conditions on Arthur’s Pass,
        Lindis Pass and the Crown Range can add significant time.
      </p>
    </section>

    {/* Seasons */}
    <section>
      <h2 className="text-3xl font-bold mb-6">When to visit — and what it means for your hire</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">December to March (NZ summer)</h3>
            <p className="text-sm text-muted-foreground">
              The busiest window for UK arrivals and the school-holiday peak. Long daylight hours
              make the Tekapo and West Coast drives easy, but book several weeks ahead — the fleet
              sells out and walk-up airport rates climb sharply.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">April, May, September, October</h3>
            <p className="text-sm text-muted-foreground">
              The shoulder seasons: autumn colour in Central Otago, quiet roads, lower rates and
              far better vehicle choice at short notice. Our pick for a first South Island road trip.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">June to August (NZ winter)</h3>
            <p className="text-sm text-muted-foreground flex gap-2">
              <Snowflake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>
                Ski season for Mt Hutt and the Canterbury fields. Consider an AWD SUV, carry chains
                where signposted, and allow extra time on alpine passes after snowfall.
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Visiting family or relocating</h3>
            <p className="text-sm text-muted-foreground">
              Plenty of UK arrivals need a car for the first few weeks while they buy one, plus a
              van for a flat move. We can cover both from the same Christchurch branch.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* Vehicle choice */}
    <section>
      <h2 className="text-3xl font-bold mb-6">Choosing the right vehicle</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Couple, two to three weeks</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A premium compact or compact SUV takes two large suitcases, handles gravel access
              roads and still parks easily in central Christchurch.
            </p>
            <Link to="/fleet/cars" className="text-primary hover:underline text-sm font-medium">
              → Browse the car fleet
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Family or group</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A 7-seat SUV or a 10 to 12-seat minibus keeps everyone together. Child and booster
              seats can be added at booking.
            </p>
            <Link to="/christchurch-minibus-hire" className="text-primary hover:underline text-sm font-medium">
              → Christchurch minibus hire
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">One-way, island to island</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Fly into Christchurch, drive north, cross on the Interislander and fly home from
              Auckland or Wellington. One-way hire between branches is available on request.
            </p>
            <Link to="/one-way-car-hire" className="text-primary hover:underline text-sm font-medium">
              → One-way car hire options
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
          <li>Christchurch has several roundabouts and shared-space streets in the rebuilt centre.</li>
        </ul>
        <ul className="list-disc list-inside space-y-2">
          <li>Many Canterbury and West Coast roads are unsealed or have one-lane bridges — slow down and give way as signposted.</li>
          <li>Fuel stations can be 100 km apart on the West Coast and in Central Otago; fill up when you can.</li>
          <li>Alpine passes may require chains in winter (June–September).</li>
          <li>Jet lag after a long-haul flight is real — plan a short first drive, such as Akaroa.</li>
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

    {/* Related */}
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">Related pages</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        {[
          { to: '/car-hire-christchurch', label: 'Christchurch car hire (local rates)' },
          { to: '/airport/christchurch', label: 'Christchurch Airport pickup' },
          { to: '/car-hire-new-zealand-from-uk', label: 'NZ car hire from the UK' },
          { to: '/christchurch-van-hire', label: 'Christchurch van hire' },
          { to: '/price-guide', label: 'Price guide' },
          { to: '/contact/christchurch', label: 'Contact our Christchurch branch' },
        ].map((l) => (
          <Link key={l.to} to={l.to} className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors font-medium">
            {l.label}
          </Link>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section className="border-t pt-8">
      <h2 className="text-3xl font-bold mb-6">UK visitor FAQs — Christchurch</h2>
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
      <h2 className="text-2xl font-bold mb-3">Book your Christchurch car hire before you fly</h2>
      <p className="text-muted-foreground mb-5">
        December to March books out early. Reserve online in a couple of minutes, or call our
        Christchurch team — we are 11 to 13 hours ahead of the UK.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" variant="cta" asChild>
          <Link to="/booking">Book a car</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/contact/christchurch">Ask us a question</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default CarHireChristchurchFromUK;
