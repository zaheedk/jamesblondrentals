import { useQuery } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { rcmApi } from "@/lib/api/rcm-api";

export type CategoryPricing = Record<string, number | null>;

/**
 * Maps fleet category href -> keywords that appear in RCM's
 * categorytype.vehiclecategorytype name (case-insensitive).
 */
const FLEET_KEYWORDS: Record<string, string[]> = {
  "/fleet/cars": ["car"],
  "/fleet/vans": ["van"],
  "/fleet/minibus": ["minibus", "bus", "people mover"],
  "/fleet/trucks": ["truck"],
  "/fleet/utes": ["ute"],
  "/fleet/trailers": ["trailer"],
};

/**
 * Asynchronously fetches the lowest daily rate per fleet category from RCM
 * by issuing one Step1 + one Step2 request against a default pickup location
 * and sample date range. Returns a map of fleet href -> lowest avg daily rate.
 */
export function useCategoryPricing() {
  return useQuery<CategoryPricing>({
    queryKey: ["home-category-pricing"],
    queryFn: async () => {
      // 1. Step1 — get locations, driver ages, categorytypes
      const step1 = await rcmApi.getStep1();
      if (step1.status !== "OK" || !step1.results) {
        throw new Error("Step1 failed");
      }

      const locations = step1.results.locations || [];
      const driverAges = step1.results.driverages || [];
      const categoryTypes = step1.results.categorytypes || [];

      // Default pickup location: West Auckland (matches SearchForm default)
      const defaultLocation =
        locations.find(
          (l) => (l.location || "").toLowerCase().includes("west auckland"),
        ) ||
        locations.find((l) => l.isdefault) ||
        locations[0];
      if (!defaultLocation) throw new Error("No pickup location available");

      // Default driver age: 26+ when available
      const defaultAge =
        driverAges.find((a) => a.isdefault) ||
        driverAges.find((a) => parseInt(a.driverage) >= 26) ||
        driverAges[0];
      if (!defaultAge) throw new Error("No driver age available");

      // Sample date range: 7 days from now, 3-day rental, midday
      const pickup = addDays(new Date(), 7);
      const dropoff = addDays(pickup, 3);
      const pickupdate = format(pickup, "dd/MM/yyyy");
      const dropoffdate = format(dropoff, "dd/MM/yyyy");

      // 2. Step2 — one call, all categories (vehiclecategorytypeid omitted/0)
      const step2 = await rcmApi.getStep2({
        pickuplocationid: defaultLocation.id,
        pickupdate,
        pickuptime: "12:00",
        dropofflocationid: defaultLocation.id,
        dropoffdate,
        dropofftime: "12:00",
        ageid: defaultAge.id,
        vehiclecategorytypeid: 0,
      });

      if (step2.status !== "OK" || !step2.results?.availablecars) {
        throw new Error("Step2 failed");
      }

      const cars = step2.results.availablecars;

      // 3. For each fleet href, resolve matching categorytype ids,
      // then take the minimum avgrate across cars in those types.
      const result: CategoryPricing = {};
      for (const [href, keywords] of Object.entries(FLEET_KEYWORDS)) {
        const matchedTypeIds = new Set(
          categoryTypes
            .filter((t) => {
              const name = (t.vehiclecategorytype || "").toLowerCase();
              return keywords.some((kw) => name.includes(kw));
            })
            .map((t) => String(t.id)),
        );

        const prices = cars
          .filter((c) => matchedTypeIds.has(String(c.vehiclecategorytypeid)))
          .map((c) => Number(c.avgrate))
          .filter((n) => Number.isFinite(n) && n > 0);

        result[href] = prices.length ? Math.min(...prices) : null;
      }

      return result;
    },
    // Cache aggressively — pricing doesn't change minute-to-minute.
    staleTime: 30 * 60 * 1000, // 30 min
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}