import { parse, isValid, getDay } from "date-fns";

/**
 * Weekend minimum charge for trucks.
 *
 * Business rule: Saturday and Sunday truck hires are charged the 8-hour rate,
 * even when the customer books a shorter (2 or 4 hour) window. The customer
 * keeps their chosen return time — only the price is lifted to the 8-hour tier.
 *
 * Rates below mirror the published 8-hour truck rates on /price-guide.
 */
export const TRUCK_8_HOUR_RATES: { match: RegExp; rate: number }[] = [
  { match: /tipper/i, rate: 100 },
  // 3 tonne trucks (18m³ / 19m³ / 20m³, tail lift or Class 2) — 8 hour rate $140
  { match: /\b3\s*(t|ton|tonne)\b/i, rate: 140 },
  { match: /class\s*2/i, rate: 140 },
  { match: /(18|19|20)\s*m/i, rate: 140 },
  // 2 tonne 16m³ and tail lift — 8 hour rate $115
  { match: /\b2\s*(t|ton|tonne)\b.*(16\s*m|t\/?lift|tail\s*lift)/i, rate: 115 },
  { match: /\b2\s*(t|ton|tonne)\b.*(9\s*m|12\s*m)/i, rate: 105 },
  // Fallback for any other 2 tonne truck
  { match: /\b2\s*(t|ton|tonne)\b/i, rate: 115 },
];

const MINIMUM_HOURS = 8;

/** True when the category name refers to a truck (not a van, ute or trailer). */
export function isTruckCategory(categoryName?: string): boolean {
  if (!categoryName) return false;
  const name = categoryName.toLowerCase();
  if (name.includes("van") || name.includes("ute") || name.includes("trailer")) return false;
  return (
    name.includes("truck") ||
    name.includes("tipper") ||
    /\b\d\s*t(on|onne)?\b/.test(name) ||
    name.includes("box") ||
    name.includes("t/lift") ||
    name.includes("tail lift")
  );
}

/** Parse dd/MM/yyyy or ISO date strings. */
function parseDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = value.includes("/")
    ? parse(value, "dd/MM/yyyy", new Date())
    : new Date(value);
  return isValid(parsed) ? parsed : null;
}

/** True when the pickup date falls on a Saturday or Sunday. */
export function isWeekendPickup(pickupDate?: string): boolean {
  const date = parseDate(pickupDate);
  if (!date) return false;
  const day = getDay(date);
  return day === 0 || day === 6;
}

/** Look up the published 8-hour rate for a truck category. */
export function getTruck8HourRate(categoryName?: string): number | null {
  if (!categoryName) return null;
  const clean = categoryName.replace(/<[^>]*>/g, " ").replace(/³|&sup3;/g, "");
  const entry = TRUCK_8_HOUR_RATES.find(({ match }) => match.test(clean));
  return entry ? entry.rate : null;
}

/** Hours between pickup and drop-off, from dd/MM/yyyy (or ISO) dates + HH:mm times. */
export function getHireHours(
  pickupDate?: string,
  pickupTime?: string,
  dropoffDate?: string,
  dropoffTime?: string
): number | null {
  const start = parseDate(pickupDate);
  const end = parseDate(dropoffDate);
  if (!start || !end || !pickupTime || !dropoffTime) return null;
  const [sh, sm] = pickupTime.split(":").map(Number);
  const [eh, em] = dropoffTime.split(":").map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return null;
  start.setHours(sh, sm, 0, 0);
  end.setHours(eh, em, 0, 0);
  const hours = (end.getTime() - start.getTime()) / 3600000;
  return hours > 0 ? hours : null;
}

export interface WeekendTruckRateOverride {
  rate: number;
  hours: number;
  originalRate: number;
}

/**
 * Checkout-side override: for a Sat/Sun truck hire shorter than 8 hours,
 * returns the published 8-hour rate so the displayed and charged vehicle
 * rate matches the weekend minimum, regardless of what RCM returned.
 */
export function getWeekendTruckRateOverride({
  categoryName,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  currentRate,
}: {
  categoryName?: string;
  pickupDate?: string;
  pickupTime?: string;
  dropoffDate?: string;
  dropoffTime?: string;
  currentRate: number;
}): WeekendTruckRateOverride | null {
  if (!isTruckCategory(categoryName)) return null;
  if (!isWeekendPickup(pickupDate)) return null;

  const hours = getHireHours(pickupDate, pickupTime, dropoffDate, dropoffTime);
  if (!hours || hours >= MINIMUM_HOURS) return null;

  const eightHourRate = getTruck8HourRate(categoryName);
  if (!eightHourRate || eightHourRate <= currentRate) return null;

  return { rate: eightHourRate, hours: MINIMUM_HOURS, originalRate: currentRate };
}

export interface WeekendTruckMinimumInput {
  categoryName?: string;
  rateperiod?: "hour" | "day" | string;
  numberofhours?: number;
  pickupDate?: string;
  subtotal: number;
}

export interface WeekendTruckMinimumResult {
  subtotal: number;
  applied: boolean;
  chargedHours?: number;
}

/**
 * Lifts a sub-8-hour weekend truck hire to the 8-hour rate.
 * Returns the original subtotal untouched when the rule does not apply.
 */
export function applyWeekendTruckMinimum({
  categoryName,
  rateperiod,
  numberofhours,
  pickupDate,
  subtotal,
}: WeekendTruckMinimumInput): WeekendTruckMinimumResult {
  if (rateperiod !== "hour") return { subtotal, applied: false };
  if (!numberofhours || numberofhours >= MINIMUM_HOURS) return { subtotal, applied: false };
  if (!isTruckCategory(categoryName)) return { subtotal, applied: false };
  if (!isWeekendPickup(pickupDate)) return { subtotal, applied: false };

  const eightHourRate = getTruck8HourRate(categoryName);
  if (!eightHourRate || eightHourRate <= subtotal) return { subtotal, applied: false };

  return { subtotal: eightHourRate, applied: true, chargedHours: MINIMUM_HOURS };
}
