import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, MapPin } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/couple-moving-boxes-truck.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'truck-hire-christchurch-to-rolleston-rangiora';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-07-09';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Moving from Christchurch to Rolleston or Rangiora: Truck Hire Guide',
  description:
    'Planning a move from Christchurch out to Rolleston, Lincoln or Rangiora? Driving times, best truck sizes, hourly hire rates and how to keep the move to one trip.',
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
    { '@type': 'ListItem', position: 3, name: 'Christchurch to Rolleston / Rangiora truck hire', item: URL },
  ],
};

const ChristchurchToRollestonRangiora = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="Christchurch to Rolleston & Rangiora Truck Hire — Moving Guide"
      description="Moving from Christchurch out to Rolleston, Lincoln or Rangiora? Driving times, truck sizes, hourly rates and tips to finish the move in a single trip."
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
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Canterbury · Moving guide</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        Moving from Christchurch to Rolleston or Rangiora: truck hire guide
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 9 July 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 6 min read</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Canterbury</span>
      </div>
    </header>

    <img src={heroImg} alt="Couple loading boxes into a moving truck in Christchurch" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        Rolleston, Lincoln, Prebbleton and Rangiora are some of the fastest-growing towns in
        Canterbury — and every weekend, dozens of Christchurch families move out to them. Because
        the drive is 25–35&nbsp;km each way, choosing the right truck (and doing the move in one
        trip rather than three) is what separates a smooth Saturday from an 18-hour marathon.
      </p>

      <h2>How far is the drive?</h2>
      <ul>
        <li><strong>Christchurch CBD → Rolleston</strong> — 25&nbsp;km via SH1, about 30 minutes with a loaded truck.</li>
        <li><strong>Christchurch CBD → Lincoln</strong> — 22&nbsp;km via Springs Road, about 30 minutes.</li>
        <li><strong>Christchurch CBD → Rangiora</strong> — 30&nbsp;km via SH1 and the Northern Motorway, about 35 minutes.</li>
        <li><strong>Christchurch Airport → Rolleston</strong> — 22&nbsp;km via Russley Road / SH1, 25 minutes.</li>
      </ul>
      <p>
        A round trip is a solid <strong>90 minutes on the clock plus loading time</strong>. If you'd
        need two trips in a smaller truck, you can usually save an hour of billed hire time by
        stepping up one size.
      </p>

      <h2>Which truck size for a Rolleston / Rangiora move?</h2>
      <p>
        Because you're paying for both drive time and loading time, one-trip capacity is worth more
        than for an inner-city move. Our recommendation:
      </p>
      <ul>
        <li><strong>1–2 bedroom:</strong> 2-tonne 16m³ box truck with tail lift — <strong>from $39/hr</strong></li>
        <li><strong>3 bedroom family home:</strong> 3-tonne 19m³ box with tail lift — <strong>from $45/hr</strong></li>
        <li><strong>4+ bedroom or double garage:</strong> 3-tonne 19m³ plus a caged trailer</li>
      </ul>
      <p>
        Full sizes, photos and live availability are on the
        {' '}<Link to="/truck-hire-christchurch">truck hire Christchurch</Link>{' '}
        page.
      </p>

      <h2>Best pickup branch for a move out south or north</h2>
      <ul>
        <li><strong>Moving to Rolleston, Lincoln or Prebbleton?</strong> Pick up at our
          {' '}<Link to="/contact/christchurch">Airport branch (Harewood)</Link>{' '}
          — you're straight onto Russley Rd and SH1 with no CBD detours.</li>
        <li><strong>Moving to Rangiora, Kaiapoi or Woodend?</strong> The
          {' '}<Link to="/contact/christchurch-central">Central Christchurch branch</Link>{' '}
          puts you a couple of minutes from the Northern Motorway onramp.</li>
      </ul>

      <h2>One-trip move: a rough plan</h2>
      <ol>
        <li><strong>7:30&nbsp;am</strong> — pick up the truck, do the walk-around, load moving blankets and a trolley.</li>
        <li><strong>8:00&nbsp;am</strong> — start loading at the Christchurch house.</li>
        <li><strong>11:00&nbsp;am</strong> — hit the road with the fully loaded truck.</li>
        <li><strong>11:30&nbsp;am</strong> — arrive Rolleston / Rangiora, start unloading.</li>
        <li><strong>2:30&nbsp;pm</strong> — empty truck, quick tidy, drive back.</li>
        <li><strong>3:30&nbsp;pm</strong> — drop off at the branch. ~8 hours billed.</li>
      </ol>

      <h2>Money-saving tips</h2>
      <ul>
        <li><strong>Book midweek if you can</strong> — Tuesday through Thursday is our
          {' '}<Link to="/hot-deals/midweek-truck-van-discount">discounted midweek rate</Link>.</li>
        <li><strong>Pack everything in boxes the night before</strong> — you're paying by the hour, not by the trip.</li>
        <li><strong>Fill up at Mobil before drop-off</strong> — ask about the
          {' '}<Link to="/hot-deals/mobil-fuel-discount">Mobil fuel discount</Link>{' '}
          included with every James Blond rental.</li>
      </ul>

      <h2>Ready to book?</h2>
      <p>
        Check live rates and secure your Saturday date on the
        {' '}<Link to="/truck-hire-christchurch">truck hire Christchurch</Link>{' '}
        page, or call our team on <a href="tel:0800525663">0800 525 663</a>.
      </p>
    </div>

    <aside className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 py-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Related reading</p>
        <ul className="space-y-3">
          <li><Link to="/blog/moving-house-christchurch-truck-hire-guide" className="hover:text-primary">→ 2-tonne vs 3-tonne — which truck fits your move?</Link></li>
          <li><Link to="/blog/how-to-drive-moving-truck-christchurch" className="hover:text-primary">→ How to drive a moving truck in Christchurch</Link></li>
          <li><Link to="/truck-hire-christchurch" className="hover:text-primary">→ Truck hire Christchurch — full fleet</Link></li>
        </ul>
      </div>
    </aside>
  </article>
);

export default ChristchurchToRollestonRangiora;