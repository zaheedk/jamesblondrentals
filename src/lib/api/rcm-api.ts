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
  RCMStep2Response,
  RCMStep3Request,
  RCMStep3Response
} from './rcm-api-types';
import { toast } from 'sonner';

// API Configuration from Web.config file
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "/api/rcm/booking/v3.2" // Use the proxy URL
};

/**
 * RCM API Client for handling all API requests
 */
class RCMApiClient {
  private config: RCMApiConfig;
  private initialized: boolean = false;
  private useMockData: boolean = false;

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
    this.useMockData = config.useMockData || false;
    
    this.initialized = true;
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey,
      useMockData: this.useMockData
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
    
    // Generate HMAC SHA256 signature
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
    headers.append('signature', signature); 
    
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
   * Format: /api/rcm/booking/v3.2/[API_KEY]?apikey=[API_KEY]
   */
  private buildApiUrl(): string {
    const url = `${this.config.apiUrl}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
    console.log('Built API URL:', url);
    return url;
  }

  // Mock data for testing when API is not available
  private getMockData(method: string): any {
    // Keep mock data but it won't be used unless fallback is needed
    return { status: "OK", error: "No mock data available for this method" };
  }

  /**
   * Makes an API request with the correct format matching the Postman collection
   */
  private async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    // Only use mock data if explicitly enabled
    if (this.useMockData) {
      console.log('Using mock data for', requestMethod);
      return this.getMockData(requestMethod) as T;
    }

    try {
      // Build the URL with API key
      const apiUrl = this.buildApiUrl();
      console.log(`Making ${method} request to ${apiUrl}`);
      
      // Create requestBody with method as the first property
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
        
        // Only use mock data as fallback if API returns non-JSON and we're in fallback mode
        if (this.useMockData === false) {
          console.log("API returned non-JSON response");
          toast.error("API Connection Error", {
            description: "The API returned an unexpected format. Please check API configuration."
          });
          throw new Error(`API returned non-JSON response: ${response.status} ${response.statusText}`);
        }
        
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
        toast.error("API Connection Error", {
          description: errorData.message || `Request failed with status: ${response.status}`
        });
        
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
    
    // We'll no longer strip out the "0" value, since we want to explicitly pass it
    // to indicate "All Categories" rather than removing it entirely

    return this.request<RCMStep2Response>('POST', 'step2', params);
  }

  /**
   * Get Step3 data (insurance options, km charges, extras)
   * Using method name 'step3' as indicated in the API documentation
   */
  async getStep3(params: RCMStep3Request): Promise<RCMStep3Response> {
    console.log('Fetching Step3 data with params:', params);
    
    return this.request<RCMStep3Response>('POST', 'step3', params);
  }
}

// Export a singleton instance
export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
