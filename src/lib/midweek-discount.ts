import { parse, isValid, addDays, format, differenceInCalendarDays } from "date-fns";
import { isWeekdayRental } from "@/lib/utils";

/** Vehicles that receive the 25% early-week (Mon–Thu) commercial discount */
export const isMidweekEligibleVehicle = (name?: string, type?: string): boolean => {
  const haystack = `${name || ""} ${type || ""}`.toLowerCase();
  if (!haystack.trim()) return false;
  return ["jumbo", "truck", "ton", "box", "tipper", "tautliner"].some((k) =>
    haystack.includes(k)
  );
};

/** Parse a dd/MM/yyyy (or ISO) search-param date */
export const parseSearchDate = (value: string): Date | null => {
  if (!value) return null;
  let d: Date | null = null;
  if (value.includes("/")) {
    d = parse(value, "dd/MM/yyyy", new Date());
  } else {
    d = new Date(value);
  }
  return d && isValid(d) ? d : null;
};

export const formatSearchDate = (date: Date): string => format(date, "dd/MM/yyyy");

/** True when the selected dates already qualify for the Mon–Thu discount */
export const datesQualifyForMidweek = (pickupDate: string, dropoffDate: string): boolean =>
  Boolean(pickupDate && dropoffDate && isWeekdayRental(pickupDate, dropoffDate));

export interface MidweekSuggestion {
  pickupDate: string;
  dropoffDate: string;
  pickupLabel: string;
  dropoffLabel: string;
  nights: number;
}

/**
 * Suggest the nearest Mon–Thu window (same week) matching the customer's hire length.
 * Returns null when the hire is too long to fit Mon–Thu or already qualifies.
 */
export const suggestMidweekDates = (
  pickupDate: string,
  dropoffDate: string
): MidweekSuggestion | null => {
  const pickup = parseSearchDate(pickupDate);
  const dropoff = parseSearchDate(dropoffDate);
  if (!pickup || !dropoff) return null;
  if (datesQualifyForMidweek(pickupDate, dropoffDate)) return null;

  const nights = Math.max(0, differenceInCalendarDays(dropoff, pickup));
  if (nights > 3) return null;

  // Prefer Tuesday starts (lowest utilisation); Monday when the hire needs 3 nights
  const targetDay = nights >= 3 ? 1 : 2; // 1 = Mon, 2 = Tue

  let candidate = new Date(pickup);
  for (let i = 0; i < 14; i++) {
    if (candidate.getDay() === targetDay) break;
    candidate = addDays(candidate, 1);
  }
  if (candidate.getDay() !== targetDay) return null;

  const newDropoff = addDays(candidate, nights);
  if (newDropoff.getDay() < 1 || newDropoff.getDay() > 4) return null;

  return {
    pickupDate: formatSearchDate(candidate),
    dropoffDate: formatSearchDate(newDropoff),
    pickupLabel: format(candidate, "EEE d MMM"),
    dropoffLabel: format(newDropoff, "EEE d MMM"),
    nights,
  };
};
