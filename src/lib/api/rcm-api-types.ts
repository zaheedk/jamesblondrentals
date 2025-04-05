
// RCM API type definitions

export interface RCMVehicle {
  id: string;
  name: string;
  description: string;
  make: string;
  model: string;
  year: number;
  type: string;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  luggage: number;
  price: number;
  images: string[];
  features: string[];
  available: boolean;
}

export interface RCMLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export interface RCMBookingRequest {
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: string; // ISO date string
  dropoffDate: string; // ISO date string
  vehicleId: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  extras?: {
    id: string;
    quantity: number;
  }[];
}

export interface RCMBookingResponse {
  bookingId: string;
  confirmationNumber: string;
  totalAmount: number;
  status: string;
}

export interface RCMAvailabilityRequest {
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: string; // ISO date string
  dropoffDate: string; // ISO date string
}

export interface RCMApiConfig {
  apiKey: string;
  apiSecret: string;
  apiUrl: string;
}
