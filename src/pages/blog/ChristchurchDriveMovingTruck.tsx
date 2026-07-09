import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, MapPin } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/truck-open-doors-loading-boxes.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'how-to-drive-moving-truck-christchurch';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-07-09';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Drive a Moving Truck in Christchurch (First-Timer Tips)',
  description:
    'A practical first-timer guide to driving a 2-tonne or 3-tonne moving truck in Christchurch — mirrors, tail lifts, one-way streets, low bridges and parking rules.',
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
    { '@type': 'ListItem', position: 3, name: 'How to drive a moving truck in Christchurch', item: URL },
  ],
};

const ChristchurchDriveMovingTruck = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="How to Drive a Moving Truck in Christchurch — First-Timer Tips"
      description="First time driving a moving truck? Practical tips for Christchurch — mirrors, tail lifts, CBD one-ways, low bridges and where to park a 3-tonne truck."
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
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Christchurch · Driver tips</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        How to drive a moving truck in Christchurch (first-timer tips)
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 9 July 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 5 min read</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Christchurch</span>
      </div>
    </header>

    <img src={heroImg} alt="Moving truck with open doors ready for loading in Christchurch" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        If you've only ever driven a hatchback, sliding behind the wheel of a 3-tonne moving truck
        can feel intimidating. It shouldn't — every truck we hire in Christchurch is automatic,
        power-steered, and drivable on a normal car licence. The tricks below will have you
        confident within the first 10 minutes of pickup.
      </p>

      <h2>Before you drive off the yard</h2>
      <ul>
        <li><strong>Adjust both wing mirrors.</strong> There's no rear-view mirror — the wing mirrors are your eyes. Set the upper flat mirror to just include the back corner of the truck, and the lower convex mirror to see the kerb.</li>
        <li><strong>Walk the truck.</strong> Height, width and any existing dings. Our team does this with you at pickup — take a phone photo of every side.</li>
        <li><strong>Know your height.</strong> The 3-tonne 19m³ box truck is about <strong>3.4&nbsp;m tall</strong>. Write it on your phone lock-screen for the day — it decides which drive-throughs and car parks you can enter.</li>
      </ul>

      <h2>The five Christchurch spots that catch first-timers out</h2>
      <ol>
        <li><strong>Colombo Street CBD block</strong> — one-way southbound only from Kilmore to Cashel. Easy to miss if you're following GPS.</li>
        <li><strong>Riccarton Mall car park</strong> — the lower deck has a <strong>2.1&nbsp;m clearance</strong>. Park at the outdoor bays behind Bunnings instead.</li>
        <li><strong>Sumner Road tunnel</strong> — 4.2&nbsp;m clearance is fine, but the road narrows sharply on the coast side. Take it slow.</li>
        <li><strong>Hagley Park loop</strong> — no trucks over 3.5&nbsp;t on the inner roads. Use Riccarton Ave instead.</li>
        <li><strong>Rolleston / Lincoln roundabouts</strong> — swing wider than you think, especially with a tail-lift extension.</li>
      </ol>

      <h2>Reversing without a rear window</h2>
      <p>
        All our Christchurch trucks have a reversing camera, but it's not a substitute for a
        spotter. When you're backing into a driveway:
      </p>
      <ul>
        <li>Get a friend to stand at the rear <strong>on the driver's side</strong> where you can see them in the mirror — never behind the truck in the blind zone.</li>
        <li>Move in <strong>metre-by-metre steps</strong>, not one long slow reverse.</li>
        <li>If in doubt, GOAL — <em>Get Out And Look</em>.</li>
      </ul>

      <h2>Using the tail lift safely</h2>
      <ul>
        <li>Handbrake on, engine off, chocks under the wheels on any slope.</li>
        <li>Never overload — our 3-tonne tail lift is rated to <strong>500&nbsp;kg</strong>. A fridge (~90&nbsp;kg) plus a person is fine; a fridge plus a washing machine plus a person is not.</li>
        <li>Fold the lift back up before you drive off — sounds obvious, but it's the single most common damage claim.</li>
      </ul>

      <h2>Parking overnight in Christchurch</h2>
      <p>
        On-street parking for trucks over 3.5&nbsp;m long is restricted in most Christchurch
        residential zones between 10pm and 6am. If you're mid-move and need to leave the truck
        loaded overnight, park it back at the branch — free and secure — and we'll re-issue you the
        keys first thing in the morning.
      </p>

      <h2>Book with confidence</h2>
      <p>
        Every hire includes a walk-around briefing at pickup, and our team will happily take you
        for a quick loop around the yard before you head into traffic. Book online in about a
        minute on the
        {' '}<Link to="/truck-hire-christchurch">truck hire Christchurch</Link>{' '}
        page.
      </p>
      <p>
        <Link to="/truck-hire-christchurch">→ See Christchurch truck hire rates &amp; availability</Link><br />
        <Link to="/blog/moving-house-christchurch-truck-hire-guide">→ Not sure which size? Read the 2-tonne vs 3-tonne guide</Link>
      </p>
    </div>

    <aside className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 py-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Related reading</p>
        <ul className="space-y-3">
          <li><Link to="/truck-hire-christchurch" className="hover:text-primary">→ Truck hire Christchurch — full fleet</Link></li>
          <li><Link to="/contact/christchurch" className="hover:text-primary">→ Christchurch Airport branch — pickup instructions</Link></li>
          <li><Link to="/contact/christchurch-central" className="hover:text-primary">→ Central Christchurch branch</Link></li>
        </ul>
      </div>
    </aside>
  </article>
);

export default ChristchurchDriveMovingTruck;