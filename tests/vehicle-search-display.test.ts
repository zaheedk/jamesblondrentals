import { describe, expect, test } from "bun:test";
import {
  isVehicleAvailable,
  orderVehicleSearchResults,
  isTruckCategoryVehicle,
  vehicleCardTransmissionLabel,
  requiresClass2Licence,
} from "../src/lib/vehicle-search-display";
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

describe("truck gearbox letters on vehicle cards", () => {
  const card = (category: string) => ({
    type: category,
    make: category.split(" ")[0] || "",
    model: category.split(" ").slice(1).join(" ") || "",
  });

  test("truck categories show automatic or manual", () => {
    expect(vehicleCardTransmissionLabel(card("2 Ton Box (16m³-18m³)"))).toBe("A/M");
    expect(vehicleCardTransmissionLabel(card("2 Ton Tipper"))).toBe("A/M");
    expect(vehicleCardTransmissionLabel(card("3 Tonne Box 19m³ + Tail Lift"))).toBe("A/M");
    expect(isTruckCategoryVehicle(card("2 Ton Box (9m³)"))).toBe(true);
  });

  test("cars, vans and minibuses keep the single automatic letter", () => {
    expect(vehicleCardTransmissionLabel(card("Suzuki Swift"))).toBe("A");
    expect(vehicleCardTransmissionLabel(card("Standard Hybrid"))).toBe("A");
    expect(vehicleCardTransmissionLabel(card("High Roof Van"))).toBe("A");
    expect(vehicleCardTransmissionLabel(card("Jumbo Van (12m³)"))).toBe("A");
    expect(vehicleCardTransmissionLabel(card("12 Seat Minibus"))).toBe("A");
  });
});