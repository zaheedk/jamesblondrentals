
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

// API Configuration from Web.config file
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "https://apis.rentalcarmanager.com/booking/v3.2"
};

// Set to false to use actual API by default
let USE_MOCK_DATA = false;

/**
 * RCM API Client for handling all API requests
 */
class RCMApiClient {
  private config: RCMApiConfig;
  private initialized: boolean = false;

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
    
    this.initialized = true;
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey,
      useMockData: USE_MOCK_DATA
    });
  }

  /**
   * Ensure the API is initialized before making requests
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      console.log('RCM API not explicitly initialized, using default config');
      this.initialized = true;
    }
  }

  /**
   * Creates headers with authentication for API requests based on the Postman collection
   */
  private createHeaders(method: string, body?: any): Headers {
    this.ensureInitialized();

    const timestamp = new Date().toISOString();
    const requestBody = body ? JSON.stringify(body) : '{}';
    
    // Generate HMAC SHA256 signature - this now exactly matches the Postman collection
    const signature = generateSignature({
      method,
      path: '', // Not used in actual signature generation
      timestamp,
      apiKey: this.config.apiKey,
      apiSecret: this.config.apiSecret,
      body: requestBody
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('signature', signature); // Uses 'signature' key as shown in Postman
    
    // Log request details for debugging
    console.log('RCM API Request:', {
      method,
      timestamp,
      signature,
      body: requestBody
    });
    
    return headers;
  }

  /**
   * Builds the correct API URL with the API key format
   * Format: https://apis.rentalcarmanager.com/booking/v3.2/[API_KEY]?apikey=[API_KEY]
   * Exactly as shown in the Postman collection
   */
  private buildApiUrl(): string {
    // Use the proxy URL if we're not using mock data and are in browser environment
    if (!USE_MOCK_DATA && typeof window !== 'undefined') {
      const baseUrl = '/api/rcm';
      const apiPath = this.config.apiUrl.replace(/^https?:\/\/[^\/]+/, '');
      const url = `${baseUrl}${apiPath}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
      console.log('Built proxied API URL:', url);
      return url;
    }
    
    // Otherwise use the direct URL (for mock data or non-browser environments)
    const url = `${this.config.apiUrl}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
    console.log('Built direct API URL:', url);
    return url;
  }

  /**
   * Makes an API request with the correct format matching the Postman collection
   */
  private async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    // Don't use mock data by default
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for ${requestMethod} request`);
      return this.getMockData<T>(requestMethod);
    }

    try {
      // Build the URL with API key
      const apiUrl = this.buildApiUrl();
      console.log(`Making ${method} request to ${apiUrl}`);
      
      // Create requestBody with method as the first property, matching Postman
      const requestBody = { method: requestMethod, ...body };
      
      // Create headers with auth tokens
      const headers = this.createHeaders(method, requestBody);
      
      // Make the request
      const response = await fetch(apiUrl, {
        method,
        headers,
        body: JSON.stringify(requestBody),
        credentials: 'same-origin', // Important for cookies if needed
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
      const responseData = await response.json();
      console.log('API response:', responseData);
      
      // Check for API errors in the response
      if (responseData.status === "ERR") {
        console.error('API returned error:', responseData.error);
        throw new Error(responseData.error || 'Unknown API error');
      }
      
      return responseData;
    } catch (error) {
      console.error('RCM API request failed:', error);
      
      // If we specifically want to fall back to mock data, do it here
      if (!USE_MOCK_DATA && error instanceof Error && error.message.includes('fallback')) {
        console.warn('Falling back to mock data due to API request failure');
        return this.getMockData<T>(requestMethod);
      }
      throw error;
    }
  }

  /**
   * Returns mock data for development and testing
   * Only used if USE_MOCK_DATA is true or if API fails with fallback flag
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
   * Get Step1 data (locations, driver ages, categories, etc.)
   * Using method name 'step1' as indicated in the Postman collection
   */
  async getStep1(): Promise<RCMStep1Response> {
    return this.request<RCMStep1Response>('POST', 'step1');
  }

  /**
   * Get all available locations
   */
  async getLocations(): Promise<RCMLocation[]> {
    const step1Data = await this.getStep1();
    if (step1Data.status === "OK" && step1Data.results?.locations) {
      return step1Data.results.locations.map(loc => ({
        id: String(loc.id), // Convert id to string to match RCMLocation type
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
    return this.request<RCMVehicle[]>('POST', 'vehicles/available', params);
  }

  /**
   * Get vehicle details by ID
   */
  async getVehicleById(vehicleId: string): Promise<RCMVehicle> {
    return this.request<RCMVehicle>('POST', 'vehicles/details', { id: vehicleId });
  }

  /**
   * Create a booking
   */
  async createBooking(bookingData: RCMBookingRequest): Promise<RCMBookingResponse> {
    return this.request<RCMBookingResponse>('POST', 'booking', bookingData);
  }
}

// Export a singleton instance
export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
