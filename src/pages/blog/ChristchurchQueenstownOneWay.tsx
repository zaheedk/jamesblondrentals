import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Route } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/awd-suv-nz-mountain-adventure.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'one-way-car-hire-christchurch-to-queenstown';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-06-24';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'One-way car hire Christchurch to Queenstown: the complete guide',
  description:
    'Route options, driving times, best stops (Tekapo, Aoraki/Mt Cook, Lindis Pass) and how to book a one-way rental from Christchurch to Queenstown.',
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
    { '@type': 'ListItem', position: 3, name: 'Christchurch to Queenstown one-way hire', item: URL },
  ],
};

const ChristchurchQueenstownOneWay = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="One-Way Car Hire Christchurch to Queenstown: Full Guide (2026)"
      description="Route options, driving times, best stops and how to book a one-way rental from Christchurch to Queenstown. Fees, tips and the best hire car for the drive."
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
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">South Island · One-way hire</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        One-way car hire Christchurch to Queenstown: the complete guide
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 24 June 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 10 min read</span>
        <span className="inline-flex items-center gap-1.5"><Route className="h-4 w-4" /> 483 km</span>
      </div>
    </header>

    <img src={heroImg} alt="AWD SUV on the road between Christchurch and Queenstown via Lake Tekapo" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        The drive from Christchurch to Queenstown is one of the great road trips in the world — 483&nbsp;km
        that carry you from the Canterbury Plains, past turquoise Lake Tekapo, over the Lindis Pass and
        down into the Southern Alps. A one-way hire lets you fly into Christchurch, drive the route
        properly, and fly out of Queenstown without doubling back.
      </p>

      <h2>How long does the drive take?</h2>
      <p>
        <strong>Direct: about 6 hours</strong> non-stop via SH1 south then SH8 inland through Tekapo,
        Twizel and the Lindis Pass. Most travellers take 8–10 hours with photo stops, or split the
        drive into two days with an overnight in Tekapo or Twizel.
      </p>

      <h2>Best stops on the route</h2>
      <ol>
        <li><strong>Rakaia Gorge</strong> — dramatic braided-river bridge, 1 hour out of Christchurch.</li>
        <li><strong>Lake Tekapo</strong> — the Church of the Good Shepherd and Mt John Observatory.</li>
        <li><strong>Aoraki / Mt Cook</strong> — a 1-hour detour off SH8, but worth it on a clear day.</li>
        <li><strong>Twizel &amp; Lake Pukaki</strong> — the best salmon and the bluest water in the country.</li>
        <li><strong>Lindis Pass</strong> — a golden tussock landscape unlike anywhere else in NZ.</li>
        <li><strong>Cromwell fruit stalls</strong> — cherries and stone fruit in summer.</li>
      </ol>

      <h2>Best rental car for the drive</h2>
      <p>
        In summer, our <Link to="/fleet/cars/premium-midsize">Premium Midsize</Link> or{' '}
        <Link to="/fleet/cars/premium-compact-suv">Premium Compact SUV</Link> handle the drive
        comfortably with plenty of luggage space. In winter, upgrade to a{' '}
        <Link to="/fleet/cars/premium-awd-suv">Premium AWD SUV</Link> — the Lindis Pass can carry
        black ice into October.
      </p>

      <h2>How much does one-way hire cost?</h2>
      <p>
        James Blond offers one-way hires between Christchurch and Queenstown with a modest relocation
        fee compared to the major chains. See live availability and one-way fees on our{' '}
        <Link to="/one-way-car-hire">one-way car hire page</Link>. Booking 2–3 weeks ahead usually
        gets you the best rate.
      </p>

      <h2>Pickup and drop-off logistics</h2>
      <ul>
        <li>Pick up in central Christchurch (Moorhouse Ave) or at{' '}
          <Link to="/airport/christchurch">Christchurch Airport</Link>.</li>
        <li>Drop off at our Queenstown partner location — details confirmed at booking.</li>
        <li>Fuel the car before drop-off (last cheap fuel is in Cromwell).</li>
      </ul>

      <h2>Ready to plan the trip?</h2>
      <p>
        <Link to="/one-way-car-hire">→ Book one-way Christchurch → Queenstown</Link><br />
        <Link to="/car-hire-christchurch">→ See the full Christchurch car hire range</Link>
      </p>
    </div>
  </article>
);

export default ChristchurchQueenstownOneWay;