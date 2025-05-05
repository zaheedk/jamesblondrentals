
export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  price: number | string;
  priceUnit: "day" | "hour" | "week" | "total";
  seats: number;
  transmission: "automatic" | "manual";
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  fuelEfficiency: string;
  available: boolean | number; // Updated to accept number (1, 2, etc.) or boolean
  location: string;
  features: string[];
  images: string[];
  description: string;
  
  // New properties for RCM vehicles
  dailyRate?: number;
  totalDays?: number;
  discountAmount?: number;
  numberofhours?: number | { _type: string; value: string }; // Updated to handle both number and object format
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
