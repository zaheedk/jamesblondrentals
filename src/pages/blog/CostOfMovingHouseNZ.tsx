import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, MapPin } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'cost-of-moving-house-nz-2026';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-07-11';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Real Cost of Moving House in New Zealand (2026)',
  description:
    'How much does it really cost to move house in NZ in 2026? Truck hire, movers, packing, insurance and the DIY vs full-service breakdown for Auckland, Wellington and Christchurch.',
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
    { '@type': 'ListItem', position: 3, name: 'Cost of moving house in NZ', item: URL },
  ],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does it cost to move house in New Zealand in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: 'A DIY move using a hire truck typically costs $150–$450 for a 1–2 bedroom home and $400–$900 for a 3–4 bedroom home. Full-service movers usually charge $1,200–$3,500 for the same jobs, and $4,000+ for larger 4+ bedroom homes or interisland moves.' },
    },
    {
      '@type': 'Question',
      name: 'Is it cheaper to hire a truck or use professional movers?',
      acceptedAnswer: { '@type': 'Answer', text: 'DIY truck hire is roughly 60–75% cheaper than a full-service move for a 1–3 bedroom home, provided you have friends or family to help load. Once you factor in loaders, packing and insurance, the gap narrows on larger homes.' },
    },
    {
      '@type': 'Question',
      name: 'What size truck do I need to move house in NZ?',
      acceptedAnswer: { '@type': 'Answer', text: 'A studio or 1-bedroom flat fits in a 2-tonne van or a 12m³ truck. A 2–3 bedroom home usually needs a 16m³ box truck. A 4+ bedroom home is best moved with a 19m³ tail-lift truck or two return trips.' },
    },
    {
      '@type': 'Question',
      name: 'When are the cheapest days to move house in New Zealand?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mid-week (Tuesday–Thursday) and outside the end-of-month rush are typically the cheapest and easiest days to book a hire truck or movers. Friday, Saturday and month-end weekends are the most expensive and book out weeks in advance.' },
    },
    {
      '@type': 'Question',
      name: 'Do I need insurance when I move house?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your contents insurance usually covers items in transit only if a professional mover is used — check your policy. DIY moves generally need transit cover added, and hire trucks include basic vehicle cover with an excess that can be reduced.' },
    },
  ],
};

