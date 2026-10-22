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

export function nzDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
