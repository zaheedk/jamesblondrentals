
import { generateSignature } from './rcm-signature';
import type { 
  RCMApiConfig,
  RCMVehicle,
  RCMLocation,
  RCMBookingRequest,
  RCMBookingResponse,
  RCMAvailabilityRequest
} from './rcm-api-types';

// API Configuration
const API_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "https://apis.rentalcarmanager.com/booking/v3.2/"
};

// CORS Proxy options - we'll try multiple if needed
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/"
];

// Set to true to bypass actual API calls and use mock data
const USE_MOCK_DATA = true;

/**
 * RCM API Client for handling all API requests
 */
class RCMApiClient {
  private config: RCMApiConfig;
  private currentProxyIndex = 0;

  constructor(config: RCMApiConfig) {
    this.config = config;
  }

  /**
   * Creates headers with authentication for API requests
   */
  private createHeaders(method: string, path: string, body?: any): Headers {
    const timestamp = new Date().toISOString();
    const requestBody = body ? JSON.stringify(body) : '';
    
    const signature = generateSignature({
      method,
      path,
      timestamp,
      apiKey: this.config.apiKey,
      apiSecret: this.config.apiSecret,
      body: requestBody
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-API-Key', this.config.apiKey);
    headers.append('X-Timestamp', timestamp);
    headers.append('X-Signature', signature);
    
    return headers;
  }

  /**
   * Gets the next CORS proxy to try
   */
  private getNextProxy(): string {
    const proxy = CORS_PROXIES[this.currentProxyIndex];
    this.currentProxyIndex = (this.currentProxyIndex + 1) % CORS_PROXIES.length;
    return proxy;
  }

  /**
   * Makes an authenticated API request through a CORS proxy
   */
  private async request<T>(method: string, endpoint: string, body?: any): Promise<T> {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for ${endpoint} request`);
      return this.getMockData<T>(endpoint);
    }

    const apiUrl = `${this.config.apiUrl}${endpoint}`;
    const proxyUrl = `${this.getNextProxy()}${encodeURIComponent(apiUrl)}`;
    const headers = this.createHeaders(method, endpoint, body);

    try {
      console.log(`Making ${method} request to ${apiUrl} via CORS proxy ${proxyUrl}`);
      
      const response = await fetch(proxyUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`API error: ${response.status} ${response.statusText}`, error);
        throw new Error(error.message || `API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('RCM API request failed:', error);
      throw error;
    }
  }

  /**
   * Returns mock data for development and testing
   */
  private getMockData<T>(endpoint: string): T {
    if (endpoint === 'locations') {
      return [
        { 
          id: "auckland", 
          name: "Auckland Airport",
          address: "Auckland International Airport",
          city: "Auckland",
          state: "Auckland",
          country: "New Zealand",
          postcode: "2022",
          latitude: -36.9992,
          longitude: 174.7870
        },
        { 
          id: "wellington", 
          name: "Wellington Airport",
          address: "Wellington International Airport",
          city: "Wellington",
          state: "Wellington",
          country: "New Zealand",
          postcode: "6022",
          latitude: -41.3272,
          longitude: 174.8076
        },
        { 
          id: "christchurch", 
          name: "Christchurch Airport",
          address: "Christchurch International Airport",
          city: "Christchurch",
          state: "Canterbury",
          country: "New Zealand",
          postcode: "8053",
          latitude: -43.4864,
          longitude: 172.5369
        },
        { 
          id: "queenstown", 
          name: "Queenstown Airport",
          address: "Queenstown Airport",
          city: "Queenstown",
          state: "Otago",
          country: "New Zealand",
          postcode: "9300",
          latitude: -45.0210,
          longitude: 168.7393
        },
        { 
          id: "rotorua", 
          name: "Rotorua City",
          address: "1106 Arawa Street",
          city: "Rotorua",
          state: "Bay of Plenty",
          country: "New Zealand",
          postcode: "3010",
          latitude: -38.1368,
          longitude: 176.2497
        }
      ] as unknown as T;
    } 
    else if (endpoint.includes('vehicles/available')) {
      // Mock vehicle data
      return [
        {
          id: "eco1",
          name: "Toyota Corolla or similar",
          description: "Comfortable and fuel efficient compact car",
          make: "Toyota",
          model: "Corolla",
          year: 2023,
          type: "Sedan",
          category: "Economy",
          transmission: "Automatic",
          fuelType: "Petrol",
          seats: 5,
          luggage: 2,
          price: 45,
          available: true,
          images: ["https://placehold.co/600x400?text=Toyota+Corolla"],
          features: ["Air Conditioning", "Bluetooth", "Cruise Control"]
        },
        {
          id: "suv1",
          name: "Toyota RAV4 or similar",
          description: "Spacious SUV perfect for adventure",
          make: "Toyota",
          model: "RAV4",
          year: 2023,
          type: "SUV",
          category: "Standard SUV",
          transmission: "Automatic",
          fuelType: "Hybrid",
          seats: 5,
          luggage: 4,
          price: 65,
          available: true,
          images: ["https://placehold.co/600x400?text=Toyota+RAV4"],
          features: ["Air Conditioning", "Bluetooth", "Cruise Control", "Backup Camera", "Navigation"]
        },
        {
          id: "lux1",
          name: "BMW 3 Series or similar",
          description: "Luxury sedan with premium features",
          make: "BMW",
          model: "3 Series",
          year: 2023,
          type: "Sedan",
          category: "Luxury",
          transmission: "Automatic",
          fuelType: "Petrol",
          seats: 5,
          luggage: 3,
          price: 85,
          available: true,
          images: ["https://placehold.co/600x400?text=BMW+3+Series"],
          features: ["Leather Seats", "Bluetooth", "Cruise Control", "Backup Camera", "Navigation", "Heated Seats"]
        }
      ] as unknown as T;
    }
    else if (endpoint.includes('vehicles/')) {
      // Mock single vehicle data
      return {
        id: "eco1",
        name: "Toyota Corolla or similar",
        description: "Comfortable and fuel efficient compact car",
        make: "Toyota",
        model: "Corolla",
        year: 2023,
        type: "Sedan",
        category: "Economy",
        transmission: "Automatic",
        fuelType: "Petrol",
        seats: 5,
        luggage: 2,
        price: 45,
        available: true,
        images: ["https://placehold.co/600x400?text=Toyota+Corolla"],
        features: ["Air Conditioning", "Bluetooth", "Cruise Control"]
      } as unknown as T;
    }
    else if (endpoint === 'bookings') {
      // Mock booking response
      return {
        bookingId: "MOCK-" + Date.now(),
        confirmationNumber: "MOCK" + Math.floor(Math.random() * 1000000),
        totalAmount: 235.50,
        status: "confirmed"
      } as unknown as T;
    }
    
    // Generic fallback
    return {} as T;
  }

  /**
   * Get all available locations
   */
  async getLocations(): Promise<RCMLocation[]> {
    return this.request<RCMLocation[]>('GET', 'locations');
  }

  /**
   * Get available vehicles based on location and dates
   */
  async getAvailableVehicles(params: RCMAvailabilityRequest): Promise<RCMVehicle[]> {
    const queryString = new URLSearchParams({
      pickupLocationId: params.pickupLocationId,
      dropoffLocationId: params.dropoffLocationId,
      pickupDate: params.pickupDate,
      dropoffDate: params.dropoffDate
    }).toString();
    
    return this.request<RCMVehicle[]>('GET', `vehicles/available?${queryString}`);
  }

  /**
   * Get vehicle details by ID
   */
  async getVehicleById(vehicleId: string): Promise<RCMVehicle> {
    return this.request<RCMVehicle>('GET', `vehicles/${vehicleId}`);
  }

  /**
   * Create a booking
   */
  async createBooking(bookingData: RCMBookingRequest): Promise<RCMBookingResponse> {
    return this.request<RCMBookingResponse>('POST', 'bookings', bookingData);
  }
}

// Export a singleton instance
export const rcmApi = new RCMApiClient(API_CONFIG);