const CostOfMovingHouseNZ = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="Cost of Moving House in NZ (2026) — Full Breakdown"
      description="How much does it cost to move house in New Zealand in 2026? Truck hire vs full-service movers, packing, insurance and city-by-city price ranges for Auckland, Wellington and Christchurch."
      canonical={`/blog/${SLUG}`}
      ogType="article"
    />
    <JsonLd data={articleLd} />
    <JsonLd data={breadcrumbLd} />
    <JsonLd data={faqLd} />

    <div className="container mx-auto px-6 pt-12 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
    </div>

    <header className="container mx-auto px-6 pt-8 pb-10 max-w-3xl">
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Guide · Moving</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        The real cost of moving house in New Zealand (2026)
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 11 July 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 9 min read</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Auckland · Wellington · Christchurch</span>
      </div>
    </header>

    <div className="container mx-auto px-6 py-4 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        Moving house in New Zealand in 2026 costs anywhere from <strong>$150 for a small DIY move</strong> to
        <strong> $5,000+ for a full-service four-bedroom relocation</strong>. The gap is huge, and the difference
        comes down to five things: home size, distance, packing, labour and insurance. Here's the honest
        breakdown so you can budget with confidence.
      </p>

      <h2>DIY move: hire a truck and do it yourself</h2>
      <p>
        Hiring a truck and moving yourself is by far the cheapest option, especially if you can round up a few
        mates and buy them lunch. Typical 2026 pricing:
      </p>
      <ul>
        <li><strong>Studio / 1-bedroom flat</strong> — $150–$250 (2-tonne van or 12m³ truck, half day)</li>
        <li><strong>2-bedroom home</strong> — $250–$450 (12–16m³ truck, one day)</li>
        <li><strong>3-bedroom home</strong> — $400–$700 (16m³ truck, one day, possibly two trips)</li>
        <li><strong>4-bedroom home</strong> — $600–$900 (19m³ tail-lift truck, full day or weekend)</li>
      </ul>
      <p>
        Add roughly $30–$60 for straps, blankets and a hand trolley — well worth it to avoid damage. See our
        <Link to="/fleet/trucks"> full truck fleet</Link> for sizes and daily rates.
      </p>

      <h2>Full-service movers: they do everything</h2>
      <p>
        Full-service movers pack, load, drive and unload. Prices vary by city but the 2026 market rate looks
        like this:
      </p>
      <ul>
        <li><strong>1-bedroom apartment</strong> — $600–$1,200</li>
        <li><strong>2-bedroom home</strong> — $1,200–$2,200</li>
        <li><strong>3-bedroom home</strong> — $2,000–$3,500</li>
        <li><strong>4+ bedroom home</strong> — $3,500–$5,500+</li>
        <li><strong>Interisland (e.g. Auckland → Christchurch)</strong> — add $1,500–$3,000 for ferry & long-haul</li>
      </ul>

      <h2>What actually drives the cost</h2>
      <ul>
        <li><strong>Home size</strong> — measured in bedrooms and cubic metres of contents.</li>
        <li><strong>Distance</strong> — cross-town vs cross-country. Wellington ↔ Auckland is roughly $1.20–$2.50/km on top.</li>
        <li><strong>Access</strong> — narrow driveways, stairs, apartment buildings and long carries all add hourly labour.</li>
        <li><strong>Packing</strong> — DIY-pack yourself with $50–$150 of boxes, or pay $400–$1,200 for pro packing.</li>
        <li><strong>Insurance</strong> — transit cover is $50–$250 depending on declared value.</li>
        <li><strong>Timing</strong> — weekends and end-of-month cost 15–30% more than mid-week.</li>
      </ul>

      <h2>City-by-city price snapshot</h2>

      <h3>Auckland</h3>
      <p>
        Auckland is the most expensive market for movers thanks to traffic and long carries in the central
        suburbs. A DIY move with a hire truck from us runs $150–$900 depending on size. See
        <Link to="/truck-hire"> our Auckland truck hire</Link> or
        <Link to="/trailer-hire-auckland"> Auckland trailer hire</Link> for smaller loads.
      </p>

      <h3>Wellington</h3>
      <p>
        Hilly streets and tight parking make Wellington moves slightly slower — but shorter distances keep costs
        moderate. See <Link to="/wellington-truck-rentals">Wellington truck hire</Link> or
        <Link to="/trailer-hire-wellington"> Wellington trailer hire</Link>.
      </p>

      <h3>Christchurch</h3>
      <p>
        Christchurch is the cheapest of the three main cities for a DIY move — flat terrain, easy driveways and
        strong supply of hire trucks. See
        <Link to="/truck-hire-christchurch"> Christchurch truck hire</Link> or
        <Link to="/trailer-hire-christchurch"> Christchurch trailer hire</Link>. If you're heading to Rolleston or
        Rangiora, read our
        <Link to="/blog/truck-hire-christchurch-to-rolleston-rangiora"> Rolleston/Rangiora truck guide</Link>.
      </p>

      <h2>How to keep the cost down</h2>
      <ol>
        <li><strong>Move mid-week and mid-month.</strong> Avoid Friday/Saturday and the last weekend of the month.</li>
        <li><strong>Right-size the truck.</strong> One big-truck trip beats three small-van trips on fuel and time.</li>
        <li><strong>Pack yourself, hire loaders.</strong> A hybrid model saves 30–40% vs full-service.</li>
        <li><strong>Declutter first.</strong> Every extra cubic metre costs money, whether you DIY or pay movers.</li>
        <li><strong>Book early.</strong> End-of-month trucks book out 2–3 weeks in advance in every main centre.</li>
      </ol>

      <h2>Ready to price your move?</h2>
      <p>
        Grab a truck online in about 60 seconds — we show live pricing and availability at every branch.
      </p>
      <p>
        <Link to="/booking">→ Book a moving truck</Link><br />
        <Link to="/fleet/trucks">→ Browse the truck fleet</Link><br />
        <Link to="/moving-truck-hire-auckland">→ Auckland moving truck hire</Link><br />
        <Link to="/wellington-truck-rentals">→ Wellington truck hire</Link><br />
        <Link to="/truck-hire-christchurch">→ Christchurch truck hire</Link>
      </p>
    </div>

    <aside className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 py-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Related reading</p>
        <ul className="space-y-3">
          <li>
            <Link to="/blog/moving-house-christchurch-truck-hire-guide" className="hover:text-primary">
              → Moving house in Christchurch — truck hire guide
            </Link>
          </li>
          <li>
            <Link to="/blog/how-to-drive-moving-truck-christchurch" className="hover:text-primary">
              → How to drive a moving truck safely
            </Link>
          </li>
          <li>
            <Link to="/blog/driving-in-new-zealand-with-overseas-license" className="hover:text-primary">
              → Driving in NZ with an overseas licence
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  </article>
);

export default CostOfMovingHouseNZ;