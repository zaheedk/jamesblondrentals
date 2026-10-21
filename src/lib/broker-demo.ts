export type ApiRecord = Record<string, unknown>;
export type DemoBooking = { reference: string; number: number; payload: ApiRecord; status: string };
export const asRecord = (value: unknown): ApiRecord => value && typeof value === "object" && !Array.isArray(value) ? value as ApiRecord : {};
export const rows = (value: unknown): ApiRecord[] => Array.isArray(value) ? value.map(asRecord) : [];
export const resultOf = (value: unknown) => asRecord(asRecord(value).results);
export const idOf = (row: ApiRecord) => String(row.id ?? row.vehiclecategoryid ?? "");
export const money = (amount: unknown) => new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(Number(amount) || 0);
export function apiSucceeded(value: unknown) { return asRecord(value).status === "OK"; }
export function safeInspection(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(safeInspection);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, /secret|apikey|signature|token|cardnumber|cvv/i.test(key) ? "[redacted]" : safeInspection(val)]));
  return value;
}
export function createRehearsalApi() {
  let sequence = 10000;
  const bookings = new Map<string, DemoBooking>();
  const cars = [
    { vehiclecategoryid: "demo-asx", vehiclecategorytypeid: "demo-car", vehiclecategory: "Mitsubishi ASX or similar", available: 1, avgrate: 95, totalrateafterdiscount: 665, numberofdays: "7" },
    { vehiclecategoryid: "demo-compact", vehiclecategorytypeid: "demo-car", vehiclecategory: "Compact car", available: 1, avgrate: 75, totalrateafterdiscount: 525, numberofdays: "7" },
  ];
  const ok = (results: ApiRecord) => ({ status: "OK", results });
  const lookup = (payload: ApiRecord) => [...bookings.values()].find(b => b.reference === payload.reservationref || String(b.number) === String(payload.reservationno));
  const info = (b: DemoBooking) => {
    const car = cars.find(c => c.vehiclecategoryid === b.payload.vehiclecategoryid);
    const amount = Number(car?.avgrate ?? 95) * days(b.payload) + (b.payload.insuranceid === "demo-cover" ? 25 * days(b.payload) : 0) + (rows(b.payload.optionalfees).length ? 35 : 0);
    return { bookinginfo: [{ ...b.payload, reservationref: b.reference, reservationno: b.number, bookingstatus: b.status, vehiclecategory: car?.vehiclecategory, totalcost: amount }], customerinfo: [asRecord(b.payload.customer)] };
  };
  const days = (p: ApiRecord) => {
    const parse = (s: unknown) => { const [d,m,y] = String(s).split("/").map(Number); return Date.UTC(y,m-1,d); };
    return Math.max(1, Math.ceil((parse(p.dropoffdate) - parse(p.pickupdate)) / 86400000));
  };
  return async (payload: ApiRecord): Promise<ApiRecord> => {
    switch (payload.method) {
      case "step1": return ok({ locations: [{ id: "demo-chc", location: "Christchurch — sample branch" }, { id: "demo-akl", location: "West Auckland — sample branch" }], categorytypes: [{ id: "demo-car", vehiclecategorytype: "Cars & SUVs" }], driverages: [{ id: "demo-age", driverage: "25+", isdefault: true }] });
      case "step2": return ok({ availablecars: cars.map(c => ({ ...c, numberofdays: String(days(payload)), totalrateafterdiscount: c.avgrate * days(payload) })) });
      case "step3": return ok({ insuranceoptions: [{ id: "demo-basic", name: "Basic cover", totalinsuranceamount: 0, isdefault: true }, { id: "demo-cover", name: "Reduced excess — sample", totalinsuranceamount: 25 * days(payload) }], kmcharges: [{ id: "demo-km", name: "Standard kilometre allowance" }], optionalfees: [{ id: "demo-seat", name: "Child seat — sample", totalfeeamount: 35, maxquantity: 1 }] });
      case "booking": {
        const number = ++sequence;
        const b: DemoBooking = { reference: `DEMO-${number}`, number, payload, status: "Confirmed" };
        bookings.set(b.reference, b);
        return ok({ reservationref: b.reference, reservationno: number, ...info(b) });
      }
      case "bookinginfo": { const b = lookup(payload); return b ? ok(info(b)) : { status: "ERR", error: "Sample booking not found in this rehearsal session." }; }
      case "cancelreasons": return ok({ cancelreasons: [{ id: "demo-reason", reason: "Broker test completed" }] });
      case "cancelbooking": { const b = lookup(payload); if (!b || payload.reasonid !== "demo-reason") return { status: "ERR", error: "Booking or reason not found." }; b.status = "Cancelled"; return ok(info(b)); }
      case "editbooking": { const b = lookup(payload); if (!b) return { status: "ERR", error: "Sample booking not found." }; if (b.status === "Cancelled") return { status: "ERR", error: "Cancelled bookings cannot be updated." }; b.payload = { ...b.payload, customer: { ...asRecord(b.payload.customer), ...asRecord(payload.customer) } }; return ok(info(b)); }
      default: return { status: "ERR", error: "Unsupported rehearsal operation" };
    }
  };
}