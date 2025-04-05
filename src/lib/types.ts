
export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  price: number;
  priceUnit: string;
  seats: number;
  transmission: "automatic" | "manual";
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  fuelEfficiency: string;
  features: string[];
  images: string[];
  available: boolean;
  location: string;
  description: string;
}

export type VehicleType = "economy" | "compact" | "midsize" | "suv" | "luxury" | "van" | "convertible";

export interface BookingDetails {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  vehicleId?: number;
  extras?: string[];
  insuranceOption?: string;
}
