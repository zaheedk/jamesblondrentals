import { Link } from 'react-router-dom';
import { Car, Map, Calendar, IdCard, Fuel, ShieldCheck } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PAGE_URL = 'https://www.jamesblond.co.nz/nz-self-drive-holiday';

const hubs = [
  { city: 'Auckland', body: 'Start north: Coromandel, Waitomo caves, Rotorua and the Bay of Islands.', links: [['Auckland car hire', '/car-hire-auckland'], ['From Australia', '/car-hire-auckland-airport-from-australia']] },
  { city: 'Hamilton', body: 'Central North Island base for Hobbiton, Waitomo and Raglan.', links: [['Hamilton car hire', '/car-hire-hamilton']] },
  { city: 'Wellington', body: 'Capital city, Wairarapa wine country and the Interislander ferry south.', links: [['Wellington car rental', '/car-rental-wellington-new-zealand']] },
  { city: 'Christchurch', body: 'Gateway to the South Island: Tekapo, Aoraki Mount Cook, Kaikōura and the West Coast.', links: [['Christchurch Airport', '/car-rental-christchurch-airport'], ['From Australia', '/car-hire-christchurch-airport-from-australia']] },
];

const itineraries = [
  ['North Island loop (7–10 days)', 'Auckland → Coromandel → Rotorua → Taupō → Waitomo → Auckland. Geothermal parks, lakes and beaches with short driving days.'],
  ['South Island highlights (7–14 days)', 'Christchurch → Tekapo → Mount Cook → Wanaka → West Coast → Arthur\'s Pass → Christchurch. Alpine scenery and glaciers.'],
  ['Top to bottom (14–21+ days)', 'Auckland to Christchurch via Wellington and the Interislander ferry. See the one-way car hire page for drop-off options.'],
];

const faqs = [
  ['Can I drive in New Zealand on my overseas licence?', 'Yes, for up to 12 months if your licence is current and in English. If it is not in English, bring an International Driving Permit or an approved translation. Always bring the physical licence.'],
  ['Which side of the road do you drive on?', 'The left. Open-road speed limits are generally 100 km/h, and many rural roads are narrow and winding — allow more time than the map suggests.'],
  ['Is unlimited kilometres included?', 'Yes, our rentals include unlimited kilometres, so longer road trips don\'t cost extra per kilometre.'],
  ['Can I take the car on the Interislander ferry?', 'Yes. Book the vehicle on the ferry ahead of time, especially in summer. Contact us if you are planning a one-way trip between islands.'],
  ['How far ahead should I book?', 'For Christmas to mid-January and school holidays, book as early as possible. Winter and spring usually have better availability and rates.'],
];

const NZSelfDriveHoliday = () => (
  <div className="container mx-auto px-4 py-10 space-y-12">
    <PageSEO
      title="NZ Self-Drive Holiday Guide & Car Hire | James Blond Rentals"
      description="Plan a New Zealand self-drive holiday: road trip itineraries, when to go, driving rules and car hire from Auckland, Hamilton, Wellington and Christchurch."
      canonical="/nz-self-drive-holiday"
    />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jamesblond.co.nz/' },
          { '@type': 'ListItem', position: 2, name: 'NZ Self-Drive Holiday', item: PAGE_URL },
        ],
      }}
    />

    <section className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Your New Zealand Self-Drive Holiday</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
        The best way to see New Zealand is at your own pace. Pick up a car from James Blond — family-owned since 2004 —
        in Auckland, Hamilton, Wellington or Christchurch, with unlimited kilometres and quick online check-in.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" asChild><Link to="/fleet/cars">Browse cars & SUVs</Link></Button>
        <Button size="lg" variant="outline" asChild><a href="tel:+64800525663">Call 0800 525 663</a></Button>
      </div>
    </section>

    <section>
      <h2 className="text-3xl font-bold mb-6">Where to start your trip</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {hubs.map((h) => (
          <Card key={h.city}><CardContent className="p-6">
            <Map className="w-7 h-7 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">{h.city}</h3>
            <p className="text-sm text-muted-foreground mb-3">{h.body}</p>
            <div className="flex flex-col gap-1">
              {h.links.map(([label, to]) => (
                <Link key={to} to={to} className="text-primary hover:underline text-sm font-medium">→ {label}</Link>
              ))}
            </div>
          </CardContent></Card>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-3xl font-bold mb-6">Popular road trip routes</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {itineraries.map(([t, b]) => (
          <Card key={t}><CardContent className="p-6">
            <Car className="w-7 h-7 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">{t}</h3>
            <p className="text-sm text-muted-foreground">{b}</p>
          </CardContent></Card>
        ))}
      </div>
      <p className="mt-4 text-sm"><Link to="/one-way-car-hire" className="text-primary hover:underline font-medium">→ One-way car hire options</Link></p>
    </section>

    <section className="bg-muted/30 rounded-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Before you go</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
        {[
          [Calendar, 'Book early for peak', 'Christmas to mid-January and school holidays sell out. A 3-day minimum applies from 24 December.'],
          [IdCard, 'Licence ready', 'English-language licences are fine for up to 12 months; otherwise bring an IDP or approved translation.'],
          [Fuel, 'Plan fuel stops', 'Fuel stations can be far apart in rural areas and on alpine routes — top up when you can.'],
          [ShieldCheck, 'Check in online', 'Upload your licence and save your card before arrival so pick-up takes minutes.'],
        ].map(([Icon, t, b]) => {
          const I = Icon as typeof Car;
          return (
            <div key={t as string}>
              <I className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">{t as string}</h3>
              <p className="text-muted-foreground">{b as string}</p>
            </div>
          );
        })}
      </div>
      <Link to="/online-check-in" className="inline-block mt-5 text-primary hover:underline font-medium">→ How online check-in works</Link>
    </section>

    <section>
      <h2 className="text-3xl font-bold mb-6">Self-drive holiday FAQs</h2>
      <div className="space-y-4">
        {faqs.map(([q, a]) => (
          <details key={q} className="border rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">{q}</summary>
            <p className="text-sm text-muted-foreground mt-2">{a}</p>
          </details>
        ))}
      </div>
    </section>

    <section className="text-center bg-primary/5 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-3">Ready to hit the road?</h2>
      <p className="text-muted-foreground mb-5">Unlimited kilometres, four locations and a fast pick-up.</p>
      <Button size="lg" asChild><Link to="/fleet/cars">Book a car</Link></Button>
    </section>
  </div>
);

export default NZSelfDriveHoliday;
