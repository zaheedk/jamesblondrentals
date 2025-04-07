import { generateSignature } from './rcm-signature';
import type { 
  RCMApiConfig,
  RCMVehicle,
  RCMLocation,
  RCMBookingRequest,
  RCMBookingResponse,
  RCMAvailabilityRequest,
  RCMStep1Response,
  RCMConfigInit,
  RCMStep2Request,
  RCMStep2Response
} from './rcm-api-types';

// API Configuration from Web.config file
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "https://apis.rentalcarmanager.com/booking/v3.2"
};

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
    
    this.initialized = true;
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey
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
    headers.append('Accept', 'application/json');
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
    // Use the proxy URL in browser environment
    if (typeof window !== 'undefined') {
      const baseUrl = '/api/rcm';
      const apiPath = this.config.apiUrl.replace(/^https?:\/\/[^\/]+/, '');
      const url = `${baseUrl}${apiPath}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
      console.log('Built proxied API URL:', url);
      return url;
    }
    
    // Otherwise use the direct URL (for non-browser environments)
    const url = `${this.config.apiUrl}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
    console.log('Built direct API URL:', url);
    return url;
  }

  /**
   * Makes an API request with the correct format matching the Postman collection
   */
  private async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

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

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        console.error("Non-JSON response received:", contentType);
        const text = await response.text();
        console.error("Response text:", text);
        throw new Error(`API returned non-JSON response: ${response.status} ${response.statusText}`);
      }

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
      throw error;
    }
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

  /**
   * Get Step2 data (available vehicles)
   * Using method name 'step2' as indicated in the provided code
   */
  async getStep2(params: RCMStep2Request): Promise<RCMStep2Response> {
    console.log('Fetching Step2 data with params:', params);
    // Log specifically the category ID for debugging
    if ('vehiclecategorytypeid' in params) {
      console.log('Vehicle category type ID:', params.vehiclecategorytypeid, 'Type:', typeof params.vehiclecategorytypeid);
    } else {
      console.log('No vehicle category type ID in request - using all categories');
    }
    return this.request<RCMStep2Response>('POST', 'step2', params);
  }
}

// Export a singleton instance
export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
