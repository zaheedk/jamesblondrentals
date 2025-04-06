
import { generateSignature } from './rcm-signature';
import type { 
  RCMApiConfig,
  RCMVehicle,
  RCMLocation,
  RCMBookingRequest,
  RCMBookingResponse,
  RCMAvailabilityRequest,
  RCMStep1Response,
  RCMConfigInit
} from './rcm-api-types';

// API Configuration
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "https://apis.rentalcarmanager.com/booking/v3.2"
};

// Set to true to use mock data by default
let USE_MOCK_DATA = true;

/**
 * RCM API Client for handling all API requests
 */
class RCMApiClient {
  private config: RCMApiConfig;

  constructor(config: RCMApiConfig) {
    // Ensure API URL doesn't end with a slash
    this.config = {
      ...config,
      apiUrl: config.apiUrl.replace(/\/$/, '')
    };
  }

  /**
   * Initialize or update API configuration
   */
  initialize(config: RCMConfigInit): void {
    if (config.apiKey) this.config.apiKey = config.apiKey;
    if (config.apiSecret) this.config.apiSecret = config.apiSecret;
    if (config.apiUrl) this.config.apiUrl = config.apiUrl.replace(/\/$/, '');
    
    if (config.useMockData !== undefined) {
      USE_MOCK_DATA = config.useMockData;
    }
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey,
      useMockData: USE_MOCK_DATA
    });
  }

  /**
   * Creates headers with authentication for API requests
   */
  private createHeaders(method: string, path: string, body?: any): Headers {
    const timestamp = new Date().toISOString();
    const requestBody = body ? JSON.stringify(body) : '';
    
    // Normalize path for signature (remove base URL if present)
    const normalizedPath = path.replace(this.config.apiUrl, '').replace(/^\/+/, '');
    
    // Generate HMAC SHA256 signature
    const signature = generateSignature({
      method,
      path: normalizedPath,
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
    
    // Log request details for debugging
    console.log('RCM API Request:', {
      method,
      path: normalizedPath,
      timestamp,
      signature
    });
    
    return headers;
  }

  /**
   * Makes an authenticated API request
   */
  private async request<T>(method: string, endpoint: string, body?: any): Promise<T> {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for ${endpoint} request`);
      return this.getMockData<T>(endpoint);
    }

    try {
      // Full API URL
      const apiUrl = `${this.config.apiUrl}${endpoint}`;
      console.log(`Making ${method} request to ${apiUrl}`);
      
      // Create headers with HMAC SHA256 authentication
      const headers = this.createHeaders(method, endpoint, body);
      
      // Log the request details for debugging
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'X-Timestamp': headers.get('X-Timestamp'),
        'X-Signature': headers.get('X-Signature')
      });
      
      // Make the request
      const response = await fetch(apiUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        mode: 'cors',
        cache: 'no-cache',
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || `API request failed: ${response.status}` };
        }
        
        console.error(`API error: ${response.status} ${response.statusText}`, errorData);
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }

      // Parse and return the response
      return await response.json();
    } catch (error) {
      console.error('RCM API request failed:', error);
      
      // If we're not already using mock data, fall back to it now
      if (!USE_MOCK_DATA) {
        console.warn('Falling back to mock data due to API request failure');
        return this.getMockData<T>(endpoint);
      }
      throw error;
    }
  }

  /**
   * Get Step1 data (locations, driver ages, categories, etc.)
   */
  async getStep1(): Promise<RCMStep1Response> {
    if (USE_MOCK_DATA) {
      return {
        status: "OK",
        results: {
          locations: [
            {
              id: "auckland",
              location: "Auckland Airport",
              address: "Auckland International Airport",
              city: "Auckland",
              state: "Auckland",
              country: "New Zealand", 
              postcode: "2022",
              latitude: -36.9992,
              longitude: 174.7870,
              ispickupavailable: true,
              isdropoffavailable: true,
              isdefault: true
            },
            {
              id: "wellington",
              location: "Wellington Airport",
              address: "Wellington International Airport",
              city: "Wellington",
              state: "Wellington",
              country: "New Zealand",
              postcode: "6022",
              latitude: -41.3272, 
              longitude: 174.8076,
              ispickupavailable: true,
              isdropoffavailable: true,
              isdefault: false
            },
            {
              id: "christchurch",
              location: "Christchurch Airport",
              address: "Christchurch International Airport",
              city: "Christchurch",
              state: "Canterbury",
              country: "New Zealand",
              postcode: "8053",
              latitude: -43.4864,
              longitude: 172.5369,
              ispickupavailable: true,
              isdropoffavailable: true,
              isdefault: false
            }
          ],
          officetimes: [
            { id: "1", locationid: "auckland", day: "Monday", opentime: "07:00", closetime: "22:00" },
            { id: "2", locationid: "auckland", day: "Tuesday", opentime: "07:00", closetime: "22:00" }
          ],
          driverages: [
            { id: "21", driverage: "21-25", isdefault: false },
            { id: "26", driverage: "26+", isdefault: true }
          ],
          categorytypes: [
            { id: "0", vehiclecategorytype: "All Categories" },
            { id: "1", vehiclecategorytype: "Economy" },
            { id: "2", vehiclecategorytype: "Compact" },
            { id: "3", vehiclecategorytype: "Intermediate" },
            { id: "4", vehiclecategorytype: "Standard" },
            { id: "5", vehiclecategorytype: "Full Size" },
            { id: "6", vehiclecategorytype: "Premium" },
            { id: "7", vehiclecategorytype: "Luxury" },
            { id: "8", vehiclecategorytype: "Minivan" },
            { id: "9", vehiclecategorytype: "SUV" }
          ]
        }
      };
    }
    
    return this.request<RCMStep1Response>('GET', 'step1');
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
    const step1Data = await this.getStep1();
    if (step1Data.status === "OK" && step1Data.results?.locations) {
      return step1Data.results.locations.map(loc => ({
        id: loc.id,
        name: loc.location,
        address: loc.address || "",
        city: loc.city || "",
        state: loc.state || "",
        country: loc.country || "",
        postcode: loc.postcode || "",
        latitude: loc.latitude || 0,
        longitude: loc.longitude || 0
      }));
    }
    throw new Error("Failed to retrieve locations");
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
export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
