import { Link } from "react-router-dom";
import { MapPin, Truck } from "lucide-react";

// Matrix of city -> vehicle type -> URL. Only include routes that actually exist.
// Used to auto-generate cross-links between fleet hubs and city pages so
// Google can discover and rank every hub/city combination faster.
export type VehicleType = "vans" | "trucks" | "minibuses" | "cars" | "trailers" | "utes";

type CityKey = "auckland" | "wellington" | "christchurch" | "hamilton";

const CITY_LABEL: Record<CityKey, string> = {
  auckland: "Auckland",
  wellington: "Wellington",
  christchurch: "Christchurch",
  hamilton: "Hamilton",
};

const VEHICLE_LABEL: Record<VehicleType, string> = {
  vans: "Van Hire",
  trucks: "Truck Hire",
  minibuses: "Minibus Hire",
  cars: "Car Hire",
  trailers: "Trailer Hire",
  utes: "Ute Hire",
};

// City x vehicle type routing table. Keep in sync with App.tsx routes.
const MATRIX: Record<CityKey, Partial<Record<VehicleType, { to: string; label?: string }>>> = {
  auckland: {
    vans: { to: "/auckland-van-hire" },
    trucks: { to: "/auckland-truck-rentals" },
    minibuses: { to: "/auckland-minibus-hire" },
    cars: { to: "/auckland-car-hire" },
    trailers: { to: "/trailer-hire-auckland" },
  },
  wellington: {
    vans: { to: "/wellington-cargo-van-rentals", label: "Van Hire" },
    trucks: { to: "/wellington-truck-rentals" },
    minibuses: { to: "/wellington-minibus-hire" },
    cars: { to: "/wellington-car-rental" },
    trailers: { to: "/trailer-hire-wellington" },
  },
  christchurch: {
    vans: { to: "/christchurch-van-hire" },
    trucks: { to: "/christchurch-truck-rentals" },
    minibuses: { to: "/christchurch-minibus-hire" },
    cars: { to: "/christchurch-car-hire" },
    trailers: { to: "/trailer-hire-christchurch" },
  },
  hamilton: {
    vans: { to: "/hamilton-van-hire" },
    trucks: { to: "/hamilton-truck-rentals" },
    minibuses: { to: "/hamilton-minibus-hire" },
    cars: { to: "/hamilton-car-hire" },
    trailers: { to: "/trailer-hire-hamilton" },
  },
};

// Bonus deep-links per vehicle type (specialised long-tail pages) so hub
// pages surface intent-specific URLs to crawlers.
const EXTRA_LINKS: Partial<Record<VehicleType, { to: string; label: string }[]>> = {
  vans: [
    { to: "/auckland-van-hire-hub", label: "Auckland Van Hire Hub" },
    { to: "/12-seater-van-hire-auckland", label: "12-Seater Van Hire Auckland" },
    { to: "/12-seater-van-hire-christchurch", label: "12-Seater Van Hire Christchurch" },
    { to: "/12-seater-van-hire-wellington", label: "12-Seater Van Hire Wellington" },
    { to: "/14-seater-van-hire-auckland", label: "14-Seater Van Hire Auckland" },
  ],
  trucks: [
    { to: "/moving-truck-hire", label: "Moving Truck Hire" },
    { to: "/moving-truck-hire-hamilton", label: "Moving Truck Hire Hamilton" },
    { to: "/furniture-truck-hire-hamilton", label: "Furniture Truck Hire Hamilton" },
    { to: "/west-auckland-truck-rentals", label: "West Auckland Truck Rentals" },
  ],
  minibuses: [
    { to: "/12-seater-van-hire-auckland", label: "12-Seater Van Auckland" },
    { to: "/12-seater-van-hire-christchurch", label: "12-Seater Van Christchurch" },
    { to: "/12-seater-van-hire-wellington", label: "12-Seater Van Wellington" },
  ],
  cars: [
    { to: "/car-hire-auckland-airport-from-australia", label: "Auckland Airport (from Australia)" },
    { to: "/car-hire-christchurch-airport-from-australia", label: "Christchurch Airport (from Australia)" },
    { to: "/car-rental-auckland-airport", label: "Auckland Airport Car Rental" },
  ],
  trailers: [],
  utes: [
    { to: "/ute-hire-nz", label: "Ute Hire NZ" },
  ],
};

interface RelatedLocationsProps {
  /** Vehicle type this hub represents. Enables "Available in these cities" grid. */
  vehicleType?: VehicleType;
  /** Current city. Enables "Other vehicles in {city}" grid. */
  currentCity?: CityKey;
  /** Optional heading override. */
  title?: string;
  className?: string;
}

/**
 * Cross-links fleet hub pages ↔ city pages so PageRank flows to every
 * high-intent landing page. Renders up to two link grids and is safe to
 * drop into any page.
 */
const RelatedLocations = ({
  vehicleType,
  currentCity,
  title,
  className = "",
}: RelatedLocationsProps) => {
  const cityLinks = vehicleType
    ? (Object.keys(MATRIX) as CityKey[])
        .filter((c) => c !== currentCity && MATRIX[c][vehicleType])
        .map((c) => ({
          to: MATRIX[c][vehicleType]!.to,
          label: `${VEHICLE_LABEL[vehicleType]} ${CITY_LABEL[c]}`,
          city: CITY_LABEL[c],
        }))
    : [];

  const vehicleLinks = currentCity
    ? (Object.keys(VEHICLE_LABEL) as VehicleType[])
        .filter((v) => v !== vehicleType && MATRIX[currentCity][v])
        .map((v) => ({
          to: MATRIX[currentCity][v]!.to,
          label: `${VEHICLE_LABEL[v]} ${CITY_LABEL[currentCity]}`,
        }))
    : [];

  const extras = vehicleType ? EXTRA_LINKS[vehicleType] ?? [] : [];

  if (!cityLinks.length && !vehicleLinks.length && !extras.length) return null;

  return (
    <section
      aria-label="Related locations and vehicles"
      className={`bg-muted/40 border-t border-b py-10 ${className}`}
    >
      <div className="container mx-auto px-4 space-y-8">
        {title ? (
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        ) : null}

        {cityLinks.length > 0 && vehicleType ? (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {VEHICLE_LABEL[vehicleType]} in other cities
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {cityLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="block px-3 py-2 rounded-md bg-background hover:bg-primary hover:text-primary-foreground border text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {vehicleLinks.length > 0 && currentCity ? (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Other vehicles in {CITY_LABEL[currentCity]}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {vehicleLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="block px-3 py-2 rounded-md bg-background hover:bg-primary hover:text-primary-foreground border text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {extras.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-3">Related pages</h3>
            <ul className="flex flex-wrap gap-2">
              {extras.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-block px-3 py-1.5 rounded-full bg-background hover:bg-primary hover:text-primary-foreground border text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default RelatedLocations;