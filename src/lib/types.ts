

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  vehicleCategoryTypeId?: number; // Add the numeric category type ID
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
  rateperiod?: "hour" | "day"; // New property to determine if rate is hourly or daily
  ratesubtotal?: number; // New property for the rate subtotal from API
  categoryfriendlydescription?: string; // New property for the friendly description from API
  hasLocationDiscount?: boolean; // Property to track if location discount is applied
  nextAvailableDate?: string; // Next date the vehicle becomes available (dd/MM/yyyy format)
  isCheckingAvailability?: boolean; // Whether we're currently checking future dates
  availableMessage?: string; // RCM "availablemessage" — free-text status (e.g. "Limited availability")
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

