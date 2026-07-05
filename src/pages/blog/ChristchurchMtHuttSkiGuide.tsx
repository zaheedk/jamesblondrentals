import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Snowflake } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/hero-ski-season.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'mt-hutt-ski-guide-awd-hire-christchurch';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-06-22';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mt Hutt Ski Guide: Hiring an AWD SUV from Christchurch',
  description:
    'Everything you need to know about driving to Mt Hutt from Christchurch — chain rules, AWD vs 2WD, parking, weather, and the best hire car for a South Island ski trip.',
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
    { '@type': 'ListItem', position: 3, name: 'Mt Hutt ski guide from Christchurch', item: URL },
  ],
};

const ChristchurchMtHuttSkiGuide = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="Mt Hutt Ski Guide: AWD SUV Hire from Christchurch (2026)"
      description="Driving to Mt Hutt from Christchurch: chain rules, AWD vs 2WD, weather, parking and the best rental car for a South Island ski day. Full ski-season guide."
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
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">South Island · Ski season</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        Mt Hutt ski guide: hiring an AWD SUV from Christchurch
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 22 June 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 9 min read</span>
        <span className="inline-flex items-center gap-1.5"><Snowflake className="h-4 w-4" /> Winter</span>
      </div>
    </header>

    <img src={heroImg} alt="AWD SUV on a snowy alpine road heading to Mt Hutt from Christchurch" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        Mt Hutt is the closest major ski field to Christchurch — a genuine "wake up in the city, ski
        by 10&nbsp;am" resort. But the last 13&nbsp;km of access road is unsealed, steep and often
        icy, so the car you choose from Christchurch makes a real difference to your day.
      </p>

      <h2>How far is Mt Hutt from Christchurch?</h2>
      <p>
        Mt Hutt village base is <strong>118&nbsp;km southwest of Christchurch</strong> — about
        <strong> 1&nbsp;hour 45&nbsp;minutes</strong> in good weather. The route runs SH1 south to
        Rakaia, then SH77 through Methven to the ski-field access road. From Christchurch Airport it's
        an almost identical drive time.
      </p>

      <h2>Do I need an AWD or 4WD hire car for Mt Hutt?</h2>
      <p>
        <strong>Legally, no.</strong> Mt Hutt's road is open to 2WD cars — but only if you carry and
        can fit snow chains, and only when road conditions allow it. In practice, a 2WD car with
        chains works on a mild day; on cold mornings or after fresh snow, the field controls the
        gate and can turn 2WDs back until conditions improve.
      </p>
      <p>
        For any serious ski day we recommend our{' '}
        <strong><Link to="/fleet/cars/premium-awd-suv">Premium AWD SUV</Link></strong> for three
        reasons:
      </p>
      <ul>
        <li>
          <strong>You'll actually make it up.</strong> AWD cars are almost never turned back at the
          Mt Hutt chain-fit bay.
        </li>
        <li>
          <strong>No stopping in a queue on ice</strong> to fit chains at –2°C with wet hands.
        </li>
        <li>
          <strong>The drive home is safer.</strong> Descending 13&nbsp;km of gravel with a boot full
          of tired skiers is where 2WD cars slide.
        </li>
      </ul>
      <p>
        Ski racks and snow chains can be added to any James Blond booking — request them when you
        {' '}<Link to="/car-hire-christchurch">book a Christchurch car online</Link>.
      </p>

      <h2>What time should I leave Christchurch?</h2>
      <p>
        On a powder day the Mt Hutt car park fills before 9&nbsp;am. Aim to leave central
        Christchurch by <strong>7:00&nbsp;am</strong> — that puts you on the access road by 8:30 and
        in a lift queue by 9:15. Grab breakfast in Methven if you have time; the Blue Pub and
        Cafe&nbsp;131 both open early through the ski season.
      </p>

      <h2>Chain rules, road status and safety</h2>
      <ul>
        <li>
          <strong>Chain-fit bay:</strong> 6&nbsp;km up the access road. If chains are required,
          staff wave you into the bay — don't try to skip it.
        </li>
        <li>
          <strong>Live road status:</strong> Check the NZSki Mt Hutt page every morning before you
          leave the city. Road status posts by 6:30&nbsp;am.
        </li>
        <li>
          <strong>Descending:</strong> Use engine braking (drop to L or 2 on an auto). Riding the
          brakes on 13&nbsp;km of gravel overheats them fast.
        </li>
        <li>
          <strong>Insurance:</strong> All our rentals include comprehensive cover; you can reduce
          the excess at booking for the ski trip.
        </li>
      </ul>

      <h2>What does a Mt Hutt ski trip actually cost from Christchurch?</h2>
      <p>
        For two adults over one ski day picking up a Premium AWD SUV in central Christchurch,
        typical costs are:
      </p>
      <ul>
        <li>1-day AWD SUV hire (peak winter): from around $189</li>
        <li>Fuel (Christchurch ↔ Mt Hutt round trip): ~$45</li>
        <li>Ski racks (per day): from $10</li>
        <li>Snow chains (per hire, optional): from $25</li>
      </ul>
      <p>
        That's roughly <strong>$130 per person before lift passes</strong> — and you get a full car
        for the rest of the trip, which is why hiring for a week and doing 2–3 ski days is usually
        the best value option.
      </p>

      <h2>Beyond Mt Hutt: other Canterbury ski fields</h2>
      <p>
        Christchurch also gives you access to Porters, Cheeseman, Broken River, Craigieburn and
        Temple Basin — all club fields with steeper, narrower access roads where an AWD SUV is even
        more important than at Mt Hutt.
      </p>

      <h2>Ready to book?</h2>
      <p>
        <Link to="/fleet/cars/premium-awd-suv">→ Reserve a Premium AWD SUV</Link><br />
        <Link to="/car-hire-christchurch">→ Full Christchurch car hire range</Link><br />
        <Link to="/airport/christchurch">→ Christchurch Airport ski pickup</Link>
      </p>
    </div>

    <aside className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 py-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Related reading</p>
        <ul className="space-y-3">
          <li>
            <Link to="/blog/akaroa-day-trip-from-christchurch-car-hire-guide" className="hover:text-primary">
              → Akaroa day trip from Christchurch: the complete guide
            </Link>
          </li>
          <li>
            <Link to="/car-hire-christchurch" className="hover:text-primary">
              → Car hire Christchurch — cars, SUVs, vans &amp; trucks
            </Link>
          </li>
          <li>
            <Link to="/one-way-car-hire" className="hover:text-primary">
              → One-way hire Christchurch → Queenstown
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  </article>
);

export default ChristchurchMtHuttSkiGuide;