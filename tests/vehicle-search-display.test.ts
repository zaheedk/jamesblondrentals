import { describe, expect, test } from "bun:test";
import { isVehicleAvailable, orderVehicleSearchResults } from "../src/lib/vehicle-search-display";
import type { Vehicle } from "../src/lib/types";

const vehicle = (id: number, available: boolean | number, category: number): Vehicle => ({
  id, available, vehicleCategoryTypeId: category, make: "Test", model: "Vehicle", year: 2026,
  type: "van", price: 115, priceUnit: "day", seats: 3, transmission: "automatic",
  fuelType: "diesel", fuelEfficiency: "N/A", location: "11", features: [], images: [], description: "",
});

describe("Wellington vehicle search display", () => {
  test("available vans precede other available vehicles and unavailable options", () => {
    const input = [vehicle(1, 0, 11), vehicle(2, 1, 1), vehicle(3, 1, 11), vehicle(4, 2, 24)];
    expect(orderVehicleSearchResults(input, true, true).map(v => v.id)).toEqual([3, 4, 2, 1]);
    expect(input.map(v => v.id)).toEqual([1, 2, 3, 4]);
  });
  test("all-category Wellington searches place available vehicles first without van bias", () => {
    expect(orderVehicleSearchResults([vehicle(1, 0, 11), vehicle(2, 1, 1), vehicle(3, 1, 11)], true, false).map(v => v.id)).toEqual([2, 3, 1]);
  });
  test("other locations retain their order", () => {
    expect(orderVehicleSearchResults([vehicle(1, 0, 1), vehicle(2, 1, 11)], false, true).map(v => v.id)).toEqual([1, 2]);
  });
  test("only RCM available statuses and boolean true are selectable", () => {
    expect([true, 1, 2, false, 0, 3].map(available => isVehicleAvailable({ available }))).toEqual([true, true, true, false, false, false]);
  });
});