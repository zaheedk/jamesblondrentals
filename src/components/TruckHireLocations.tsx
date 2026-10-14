import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = [
  { city: 'auckland', name: 'West Auckland', address: '4004 Great North Road, Glen Eden, Auckland', area: 'Henderson, New Lynn, Avondale and Te Atatū', to: '/west-auckland-truck-rentals-hire', contact: '/contact/auckland' },
  { city: 'wellington', name: 'Wellington', address: '24 Abel Smith Street, Te Aro, Wellington', area: 'Wellington CBD, Lower Hutt, Upper Hutt and Porirua — collection in Te Aro', to: '/truck-hire-wellington', contact: '/contact/wellington' },
  { city: 'christchurch', name: 'Central Christchurch', address: '515 Moorhouse Avenue, Waltham, Christchurch', area: 'Christchurch CBD, Addington, Sydenham and Riccarton', to: '/central-christchurch-truck-hire', contact: '/contact/christchurch-central' },
  { city: 'christchurch', name: 'Christchurch Airport', address: '25 Logistics Drive, Harewood, Christchurch', area: 'Harewood, Papanui, Belfast, Rolleston and Rangiora', to: '/truck-hire-christchurch', contact: '/contact/christchurch' },
  { city: 'hamilton', name: 'Hamilton', address: '17 Bandon Street, Frankton, Hamilton', area: 'Frankton, Hamilton East, Chartwell and Rototuna', to: '/truck-hire-hamilton', contact: '/contact/hamilton' },
];

export default function TruckHireLocations({ city }: { city?: string }) {
  const nearby = city ? locations.filter(location => location.city === city) : locations;
  return (
    <section className="py-12 border-t border-border" aria-label="Truck hire collection locations">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">{city ? 'Moving truck hire near you — collection locations' : 'Truck hire near you — find your collection branch'}</h2>
      <p className="text-muted-foreground max-w-3xl mb-8">Need moving truck hire near you? Compare the collection address with your loading and return locations. Check your dates for live availability; same-day pickup and tail-lift options are subject to availability.</p>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        {nearby.map(location => (
          <div key={location.contact} className="border-b border-border pb-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary shrink-0" />Truck hire {location.name}</h3>
            <p className="mt-2 font-medium">{location.address}</p>
            <p className="text-sm text-muted-foreground mt-2">{location.area}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
              <Button asChild variant="link" className="p-0 h-auto"><Link to={location.to}>View trucks <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild variant="link" className="p-0 h-auto"><Link to={location.contact}>Branch details &amp; directions</Link></Button>
            </div>
          </div>
        ))}
      </div>
      <nav aria-label="Truck hire by city" className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm">
        <Link className="text-primary underline" to="/truck-hire">Truck hire</Link>
        <Link className="text-primary underline" to="/van-hire">Van hire</Link>
        <Link className="text-primary underline" to="/auckland-truck-rentals-hire">Truck hire Auckland</Link>
        <Link className="text-primary underline" to="/truck-hire-wellington">Truck hire Wellington</Link>
        <Link className="text-primary underline" to="/truck-hire-christchurch">Truck hire Christchurch</Link>
        <Link className="text-primary underline" to="/truck-hire-hamilton">Truck hire Hamilton</Link>
        <Link className="text-primary underline" to="/moving-truck-rental">Moving truck hire near you</Link>
        <Link className="text-primary underline" to="/price-guide">Truck hire price guide</Link>
        <Link className="text-primary underline" to="/moving-cost-calculator">Moving size &amp; cost calculator</Link>
      </nav>
      {!city && <p className="mt-6 text-sm text-muted-foreground">For collection at <Link className="text-primary underline" to="/contact/mt-wellington">Mt Wellington</Link> or <Link className="text-primary underline" to="/contact/new-plymouth">New Plymouth</Link>, contact the branch to confirm truck options for your dates.</p>}
    </section>
  );
}