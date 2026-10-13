// Picks similar vehicles to offer when a quoted vehicle is no longer available.
// "Similar" = same RCM category type (plus linked van types). Bigger vehicles
// (priced at or above the quoted one) are offered first, nearest size up;
// smaller ones only fill remaining slots, nearest size down.

export type RcmCar = {
  vehiclecategoryid?: string | number
  vehiclecategorytypeid?: string | number
  vehiclecategory?: string
  imageurl?: string
  totalrateafterdiscount?: string | number
  available?: number | boolean
}

// Cargo vans (11) and large/high-roof vans (24) are interchangeable for customers.
export const LINKED_TYPES: Record<string, string[]> = { '11': ['24'], '24': ['11'] }

export const isAvailable = (c: RcmCar) => c?.available === 1 || c?.available === 2 || c?.available === true
const norm = (s?: string) => (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
const price = (c: RcmCar) => Number(c.totalrateafterdiscount) || 0

export function findQuotedCar(cars: RcmCar[], vehicleId: string | null, vehicleName: string | null): RcmCar | undefined {
  return cars.find((c) => vehicleId && String(c.vehiclecategoryid) === String(vehicleId))
    ?? cars.find((c) => vehicleName && norm(c.vehiclecategory) === norm(vehicleName))
}

export function pickAlternatives(
  cars: RcmCar[],
  quoted: { typeId: string; vehicleId: string | null; vehicleName: string | null; referencePrice: number },
  max = 2,
): RcmCar[] {
  const types = new Set([quoted.typeId, ...(LINKED_TYPES[quoted.typeId] ?? [])])
  const candidates = cars.filter((c) =>
    isAvailable(c) && price(c) > 0 &&
    types.has(String(c.vehiclecategorytypeid)) &&
    !(quoted.vehicleId && String(c.vehiclecategoryid) === String(quoted.vehicleId)) &&
    norm(c.vehiclecategory) !== norm(quoted.vehicleName ?? '') &&
    // Tippers are a different job from box trucks — only offer tipper for tipper
    /tipper/i.test(c.vehiclecategory ?? '') === /tipper/i.test(quoted.vehicleName ?? ''))
  const bigger = candidates.filter((c) => price(c) >= quoted.referencePrice).sort((a, b) => price(a) - price(b))
  const smaller = candidates.filter((c) => price(c) < quoted.referencePrice).sort((a, b) => price(b) - price(a))
  return [...bigger, ...smaller].slice(0, max)
}
