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
  { match: /3\s*t.*19\s*m|class\s*2/i, rate: 140 },
  { match: /3\s*t.*18\s*m|3\s*tonne.*18/i, rate: 140 },
  { match: /2\s*t.*16\s*m/i, rate: 115 },
  { match: /2\s*t.*(t\/?lift|tail\s*lift)/i, rate: 115 },
  { match: /2\s*t.*(9\s*m|12\s*m)/i, rate: 105 },
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
  const entry = TRUCK_8_HOUR_RATES.find(({ match }) => match.test(categoryName));
  return entry ? entry.rate : null;
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
