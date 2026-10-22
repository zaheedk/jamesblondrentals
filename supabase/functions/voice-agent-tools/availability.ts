type Location = { id: number; location: string; city?: string };
type Vehicle = { vehiclecategory?: string; categoryfriendlydescription?: string; available?: number | string; avgrate?: number | string };

export function resolveLocation(locations: Location[], branch: string): Location | null {
  const query = branch.trim().toLowerCase();
  if (!query) return null;
  const aliases: Record<string, number> = {
    wellington: 11, "wellington cbd": 11, "wellington city": 11,
    "wellington airport": 13, hamilton: 17, "mt wellington": 19,
    "mount wellington": 19, "east auckland": 19,
    christchurch: 16, "christchurch central": 16, "christchurch airport": 9,
    "west auckland": 1, henderson: 1, "auckland airport": 7,
    "new plymouth": 18, "new plymouth airport": 18,
  };
  const id = aliases[query];
  if (id !== undefined) return locations.find((l) => Number(l.id) === id) || null;
  return locations.find((l) => l.location.toLowerCase() === query)
    || locations.find((l) => l.location.toLowerCase().includes(query)) || null;
}

export function matchingVehicles<T extends Vehicle>(vehicles: T[], requestedType: string): T[] {
  const type = requestedType.trim().toLowerCase().replace(/s$/, "");
  const words = type.split(/\s+/).filter(Boolean);
  return vehicles.filter((v) => {
    if (!(Number(v.available) > 0 && Number(v.avgrate) > 0)) return false;
    const text = `${v.vehiclecategory || ""} ${v.categoryfriendlydescription || ""}`.toLowerCase();
    return !type || words.some((word) => text.includes(word));
  }).sort((a, b) => Number(a.avgrate) - Number(b.avgrate));
}

export function nzDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}