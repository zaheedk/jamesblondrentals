import type { Vehicle } from "./types";

export function isVehicleAvailable(vehicle: Pick<Vehicle, "available">): boolean {
  return vehicle.available === true || vehicle.available === 1 || vehicle.available === 2;
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