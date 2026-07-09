import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, MapPin } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/family-unloading-removal-truck.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'moving-house-christchurch-truck-hire-guide';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-07-09';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Moving House in Christchurch: 2-Tonne vs 3-Tonne Truck Hire Guide',
  description:
    'Which size moving truck do you need for a Christchurch house move? Compare 2-tonne and 3-tonne trucks, tail-lift options, licence rules and hourly hire costs.',
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
    { '@type': 'ListItem', position: 3, name: 'Moving House in Christchurch — Truck Hire Guide', item: URL },
  ],
};

const ChristchurchMovingTruckGuide = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="Moving House in Christchurch: 2-Tonne vs 3-Tonne Truck Guide"
      description="Compare 2-tonne and 3-tonne moving trucks for your Christchurch house move — sizes, tail lifts, car-licence rules and hourly hire from $35/hr."
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
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Christchurch · Moving guide</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        Moving house in Christchurch: 2-tonne vs 3-tonne truck hire guide
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 9 July 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 6 min read</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Christchurch</span>
      </div>
    </header>

    <img src={heroImg} alt="Family unloading a moving truck at a Christchurch house move" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        Booking the wrong-sized moving truck is the number-one cause of stressful moving days in
        Christchurch — too small and you're doing two trips across town; too big and you're paying
        for space you never use. This guide breaks down which truck fits which move, what you can
        drive on a car licence, and the hourly rates for
        {' '}<Link to="/truck-hire-christchurch">truck hire Christchurch</Link>{' '}
        with James Blond Rentals.
      </p>

      <h2>Can I drive a moving truck on a car licence?</h2>
      <p>
        Yes. Every truck in our Christchurch fleet — including 2-tonne and 3-tonne box trucks with
        tail lifts — is under the 6,000&nbsp;kg GVM limit, so a standard NZ Class 1 (car) licence
        is all you need. No truck licence, no dangerous-goods endorsement, no age surcharge above
        21.
      </p>

      <h2>2-tonne truck — 1 to 2 bedroom moves</h2>
      <p>
        Our <strong>2-tonne 12m³ and 16m³ box trucks</strong> are the workhorse of a Christchurch
        house move. They fit a 1–2 bedroom flat comfortably and drive almost exactly like a large
        van — automatic, power steering, reversing camera.
      </p>
      <ul>
        <li><strong>Best for:</strong> studio, 1-bed, 2-bed apartment or townhouse moves</li>
        <li><strong>Fits:</strong> queen bed, 3-seater sofa, fridge, washing machine, ~40 boxes</li>
        <li><strong>Tail lift option:</strong> yes — recommended for anything heavier than a fridge</li>
        <li><strong>From:</strong> $35/hr in Christchurch</li>
      </ul>
      <p>
        Most Riccarton, Addington, Sydenham and Ilam flat-movers pick this size.
      </p>

      <h2>3-tonne truck — 3 to 4 bedroom family homes</h2>
      <p>
        Stepping up to a <strong>3-tonne 19m³ box truck with tail lift</strong> means a full family
        home moves in a single trip instead of three.
      </p>
      <ul>
        <li><strong>Best for:</strong> 3-bed and 4-bed houses in Hornby, Rolleston, Halswell, Rangiora</li>
        <li><strong>Fits:</strong> king bed + queen + two singles, full lounge suite, dining set, fridge, chest freezer, ~80 boxes</li>
        <li><strong>Tail lift option:</strong> standard on the 3-tonne — makes fridges and washing machines a one-person job</li>
        <li><strong>From:</strong> $45/hr in Christchurch</li>
      </ul>

      <h2>Christchurch pricing at a glance</h2>
      <p>
        All our Christchurch trucks are billed hourly with a 2-hour minimum. Diesel is refuelled by
        us at the industry standard rate — no need to hunt for a truck-stop pump when you drop off.
      </p>
      <ul>
        <li>2-tonne 12m³ box — <strong>from $35/hr</strong></li>
        <li>2-tonne 16m³ box with tail lift — <strong>from $39/hr</strong></li>
        <li>3-tonne 19m³ box with tail lift — <strong>from $45/hr</strong></li>
        <li>Daily rates available from <strong>$179/day</strong></li>
      </ul>

      <h2>Where to pick up in Christchurch</h2>
      <p>
        We run two Christchurch branches — both stock the full truck range and both are open 8am–5pm
        seven days.
      </p>
      <ul>
        <li><Link to="/contact/christchurch">Christchurch Airport branch</Link> — 17/25 Logistics Drive, Harewood. Free shuttle from the terminal.</li>
        <li><Link to="/contact/christchurch-central">Central Christchurch branch</Link> — quick access to the CBD, Riccarton and Addington.</li>
      </ul>

      <h2>Tips before you book</h2>
      <ul>
        <li><strong>Book early on Fridays and month-end weekends</strong> — Christchurch truck stock sells out first for these dates.</li>
        <li><strong>Ask about our midweek discount</strong> — Tuesday–Thursday hires are noticeably cheaper.</li>
        <li><strong>Grab moving blankets and a trolley</strong> — both are available as add-ons at pickup.</li>
      </ul>

      <h2>Ready to book?</h2>
      <p>
        See live availability and rates for every truck in our fleet on the
        {' '}<Link to="/truck-hire-christchurch">truck hire Christchurch</Link>{' '}
        page, or call our team on <a href="tel:0800525663">0800 525 663</a>.
      </p>
      <p>
        <Link to="/truck-hire-christchurch">→ Browse Christchurch truck hire &amp; check availability</Link><br />
        <Link to="/blog/how-to-drive-moving-truck-christchurch">→ Next: how to drive a moving truck in Christchurch</Link><br />
        <Link to="/blog/truck-hire-christchurch-to-rolleston-rangiora">→ Moving to Rolleston or Rangiora? Read this next</Link>
      </p>
    </div>

    <aside className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 py-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Related reading</p>
        <ul className="space-y-3">
          <li><Link to="/truck-hire-christchurch" className="hover:text-primary">→ Truck hire Christchurch — full range &amp; hourly rates</Link></li>
          <li><Link to="/van-hire-christchurch" className="hover:text-primary">→ Van hire Christchurch — smaller moves &amp; couriers</Link></li>
          <li><Link to="/hot-deals/midweek-truck-van-discount" className="hover:text-primary">→ Midweek truck &amp; van discount</Link></li>
        </ul>
      </div>
    </aside>
  </article>
);

export default ChristchurchMovingTruckGuide;