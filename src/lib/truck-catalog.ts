// Maps internal truck slugs (used in /fleet/trucks/:slug routes) to the
// display name and the RCM vehicle category we want the quote search to
// preselect. The categoryNameHint is matched case-insensitively against the
// RCM `vehiclecategorytype` strings returned by `useVehicleCategories`.

export interface TruckCatalogEntry {
  slug: string;
  name: string;
  /** Substring matched (case-insensitive) against RCM vehiclecategorytype */
  categoryNameHint: string;
}

export const TRUCK_CATALOG: Record<string, TruckCatalogEntry> = {
  "2-tonne-box-9m3": {
    slug: "2-tonne-box-9m3",
    name: "2 Tonne Box Truck (9m³)",
    categoryNameHint: "truck",
  },
  "2-tonne-box-12m3": {
    slug: "2-tonne-box-12m3",
    name: "2 Tonne Box Truck (12m³)",
    categoryNameHint: "truck",
  },
  "2-tonne-box-12m3-tail": {
    slug: "2-tonne-box-12m3-tail",
    name: "2 Tonne Box Truck (12m³) + Tail Lift",
    categoryNameHint: "truck",
  },
  "2-tonne-box-16m3": {
    slug: "2-tonne-box-16m3",
    name: "2 Tonne Box Truck (16m³)",
    categoryNameHint: "truck",
  },
  "2-tonne-tipper": {
    slug: "2-tonne-tipper",
    name: "2 Tonne Tipper",
    categoryNameHint: "truck",
  },
  "3-tonne-box-18m3": {
    slug: "3-tonne-box-18m3",
    name: "3 Tonne Box Truck (18m³) + Tail Lift",
    categoryNameHint: "truck",
  },
  "3-tonne-box-19m3": {
    slug: "3-tonne-box-19m3",
    name: "3 Tonne Box Truck (19m³) + Tail Lift",
    categoryNameHint: "truck",
  },
};

export function getTruckBySlug(slug: string | null | undefined): TruckCatalogEntry | undefined {
  if (!slug) return undefined;
  return TRUCK_CATALOG[slug];
}