import type { Vehicle } from "./types";

export function isVehicleAvailable(vehicle: Pick<Vehicle, "available">): boolean {
  return vehicle.available === true || vehicle.available === 1 || vehicle.available === 2;
}

/**
 * Truck categories in the booking system group several units, and those units
 * are not all the same gearbox — e.g. the 2 tonne range includes manual tippers
 * and 16m³ boxes alongside automatic boxes. So a truck result is shown as
 * "A/M" (gearbox can be automatic or manual) rather than a single letter.
 */
const NON_TRUCK_WORDS = /\b(van|ute|minibus|bus|trailer|car transporter)\b/;
const TRUCK_SIGNALS = /\btruck\b|tipper|tautliner|\d+\s*ton(?:ne)?\b|m³|m3\b|cbm|cubic/;

export function isTruckCategoryVehicle(
  vehicle: Pick<Vehicle, "type" | "make" | "model">
): boolean {
  const haystack =
    `${vehicle.type || ""} ${vehicle.make || ""} ${vehicle.model || ""}`.toLowerCase();
  if (!haystack.trim()) return false;
  if (NON_TRUCK_WORDS.test(haystack)) return false;
  return TRUCK_SIGNALS.test(haystack);
}

/**
 * Only the 19–20m³ truck (the 3 tonne box) needs a Class 2 licence; every
 * truck up to 18m³ is drivable on a Class 1 car licence. Match on the size
 * or the 3-tonne wording so category naming changes don't hide the notice.
 */
// Size decides the licence, not the "3 Ton" naming — a 16–18m³ box can be
// labelled 3 Ton yet is still Class 1.
const CLASS2_SIGNALS = /(?:19|20)\s*m[³3]/;

export function requiresClass2Licence(
  vehicle: Pick<Vehicle, "type" | "make" | "model">
): boolean {
  if (!isTruckCategoryVehicle(vehicle)) return false;
  const haystack =
    `${vehicle.type || ""} ${vehicle.make || ""} ${vehicle.model || ""}`.toLowerCase();
  return CLASS2_SIGNALS.test(haystack);
}

/** Gearbox letters shown on a vehicle card: "A/M" for trucks, "A" otherwise. */
export function vehicleCardTransmissionLabel(
  vehicle: Pick<Vehicle, "type" | "make" | "model">
): "A/M" | "A" {
  return isTruckCategoryVehicle(vehicle) ? "A/M" : "A";
}

export function orderVehicleSearchResults(
  vehicles: Vehicle[],
  wellington: boolean,
  vanSearch: boolean,
): Vehicle[] {
  if (!wellington) return [...vehicles];
  const rank = (vehicle: Vehicle) => {
    const van = vehicle.vehicleCategoryTypeId === 11 || vehicle.vehicleCategoryTypeId === 24;
    return (isVehicleAvailable(vehicle) ? 0 : 2) + (vanSearch && !van ? 1 : 0);
  };
  return [...vehicles].sort((a, b) => rank(a) - rank(b));
}