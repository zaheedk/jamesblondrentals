import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Truck, ArrowRight, Info } from 'lucide-react';

/**
 * Moving truck size + moving cost calculator.
 * Shared by the on-site page and the embeddable (iframe) version.
 * All rates come from the published James Blond price guide (NZD, incl GST).
 */

export interface VehicleOption {
  id: string;
  name: string;
  capacityM3: number;
  loadSpace: string;
  eightHour: number;
  perDay: number;
  perKm: number;
  fleetPath: string;
}

export const MOVING_VEHICLES: VehicleOption[] = [
  {
    id: 'high-roof-van',
    name: 'High Roof Cargo Van',
    capacityM3: 6,
    loadSpace: '2.6 x 1.7 x 1.8m approx.',
    eightHour: 100,
    perDay: 130,
    perKm: 0.35,
    fleetPath: '/fleet/cargo-vans',
  },
  {
    id: 'jumbo-van',
    name: 'Jumbo Van (9m³)',
    capacityM3: 9,
    loadSpace: '3.4 x 1.7 x 1.9m approx.',
    eightHour: 100,
    perDay: 130,
    perKm: 0.39,
    fleetPath: '/fleet/vans',
  },
  {
    id: '2t-box',
    name: '2T Box Truck (9–12m³)',
    capacityM3: 12,
    loadSpace: '3 x 1.6 x 1.8m',
    eightHour: 105,
    perDay: 125,
    perKm: 0.42,
    fleetPath: '/fleet/trucks',
  },
  {
    id: '2t-tail-lift',
    name: '2T Tail Lift Truck (12m³)',
    capacityM3: 14,
    loadSpace: '3.1 x 1.8 x 2m',
    eightHour: 115,
    perDay: 140,
    perKm: 0.44,
    fleetPath: '/fleet/trucks',
  },
  {
    id: '2t-16',
    name: '2T Furniture Truck (16m³)',
    capacityM3: 16,
    loadSpace: '4 x 2 x 2m',
    eightHour: 115,
    perDay: 130,
    perKm: 0.47,
    fleetPath: '/fleet/trucks/2-tonne-box-16m3',
  },
  {
    id: '3t-tail-lift',
    name: '3T Tail Lift Truck (18–19m³)',
    capacityM3: 19,
    loadSpace: '4.5 x 2 x 2m',
    eightHour: 140,
    perDay: 160,
    perKm: 0.61,
    fleetPath: '/fleet/trucks',
  },
];

const HOME_TYPES = [
  { id: 'studio', label: 'Studio / single room', base: 6 },
  { id: 'apartment', label: 'Apartment / unit', base: 9 },
  { id: 'house', label: 'Standalone house', base: 12 },
  { id: 'flatmate', label: 'One flatmate room only', base: 4 },
];

const EXTRAS = [
  { id: 'whiteware', label: 'Fridge, washer & whiteware', m3: 3 },
  { id: 'garage', label: 'Full garage or shed', m3: 5 },
  { id: 'garden', label: 'Garden furniture / BBQ', m3: 2 },
  { id: 'boxes', label: 'Lots of boxes (20+)', m3: 3 },
  { id: 'bulky', label: 'Bulky items (piano, gym, sofa bed)', m3: 3 },
];

