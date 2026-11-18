// RCM numeric age rows are lower-bound bands; the highest covers older drivers.
export type DriverAgeOption = { id?: unknown; ageid?: unknown; driverage?: unknown; description?: unknown; age?: unknown; isdefault?: unknown };

export function driverAgeOptions(ages: DriverAgeOption[]) {
  return ages.map((a) => ({ id: Number(a.id ?? a.ageid), label: String(a.driverage ?? a.description ?? a.age ?? "") }));
}

export function resolveDriverAge(ages: DriverAgeOption[], age?: number, id?: number) {
  if (age !== undefined) {
    if (!Number.isInteger(age) || age < 16 || age > 100) return undefined;
    return ages.filter((a) => Number.isFinite(Number(a.driverage)) && Number(a.driverage) <= age)
      .sort((a, b) => Number(b.driverage) - Number(a.driverage))[0];
  }
  if (id !== undefined) return ages.find((a) => Number(a.id ?? a.ageid) === id);
  return ages.find((a) => a.isdefault) || ages.find((a) => Number(a.driverage) >= 25) || ages[0];
}