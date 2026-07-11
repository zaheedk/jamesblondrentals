import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, CreditCard, IdCard, MapPin, CheckCircle2, DollarSign } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Helmet } from 'react-helmet-async';

const PAGE_URL = 'https://jamesblond.co.nz/car-hire-auckland-airport-from-australia';

const CarHireAucklandAirportFromAustralia = () => (
  <div className="container mx-auto px-4 py-10 space-y-10">
    <PageSEO
      title="Car Hire Auckland Airport from Australia | James Blond Rentals"
      description="Aussie travellers — book car hire at Auckland Airport with prices in AUD, Australian licences accepted, no overseas card fees. Free terminal shuttle."
      canonical="/car-hire-auckland-airport-from-australia"
    />
    <Helmet>
      <link rel="alternate" hrefLang="en-au" href={PAGE_URL} />
      <link rel="alternate" hrefLang="en-nz" href="https://jamesblond.co.nz/car-rental-auckland-airport" />
      <link rel="alternate" hrefLang="x-default" href="https://jamesblond.co.nz/car-rental-auckland-airport" />
    </Helmet>
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        name: 'James Blond Rentals — Auckland Airport (for Australian travellers)',
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
          { '@type': 'Country', name: 'Australia' },
          { '@type': 'City', name: 'Auckland' },
        ],
      }}
    />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can I use my Australian driver licence to hire a car in New Zealand?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Australian driver licences are accepted in New Zealand — no International Driving Permit is needed. Bring the physical card (not just the digital licence in your phone).',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I pay in Australian dollars?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our rates are set in NZD, but we accept Australian Visa, Mastercard and Amex credit or debit cards. Your bank converts at the daily rate. We show an indicative AUD equivalent at checkout so there are no surprises.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are there overseas card fees or foreign transaction surcharges?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'James Blond does not charge an overseas card surcharge. Your own bank may apply a currency conversion fee — check with them before you travel.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need travel insurance or should I use the rental insurance?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Basic cover is included with every rental. You can upgrade to Premium or Ultimate at checkout to reduce your excess. Many Australian travel insurance policies also cover rental excess — check yours before adding cover.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the free airport shuttle work for trans-Tasman flights?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sydney, Melbourne, Brisbane, Gold Coast and Perth flights arrive into the International Terminal. Exit via Door 11, follow the covered walkway to the offsite shuttle bay, and call 0800 525 663 — our shuttle takes you to our depot at 5/203 Kirkbride Road, Mangere in about 5 minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer one-way rentals from Auckland to other NZ cities?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Popular Aussie itineraries include Auckland → Wellington, Auckland → Rotorua and Auckland → Queenstown (via ferry). See our one-way car hire options for pricing.',
            },
          },
        ],
      }}
    />

    {/* Hero */}
    <section className="text-center">
      <p className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
        🇦🇺 For travellers flying in from Australia
      </p>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Car Hire at Auckland Airport — for Australian Travellers
      </h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
        Skip the airport queues and overseas-card surcharges. James Blond Rentals is a
        Kiwi-owned car hire company just 5 minutes from Auckland International Terminal,
        with prices up to 40% cheaper than the big global brands.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" asChild>
          <a href="https://www.jamesblond.co.nz/fleet/cars" target="_blank" rel="noopener noreferrer">
            View Cars & Book from AUD $45/day
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="tel:+64800525663">Call NZ: 0800 525 663</a>
        </Button>
      </div>
    </section>

    {/* Why Aussies choose us */}
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Why Australians choose James Blond</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: DollarSign, title: 'AUD-friendly pricing', body: 'Rates from around AUD $45/day (NZD $49). No overseas card surcharge from us — your bank\'s conversion rate applies.' },
          { icon: IdCard, title: 'Aussie licence accepted', body: 'Your Australian full driver licence is valid in NZ. No International Driving Permit required.' },
          { icon: CreditCard, title: 'AU cards welcome', body: 'We accept Australian Visa, Mastercard and Amex credit and debit cards for both the rental and bond.' },
          { icon: Plane, title: 'Free terminal shuttle', body: 'Meet you at International Door 11 or Domestic Door 9 — 5 minutes to our Mangere depot.' },
          { icon: MapPin, title: 'Local Kiwi team', body: 'Not a global chain. Kiwi-owned, based in Auckland, and we know the roads you\'re about to drive.' },
          { icon: CheckCircle2, title: 'Trans-Tasman ready', body: 'Popular with visitors from Sydney, Melbourne, Brisbane, Gold Coast and Perth for both leisure and business trips.' },
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

    {/* Price compare */}
    <section className="bg-muted/30 rounded-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">How our prices compare</h2>
      <p className="text-muted-foreground mb-6">
        Indicative daily rate for an economy car (Suzuki Swift equivalent) picked up at Auckland Airport.
        Prices in AUD, converted from published NZD rates.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-right">AUD / day (approx.)</th>
              <th className="p-3 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t bg-primary/5">
              <td className="p-3 font-bold">James Blond Rentals</td>
              <td className="p-3 text-right font-bold">from ~$45</td>
              <td className="p-3">Kiwi-owned, free airport shuttle, no overseas card surcharge</td>
            </tr>
            <tr className="border-t"><td className="p-3">Hertz</td><td className="p-3 text-right">~$75–$95</td><td className="p-3">Global brand, in-terminal desk</td></tr>
            <tr className="border-t"><td className="p-3">Budget</td><td className="p-3 text-right">~$65–$85</td><td className="p-3">Global brand, in-terminal desk</td></tr>
            <tr className="border-t"><td className="p-3">Europcar</td><td className="p-3 text-right">~$70–$90</td><td className="p-3">Global brand, in-terminal desk</td></tr>
            <tr className="border-t"><td className="p-3">Sixt</td><td className="p-3 text-right">~$70–$95</td><td className="p-3">Global brand, in-terminal desk</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Rates are indicative Jan 2026 mid-week bookings, 7-day rental. Actual price varies by season and vehicle. Always compare on the day of your booking.
      </p>
    </section>

    {/* Planning your trip */}
    <section>
      <h2 className="text-3xl font-bold mb-6">Planning your NZ road trip from Australia</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Short Auckland break (3–5 days)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Perfect for a long weekend from Sydney or Brisbane. A Premium Economy hatch is plenty for city driving, Waiheke ferry trips and the North Shore beaches.
            </p>
            <Link to="/car-hire-auckland" className="text-primary hover:underline text-sm font-medium">
              → Auckland car hire options
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">North Island road trip (7–14 days)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Auckland → Rotorua → Taupō → Wellington. Upgrade to a Premium SUV for comfort. Unlimited kilometres on every rental.
            </p>
            <Link to="/one-way-car-hire" className="text-primary hover:underline text-sm font-medium">
              → One-way car hire options
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Family holiday (5–10 seats)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Travelling with the whole family? Our 7-seat SUVs and 10 & 12-seat minibuses are popular with Aussie families visiting for school holidays.
            </p>
            <Link to="/fleet/minibuses" className="text-primary hover:underline text-sm font-medium">
              → Minibus & people mover hire
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Driving in NZ — what Aussies should know</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Same side of the road as Australia (left)</li>
              <li>Give way rules differ slightly — right-turning traffic no longer gives way</li>
              <li>Open road limit is 100 km/h</li>
              <li>Winter driving in South Island may need chains</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>

    {/* Shuttle */}
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">Free shuttle from Auckland International Terminal</h2>
      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold mb-2">After you land:</h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Clear customs and collect your bags</li>
            <li>Call us on <a href="tel:+64800525663" className="text-primary hover:underline">0800 525 663</a> (or +64 9 275 9595 from an Aussie SIM)</li>
            <li>Exit through Door 11 and follow the covered walkway to the offsite shuttle bay</li>
            <li>Our blue and white James Blond shuttle will collect you within ~10 minutes</li>
            <li>5-minute drive to 5/203 Kirkbride Road, Mangere — you're on the road</li>
          </ol>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Coming from these Aussie cities?</h3>
          <p className="text-muted-foreground mb-3">
            Direct flights to Auckland from Sydney (~3h), Melbourne (~3h 45m), Brisbane (~3h 20m),
            Gold Coast (~3h) and Perth (~7h) all arrive into the International Terminal.
          </p>
          <Link to="/airport/auckland" className="text-primary hover:underline font-medium">
            → Full Auckland Airport pickup & drop-off info
          </Link>
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="border-t pt-8">
      <h2 className="text-3xl font-bold mb-6">Australian traveller FAQs</h2>
      <div className="space-y-4">
        {[
          ['Can I use my Australian driver licence in New Zealand?', 'Yes — Australian full licences are valid in NZ. Bring the physical card, not the digital version on your phone. Learner and provisional licences may have restrictions; contact us before booking.'],
          ['Can I pay in Australian dollars?', 'Rates are set in NZD but we accept Australian Visa, Mastercard and Amex. Your bank converts at the daily rate. We show an indicative AUD amount at checkout.'],
          ['Any overseas card fees?', 'We don\'t charge an overseas card surcharge. Your own bank may apply a currency conversion fee (usually 2–3%). A travel-friendly card like Wise or ING avoids this.'],
          ['Should I use my travel insurance or upgrade the rental cover?', 'Most Australian travel insurance policies cover rental car excess. Check yours — if not covered, upgrade to Premium or Ultimate at checkout.'],
          ['Can I do a one-way rental to another NZ city?', 'Yes. Auckland → Wellington and Auckland → Rotorua are common Aussie itineraries. See our one-way car hire page for fees.'],
          ['What are your fuel and mileage policies?', 'All rentals include unlimited kilometres. Return the vehicle with the same fuel level as pickup, or we\'ll refuel at cost + a small service fee.'],
        ].map(([q, a]) => (
          <details key={q} className="border rounded-lg p-4 group">
            <summary className="font-semibold cursor-pointer">{q}</summary>
            <p className="text-sm text-muted-foreground mt-2">{a}</p>
          </details>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="text-center bg-primary/5 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-3">Ready to book your Auckland car hire?</h2>
      <p className="text-muted-foreground mb-5">Kiwi-owned, Aussie-friendly, priced in AUD — book online in 2 minutes.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" asChild>
          <a href="https://www.jamesblond.co.nz/fleet/cars" target="_blank" rel="noopener noreferrer">Book a car</a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="tel:+64800525663">Call 0800 525 663</a>
        </Button>
      </div>
    </section>
  </div>
);

export default CarHireAucklandAirportFromAustralia;