const currency = (value: number) =>
  `$${value.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface Props {
  /** Compact styling for the embedded version */
  embedded?: boolean;
  /** Where the CTA button points */
  bookingUrl?: string;
}

const MovingCostCalculator = ({ embedded = false, bookingUrl = '/booking' }: Props) => {
  const [homeType, setHomeType] = useState('apartment');
  const [bedrooms, setBedrooms] = useState('2');
  const [extras, setExtras] = useState<string[]>(['whiteware', 'boxes']);
  const [distanceKm, setDistanceKm] = useState('25');
  const [hireLength, setHireLength] = useState<'8h' | '1d' | '3d'>('8h');
  const [helpers, setHelpers] = useState('0');

  const toggleExtra = (id: string) =>
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));

  const result = useMemo(() => {
    const home = HOME_TYPES.find((h) => h.id === homeType) ?? HOME_TYPES[1];
    const rooms = Math.max(0, Number(bedrooms) || 0);
    const extrasM3 = EXTRAS.filter((e) => extras.includes(e.id)).reduce((sum, e) => sum + e.m3, 0);
    const volume = Math.round(home.base + rooms * 4 + extrasM3);

    const vehicle =
      MOVING_VEHICLES.find((v) => v.capacityM3 >= volume) ?? MOVING_VEHICLES[MOVING_VEHICLES.length - 1];
    const trips = Math.max(1, Math.ceil(volume / vehicle.capacityM3));

    const km = Math.max(0, Number(distanceKm) || 0);
    // Each trip is a return leg, plus depot pickup/return allowance.
    const totalKm = km * 2 * trips + 10;

    const days = hireLength === '3d' ? 3 : 1;
    const hireCost =
      hireLength === '8h' ? vehicle.eightHour : hireLength === '1d' ? vehicle.perDay : vehicle.perDay * 3;
    const kmCost = totalKm * vehicle.perKm;
    const helperCost = Math.max(0, Number(helpers) || 0) * 45 * (hireLength === '8h' ? 4 : 6) * days;
    const total = hireCost + kmCost + helperCost;

    return { volume, vehicle, trips, totalKm, hireCost, kmCost, helperCost, total, days };
  }, [homeType, bedrooms, extras, distanceKm, hireLength, helpers]);

  return (
    <div className={embedded ? 'p-4 md:p-6 bg-background' : ''}>
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">What are you moving?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mcc-home">Property type</Label>
                <Select value={homeType} onValueChange={setHomeType}>
                  <SelectTrigger id="mcc-home">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOME_TYPES.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcc-bedrooms">Furnished bedrooms</Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger id="mcc-bedrooms">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['0', '1', '2', '3', '4', '5'].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Extras to load</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {EXTRAS.map((e) => (
                  <label
                    key={e.id}
                    htmlFor={`mcc-${e.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`mcc-${e.id}`}
                      checked={extras.includes(e.id)}
                      onCheckedChange={() => toggleExtra(e.id)}
                    />
                    <span className="text-sm text-foreground">{e.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mcc-distance">One-way distance (km)</Label>
                <Input
                  id="mcc-distance"
                  type="number"
                  min={0}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcc-length">Hire length</Label>
                <Select value={hireLength} onValueChange={(v) => setHireLength(v as typeof hireLength)}>
                  <SelectTrigger id="mcc-length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8h">8 hours</SelectItem>
                    <SelectItem value="1d">1 day</SelectItem>
                    <SelectItem value="3d">3 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcc-helpers">Paid helpers</Label>
                <Select value={helpers} onValueChange={setHelpers}>
                  <SelectTrigger id="mcc-helpers">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['0', '1', '2', '3'].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Your estimate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Recommended vehicle</p>
              <p className="text-lg font-semibold text-foreground">{result.vehicle.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Load space {result.vehicle.loadSpace} · about {result.volume}m³ to move
                {result.trips > 1 ? ` · ${result.trips} trips` : ' · single trip'}
              </p>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Hire ({result.days === 3 ? '3 days' : hireLength === '8h' ? '8 hours' : '1 day'})
                </dt>
                <dd className="font-medium text-foreground">{currency(result.hireCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Distance ({Math.round(result.totalKm)}km @ {currency(result.vehicle.perKm)}/km)
                </dt>
                <dd className="font-medium text-foreground">{currency(result.kmCost)}</dd>
              </div>
              {result.helperCost > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Helpers</dt>
                  <dd className="font-medium text-foreground">{currency(result.helperCost)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-semibold text-foreground">Estimated total</dt>
                <dd className="font-bold text-foreground">{currency(result.total)}</dd>
              </div>
            </dl>

            <p className="text-xs text-muted-foreground flex gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              Indicative only, incl. GST. Unlimited-kilometre and multi-day rates can work out cheaper —
              confirm the exact price at checkout.
            </p>

            <Button variant="cta" className="w-full" asChild>
              <a href={bookingUrl} target={embedded ? '_blank' : undefined} rel="noopener">
                Check availability
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovingCostCalculator;
