import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, MapPin, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { wellingtonBlogSEO } from '@/seo/wellington-blog';
import movingBoxes from '@/assets/truck-moving-boxes-household-items.jpg';
import loadingTruck from '@/assets/truck-open-doors-loading-boxes.jpg';

const guides = [
  { id: 'choose-your-vehicle', category: 'Hire tips', title: 'Van or truck? Choose for your load, not just your budget', description: 'Measure the big items, compare cargo space and check the licence before you book.', time: '3 min read' },
  { id: 'moving-day-checklist', category: 'Moving guide', title: 'Your Wellington moving-day checklist', description: 'From apartment lift bookings to a return before closing time: a practical plan for the day.', time: '4 min read' },
  { id: 'wellington-access', category: 'Local advice', title: 'Loading, parking and access around Wellington', description: 'Plan both ends of the move, especially on narrow streets and at inner-city apartments.', time: '3 min read' },
];

const WellingtonBlog = () => (
  <>
    <PageSEO {...wellingtonBlogSEO} canonical={wellingtonBlogSEO.path} />
    <JsonLd data={{
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: wellingtonBlogSEO.heading, description: wellingtonBlogSEO.description,
      url: `https://www.jamesblond.co.nz${wellingtonBlogSEO.path}`,
      publisher: { '@type': 'Organization', name: 'James Blond Rentals', url: 'https://www.jamesblond.co.nz' },
      hasPart: guides.map(guide => ({ '@type': 'Article', headline: guide.title, url: `https://www.jamesblond.co.nz${wellingtonBlogSEO.path}#${guide.id}`, author: { '@type': 'Organization', name: 'James Blond Rentals' } })),
    }} />
    <main id="wellington-guides" className="bg-background text-foreground">
      <header className="container mx-auto px-4 pt-8 pb-10 md:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link><span aria-hidden="true">/</span>
          <Link to="/blog" className="hover:text-primary">Blog</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Wellington</span>
        </nav>
        <p className="text-primary font-semibold mb-3">James Blond Rentals · Local journal</p>
        <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">Wellington hire tips &amp; moving guides</h1>
        <p className="text-lg text-muted-foreground mt-5 max-w-2xl leading-relaxed">A little planning goes a long way. Practical advice for shifting a flat, collecting furniture or moving house, with collection from our Te Aro branch.</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />24 Abel Smith Street, Te Aro</span>
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" />Mon–Sat 8am–5pm · Sunday closed</span>
        </div>
      </header>

      <section aria-label="Wellington guides" className="container mx-auto px-4 pb-12">
        <img src={movingBoxes} alt="Boxes and household items packed in a moving truck" className="w-full h-60 md:h-96 object-cover rounded-lg" width={1200} height={600} fetchPriority="high" />
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {guides.map(guide => (
            <a key={guide.id} href={`#${guide.id}`} className="group border-t border-border pt-5 block focus-visible:outline-primary">
              <p className="text-sm font-medium text-primary mb-3">{guide.category} <span className="text-muted-foreground">· {guide.time}</span></p>
              <h2 className="text-xl font-bold leading-snug group-hover:text-primary">{guide.title}</h2>
              <p className="text-muted-foreground leading-relaxed mt-3">{guide.description}</p>
              <span className="inline-flex items-center gap-2 mt-4 text-primary font-semibold">Read guide <ArrowRight className="h-4 w-4" /></span>
            </a>
          ))}
        </div>
        <nav aria-label="Wellington topics" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-6 text-sm font-medium">
          <a href="#choose-your-vehicle" className="text-primary hover:underline">Hire tips</a>
          <a href="#moving-day-checklist" className="text-primary hover:underline">Moving guides</a>
          <a href="#wellington-access" className="text-primary hover:underline">Local access</a>
          <a href="#customer-stories" className="text-primary hover:underline">Customer stories</a>
        </nav>
      </section>

      <div className="container mx-auto px-4 pb-12 grid lg:grid-cols-[minmax(0,1fr)_280px] gap-12">
        <div className="min-w-0 max-w-3xl space-y-14">
          <article id="choose-your-vehicle" className="scroll-mt-28">
            <p className="text-primary text-sm font-semibold mb-3">Hire tips</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">Van or truck? Choose for your load, not just your budget</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>For a flat move in Te Aro, a furniture pickup in Newtown or a larger move to the Hutt Valley, start with what you need to carry. A smaller vehicle can be easier to manoeuvre, but repeated trips add distance and time.</p>
              <h3 className="text-lg font-semibold text-foreground">Measure before choosing</h3>
              <p>Write down the length, width and height of your largest items. Check the cargo dimensions and loading-door opening on the vehicle details page, not just the total cubic metres. Leave room for padding and securing the load. Weight matters too: cargo volume is not the same as permitted payload.</p>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-foreground">Cargo van:</strong> compare standard and jumbo options for boxes, smaller furniture and deliveries. Check that your tallest item can pass through the opening.</li>
                <li><strong className="text-foreground">Box truck:</strong> compare load space for bulkier furniture or a larger household move. Check access at both addresses before picking a bigger truck.</li>
                <li><strong className="text-foreground">Tail lift:</strong> look for a tail-lift option when heavy items make loading difficult. Follow the vehicle’s operating instructions and rated lift capacity; do not use it on an unsuitable slope.</li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground">Licence, gears and the full hire cost</h3>
              <p>All James Blond trucks up to 18m³, including 16m³ and 18m³ models, can be driven on a Class 1 car licence. Only the 19–20m³ truck requires Class 2. Truck gears may be automatic or manual, shown as A/M; check the option available for your dates.</p>
              <p>Compare the rental charge for your exact pickup and return times, kilometre charges, insurance options and any extras. The <Link to="/price-guide" className="text-primary underline">price guide</Link> is a useful starting point; your live quote gives the rental total for the selected period. A $50 booking deposit is accepted, with any unpaid rental balance collected at pickup. The deposit is separate from the bond.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="outline"><Link to="/van-hire-wellington">Compare Wellington vans <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline"><Link to="/truck-hire-wellington">Compare Wellington trucks <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </article>

          <article id="moving-day-checklist" className="scroll-mt-28 border-t border-border pt-10">
            <p className="text-primary text-sm font-semibold mb-3">Moving guide</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">Your Wellington moving-day checklist</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">Work backwards from your agreed return time. Loading, stairs, travel and unloading all need space in the plan—not just the drive between homes.</p>
            <ol className="list-decimal pl-6 space-y-6 text-muted-foreground leading-relaxed">
              <li><h3 className="font-semibold text-foreground mb-2">Before you book</h3>List your furniture and boxes, measure large pieces and compare vehicles. Check pickup and return availability for the actual dates and branches. Do not assume a one-way route is available just because the vehicle is available locally.</li>
              <li><h3 className="font-semibold text-foreground mb-2">A few days before moving</h3>Arrange loading access at both addresses. If you are moving into an apartment, ask the building manager about lift bookings, loading bays, door clearances and permitted moving hours. Pack and label boxes by room, and keep essentials separate.</li>
              <li><h3 className="font-semibold text-foreground mb-2">Before collection</h3>Check the weather and road conditions. Bring the required driver licence and booking details. Collect from 24 Abel Smith Street, Te Aro. Wellington CBD is open Monday–Saturday, 8am–5pm, and closed Sunday: no Sunday pickups or returns.</li>
              <li><h3 className="font-semibold text-foreground mb-2">When loading</h3>Follow the vehicle’s load limits and instructions. Spread weight appropriately, secure items against movement and protect furniture. Make sure doors close securely. Keep people out of the cargo area while travelling.</li>
              <li><h3 className="font-semibold text-foreground mb-2">Before returning</h3>Allow time to unload, check for belongings and meet the fuel and return requirements in your rental agreement. Commercial vans and trucks must return to city locations during opening hours—not to airports or after hours. Contact the branch promptly if your return plans change.</li>
            </ol>
            <p className="mt-6"><Link to="/contact/wellington" className="text-primary underline">Wellington collection details and contact information <ArrowRight className="inline h-4 w-4" /></Link></p>
          </article>

          <article id="wellington-access" className="scroll-mt-28 border-t border-border pt-10">
            <p className="text-primary text-sm font-semibold mb-3">Local advice</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">Loading, parking and access around Wellington</h2>
            <img src={loadingTruck} alt="Open moving truck with boxes ready for loading" width={800} height={480} loading="lazy" className="w-full aspect-[5/3] object-cover rounded-lg mb-6" />
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>A move in central Wellington can involve a shared driveway, stairs or an apartment loading bay. In hill suburbs such as Kelburn, Brooklyn and Mount Victoria, inspect the approach before committing to a larger vehicle.</p>
              <h3 className="text-lg font-semibold text-foreground">Check more than the street address</h3>
              <p>Ask about driveway width, turning space, overhead clearance and the distance from the vehicle to the front door. Check your booked vehicle’s overall height before using a covered loading bay or car park. Choose a safe, legal loading location; do not assume you can stop outside the entrance.</p>
              <h3 className="text-lg font-semibold text-foreground">Read the parking signs</h3>
              <p>Loading zones are short-term spaces, not all-day moving parking. Wellington City Council explains which vehicles may use them and when a permit is needed. Check the signs, time limits and current rules for your exact location; hiring a van or truck does not reserve a space.</p>
              <p><a href="https://wellington.govt.nz/parking-roads-and-transport/parking/business-and-trade-parking/loading-zone-permits" target="_blank" rel="noopener noreferrer" className="text-primary underline">Wellington City Council loading-zone guidance <ArrowRight className="inline h-4 w-4" /></a></p>
              <h3 className="text-lg font-semibold text-foreground">Plan the return leg as well</h3>
              <p>For moves around Petone, Lower Hutt, Porirua or other Wellington suburbs, allow for the trip back to your booked city return location. These areas are destinations served from Te Aro, not additional James Blond collection branches. Check live route and vehicle availability before arranging a one-way move.</p>
            </div>
          </article>

          <section id="customer-stories" className="scroll-mt-28 border-t border-border pt-10">
            <MessageSquare className="text-primary h-7 w-7 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Wellington customer stories</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">Have a Wellington move to share? Tell our team what you hired, what you moved and the local tip you wish you had known. We’ll ask your permission before publishing your story or photos.</p>
            <Button asChild variant="outline" className="mt-5"><a href="mailto:wellington@jamesblond.co.nz?subject=Wellington%20customer%20story">Share your moving story <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </section>
          <a href="#wellington-guides" className="inline-flex items-center gap-2 text-primary text-sm font-medium">Back to guides <ArrowUp className="h-4 w-4" /></a>
        </div>

        <aside aria-label="Plan your Wellington hire" className="border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-6">
          <div className="lg:sticky lg:top-28 space-y-5">
            <h2 className="text-xl font-bold">Ready to plan your hire?</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Compare load space, then check your dates for live availability and prices.</p>
            <Button asChild variant="cta" className="w-full"><Link to="/van-hire-wellington#booking-form">Check Wellington vans <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" className="w-full"><Link to="/truck-hire-wellington#booking">Check Wellington trucks <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <div className="border-t border-border pt-5 text-sm space-y-3">
              <p className="font-semibold">Te Aro collection</p>
              <p className="text-muted-foreground">24 Abel Smith Street<br />Wellington 6011</p>
              <p className="text-muted-foreground">Monday–Saturday: 8am–5pm<br />Sunday: Closed</p>
              <Link to="/contact/wellington" className="inline-block text-primary hover:underline">Branch directions &amp; contact</Link>
              <Link to="/price-guide" className="block text-primary hover:underline">Rental &amp; kilometre price guide</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </>
);

export default WellingtonBlog;