type Location = { id: number; location: string; city?: string };
type Vehicle = {
  vehiclecategory?: string;
  categoryfriendlydescription?: string;
  vehiclecategorytypeid?: number | string;
  available?: number | string;
  avgrate?: number | string;
};

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

// Booking-system vehicle category type ids (from step1 categorytypes).
const TYPE = { car: 1, peopleMover: 4, van: 11, jumboVan: 24, truck: 12, ute: 10, trailer: 13 };

/** Lowercase and turn spoken forms ("two-ton", "2t", "tonne") into "2 ton". */
export function normaliseVehicleRequest(raw: string): string {
  const numbers: Record<string, string> = { one: "1", two: "2", three: "3", four: "4", eight: "8", ten: "10", twelve: "12" };
  let s = raw.toLowerCase().replace(/[-_/]+/g, " ");
  s = s.replace(/\b(one|two|three|four|eight|ten|twelve)\b/g, (w) => numbers[w]);
  s = s.replace(/\btonnes?\b|\btons\b/g, "ton");
  s = s.replace(/\b(\d+)\s*t\b/g, "$1 ton").replace(/\b(\d+)ton\b/g, "$1 ton");
  return s.replace(/\s+/g, " ").trim();
}

/** Which category types a caller's wording refers to (empty = no type recognised). */
export function requestedTypeIds(request: string): number[] {
  const s = normaliseVehicleRequest(request);
  if (/\b(minibus|mini bus|people mover|\d+ seat(er)?s?|seater)\b/.test(s)) return [TYPE.peopleMover];
  if (/\b(truck|lorry|box|tipper|tail ?lift|moving|\d+ ton|ton)\b/.test(s)) return [TYPE.truck];
  if (/\btrailers?\b/.test(s)) return [TYPE.trailer];
  if (/\butes?\b|\bpick ?up\b/.test(s)) return [TYPE.ute];
  if (/\bvans?\b/.test(s)) return [TYPE.van, TYPE.jumboVan];
  if (/\b(cars?|suv|hybrid|sedan|wagon|hatch(back)?|compact|midsize)\b/.test(s)) return [TYPE.car];
  return [];
}

export function matchingVehicles<T extends Vehicle>(vehicles: T[], requestedType: string): T[] {
  const request = normaliseVehicleRequest(requestedType);
  const typeIds = requestedTypeIds(request);
  const tonnage = /\b(\d+) ton\b/.exec(request)?.[1];
  const seats = /\b(\d+) seat/.exec(request)?.[1];
  const wantsTailLift = /tail ?lift/.test(request);
  const wantsTipper = /tipper/.test(request);
  const words = request.replace(/s\b/g, "").split(/\s+/).filter(Boolean);

  return vehicles.filter((v) => {
    if (!(Number(v.available) > 0 && Number(v.avgrate) > 0)) return false;
    if (!request) return true;
    const text = normaliseVehicleRequest(`${v.vehiclecategory || ""} ${v.categoryfriendlydescription || ""}`);
    if (typeIds.length > 0) {
      const vType = Number(v.vehiclecategorytypeid);
      if (!typeIds.includes(vType)) return false;
      if (tonnage && !text.includes(`${tonnage} ton`)) return false;
      if (seats && !text.includes(`${seats} seat`)) return false;
      if (wantsTailLift && !/tail ?lift/.test(text)) return false;
      if (wantsTipper && !text.includes("tipper")) return false;
      return true;
    }
    return words.some((word) => text.includes(word));
  }).sort((a, b) => Number(a.avgrate) - Number(b.avgrate));
}

/**
 * Published per-kilometre mileage charge (NZD, inc. GST) from the website
 * price guide. Cars and minibuses include unlimited kilometres; most
 * commercial vehicles charge per km. Returns null when the guide lists
 * no per-km rate for that category.
 */
export function perKmCharge(v: Vehicle): number | null {
  const type = Number(v.vehiclecategorytypeid);
  if (type === TYPE.car || type === TYPE.peopleMover) return null; // unlimited kms
  const text = normaliseVehicleRequest(`${v.vehiclecategory || ""} ${v.categoryfriendlydescription || ""}`);
  if (type === TYPE.truck) {
    if (text.includes("tipper")) return 0.39;
    if (/\b3 ton\b/.test(text)) return text.includes("19m") || text.includes("class 2") || text.includes("class2") ? 0.62 : 0.61;
    if (text.includes("tail lift")) return 0.44;
    if (text.includes("16m") || text.includes("18m")) return 0.47;
    return 0.42; // 2 Ton Box 9-12m3
  }
  if (type === TYPE.ute) {
    if (text.includes("4wd") || text.includes("double") || text.includes("dble")) return 0.3;
    if (text.includes("diesel")) return 0.25;
    return null; // petrol single cab — no per-km rate published
  }
  if (type === TYPE.jumboVan) return 0.39;
  if (type === TYPE.van) {
    if (text.includes("high roof")) return 0.35;
    if (text.includes("jumbo")) return 0.39;
    return null; // standard/premium/rear-seat vans — no per-km rate published
  }
  return null;
}

export function nzDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Callers say "25th October" without a year and the model sometimes fills in
 * a past year. Move any past YYYY-MM-DD date forward by whole years until it is
 * today or later (NZ time). Returns null for malformed dates.
 */
export function rollForwardDate(date: string, today: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!m) return null;
  let year = Number(m[1]);
  const [, , mm, dd] = m;
  const todayYear = Number(today.slice(0, 4));
  if (year < todayYear) year = todayYear;
  let candidate = `${year}-${mm}-${dd}`;
  if (candidate < today) candidate = `${year + 1}-${mm}-${dd}`;
  return candidate;
}

/** Roll pickup forward, then keep the return date on/after pickup. */
export function normaliseHireDates(pickup: string, dropoff: string, today: string) {
  const p = rollForwardDate(pickup, today);
  if (!p) return null;
  let d = rollForwardDate(dropoff, today);
  if (!d) return null;
  if (d < p) d = rollForwardDate(dropoff, p);
  return d ? { pickup: p, dropoff: d } : null;
}
