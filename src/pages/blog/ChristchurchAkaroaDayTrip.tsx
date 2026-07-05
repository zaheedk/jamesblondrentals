import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, MapPin } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/auckland-car-rental-coastal-road.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'akaroa-day-trip-from-christchurch-car-hire-guide';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-06-20';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Akaroa Day Trip from Christchurch: The Complete Car-Hire Guide',
  description:
    'How to plan a self-drive Akaroa day trip from Christchurch — Hilltop lookout, harbour cruises, Little River stops, driving times and the best rental car for the road.',
  image: `${SITE_URL}${heroImg}`,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  author: { '@type': 'Organization', name: 'James Blond Rentals' },
  publisher: {
    '@type': 'Organization',
    name: 'James Blond Rentals',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    { '@type': 'ListItem', position: 3, name: 'Akaroa Day Trip from Christchurch', item: URL },
  ],
};

const ChristchurchAkaroaDayTrip = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="Akaroa Day Trip from Christchurch: Car Hire Guide (2026)"
      description="Plan the perfect Akaroa day trip from Christchurch. Driving times, Hilltop lookout, harbour cruises, Little River stops, and the best hire car for Banks Peninsula."
      canonical={`/blog/${SLUG}`}
      ogType="article"
      ogImage={`${SITE_URL}${heroImg}`}
    />
    <JsonLd data={articleLd} />
    <JsonLd data={breadcrumbLd} />

    <div className="container mx-auto px-6 pt-12 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
    </div>

    <header className="container mx-auto px-6 pt-8 pb-10 max-w-3xl">
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">South Island · Day trip</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        Akaroa day trip from Christchurch: the complete car-hire guide
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 20 June 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 8 min read</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Banks Peninsula</span>
      </div>
    </header>

    <img src={heroImg} alt="Coastal road on Banks Peninsula near Akaroa — driving from Christchurch" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        Akaroa is the easiest world-class day trip you can take out of Christchurch — a
        French-founded harbour village 84&nbsp;km southeast of the city, wrapped inside an ancient
        volcanic caldera on the Banks Peninsula. With your own rental car you can be sipping a flat
        white on the waterfront within 90 minutes of picking up the keys in central Christchurch.
      </p>

      <h2>How long does it take to drive from Christchurch to Akaroa?</h2>
      <p>
        The drive is <strong>84&nbsp;km via State Highway 75</strong> and takes about
        <strong> 1&nbsp;hour 30&nbsp;minutes</strong> without stops. The road is fully sealed and
        signposted the whole way, but the last 30&nbsp;km climbs and twists across the crater rim, so
        allow extra time if you're not used to alpine-style driving.
      </p>
      <p>
        From Christchurch Airport add roughly 15&nbsp;minutes. From our
        {' '}<Link to="/central-christchurch-car-hire">central Christchurch branch on Moorhouse Ave</Link>{' '}
        you're on SH75 within five minutes of pickup.
      </p>

      <h2>Which rental car is best for the Akaroa road?</h2>
      <p>
        SH75 is a normal touring road — no gravel, no snow risk outside deep winter — so almost any
        car in our range handles it well. In practice we recommend:
      </p>
      <ul>
        <li>
          <strong><Link to="/fleet/cars/premium-economy">Premium Economy</Link></strong> — perfect
          for solo travellers or couples. Automatic, fuel-efficient, easy to park in Akaroa village
          where street parking gets tight from 11&nbsp;am.
        </li>
        <li>
          <strong><Link to="/fleet/cars/premium-compact-suv">Premium Compact SUV</Link></strong> —
          the best all-round pick. A higher seat helps you see over the crater rim road and there's
          room for four adults and picnic gear.
        </li>
        <li>
          <strong><Link to="/fleet/cars/premium-awd-suv">Premium AWD SUV</Link></strong> — only
          worth stepping up to in winter, or if you plan to combine Akaroa with a
          Mt&nbsp;Hutt ski day.
        </li>
      </ul>

      <h2>The classic Akaroa day-trip itinerary</h2>
      <p>Below is the route we suggest to first-time visitors picking up a car with us in the morning:</p>
      <ol>
        <li>
          <strong>8:30&nbsp;am — Pick up in central Christchurch.</strong> Coffee at C1 Espresso on
          High Street or Addington Coffee Co-op, then jump on SH75 south.
        </li>
        <li>
          <strong>9:15&nbsp;am — Little River.</strong> Halfway stop for a stretch. The Little
          River Cafe &amp; Store is a working railway-station cafe with local art and great scones.
        </li>
        <li>
          <strong>10:00&nbsp;am — Hilltop lookout.</strong> The first view of Akaroa Harbour from
          Hilltop Tavern is the postcard moment of the trip. Pull into the sealed layby, not the
          road shoulder.
        </li>
        <li>
          <strong>10:45&nbsp;am — Akaroa waterfront.</strong> Park at Rue Balguerie or the free
          all-day parking on Rue Jolie, then walk the main street. Book harbour cruise tickets at
          Black Cat Cruises on the wharf.
        </li>
        <li>
          <strong>11:15&nbsp;am — Harbour cruise.</strong> The two-hour nature cruise is the
          highlight — you'll almost always see Hector's dolphins, the world's smallest and rarest
          dolphin, only found here.
        </li>
        <li>
          <strong>2:00&nbsp;pm — Lunch on the water.</strong> Trench &amp; Co. or Ma Maison for
          seafood; Akaroa Fish &amp; Chips if you want to eat on the wharf.
        </li>
        <li>
          <strong>3:30&nbsp;pm — Barrys Bay Cheese.</strong> Free tastings of traditional cheddar
          on the drive back — a favourite with families.
        </li>
        <li>
          <strong>5:30&nbsp;pm — Back in Christchurch</strong> in time for dinner in Riverside
          Market.
        </li>
      </ol>

      <h2>Fuel, tolls and driving costs</h2>
      <p>
        The round trip is about <strong>168&nbsp;km</strong>. In a Premium Economy that's roughly
        <strong> 10&nbsp;litres of petrol — around $28 in fuel</strong> at current pump prices.
        There are <strong>no toll roads</strong> on this route. Fill up in Christchurch before you
        leave — fuel in Little River and Akaroa is noticeably more expensive.
      </p>
      <p>
        Ask us about the <Link to="/hot-deals/mobil-fuel-discount">Mobil fuel discount</Link>{' '}
        available on all James Blond rentals — it saves customers 12&nbsp;cents per litre at Mobil
        stations across Canterbury.
      </p>

      <h2>Common mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Underestimating parking.</strong> On summer weekends Akaroa fills up by 11&nbsp;am.
          Arrive before then or park on Rue Jolie and walk five minutes into the village.
        </li>
        <li>
          <strong>Missing the last drive back.</strong> The road across the summit is unlit and can
          get foggy after dark. Aim to leave Akaroa by 5&nbsp;pm in winter.
        </li>
        <li>
          <strong>Skipping the harbour cruise.</strong> You can see Akaroa in an afternoon, but the
          Hector's dolphin experience is the reason most visitors come — book ahead in peak season.
        </li>
      </ul>

      <h2>Ready to plan your trip?</h2>
      <p>
        Book a car online in about 60 seconds. Pick up in central Christchurch or at Christchurch
        Airport, then follow the itinerary above.
      </p>
      <p>
        <Link to="/car-hire-christchurch">→ Browse Christchurch car hire &amp; check availability</Link><br />
        <Link to="/airport/christchurch">→ Christchurch Airport pickup</Link><br />
        <Link to="/one-way-car-hire">→ Continuing to Queenstown? See one-way hire options</Link>
      </p>
    </div>

    <aside className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 py-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Related reading</p>
        <ul className="space-y-3">
          <li>
            <Link to="/blog/mt-hutt-ski-guide-awd-hire-christchurch" className="hover:text-primary">
              → Mt Hutt ski guide: hiring an AWD SUV from Christchurch
            </Link>
          </li>
          <li>
            <Link to="/car-hire-christchurch" className="hover:text-primary">
              → Car hire Christchurch — full range, both branches
            </Link>
          </li>
          <li>
            <Link to="/fleet/cars/premium-compact-suv" className="hover:text-primary">
              → Premium Compact SUV — the best day-trip car
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  </article>
);

export default ChristchurchAkaroaDayTrip;