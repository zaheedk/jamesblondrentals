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
  RCMStep3Response,
  RCMPaymentRequest,
  RCMPaymentResponse
} from './rcm-api-types';
import { toast } from 'sonner';

// API Configuration from Web.config file
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "/api/rcm/booking/v3.2" // Use the proxy URL
};

class RCMApiClient {
  private config: RCMApiConfig;
  private initialized: boolean = false;

  constructor(config: RCMApiConfig) {
    this.config = {
      ...config,
      apiUrl: config.apiUrl.replace(/\/$/, '')
    };
  }

  initialize(config: RCMConfigInit): void {
    if (config.apiKey) this.config.apiKey = config.apiKey;
    if (config.apiSecret) this.config.apiSecret = config.apiSecret;
    if (config.apiUrl) this.config.apiUrl = config.apiUrl.replace(/\/$/, '');
    this.initialized = true;
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey ? '******' : undefined
    });
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      console.log('RCM API not explicitly initialized, using default config');
      this.initialized = true;
    }
  }

  private createHeaders(method: string, body?: any): Headers {
    this.ensureInitialized();

    const timestamp = new Date().toISOString();
    const requestBody = body ? JSON.stringify(body) : '{}';
    
    const signature = generateSignature({
      method,
      path: '', 
      timestamp,
      apiKey: this.config.apiKey,
      apiSecret: this.config.apiSecret,
      body: requestBody
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('signature', signature); 
    
    return headers;
  }

  private buildApiUrl(): string {
    return `${this.config.apiUrl}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
  }

  async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    try {
      const apiUrl = this.buildApiUrl();
      console.log(`Making ${method} request to ${apiUrl} for method ${requestMethod}`);
      
      const requestBody = { method: requestMethod, ...body };
      const headers = this.createHeaders(method, requestBody);
      
      const response = await fetch(apiUrl, {
        method,
        headers,
        body: JSON.stringify(requestBody),
        credentials: 'same-origin',
      });

      // Check for HTML responses which indicate proxy issues
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        console.error("Received HTML instead of JSON. This likely indicates a proxy configuration issue.");
        throw new Error("API returned HTML instead of JSON. Please check API configuration.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || `API request failed: ${response.status}` };
        }
        
        console.error(`API error: ${response.status} ${response.statusText}`, errorData);
        throw new Error(errorData.message || `Request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      
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
   * Create a booking with the RCM API
   */
  async createBooking(bookingData: RCMBookingRequest): Promise<RCMBookingResponse> {
    console.log('Creating booking with data:', bookingData);
    
    try {
      // Use 'booking' as the method name based on the provided example code
      const response = await this.request<RCMBookingResponse>('POST', 'booking', bookingData);
      
      if (response.status === "OK") {
        console.log('Booking created successfully:', response);
        return response;
      } else {
        console.error('API returned error:', response.error || 'Unknown error');
        throw new Error(response.error || "Failed to create booking");
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }

  /**
   * Create a payment session with the RCM API
   */
  async createPaymentSession(paymentData: RCMPaymentRequest): Promise<RCMPaymentResponse> {
    console.log('Creating payment session with data:', paymentData);
    
    try {
      // Using 'createdpspayment' as the method name based on the provided example code
      const response = await this.request<RCMPaymentResponse>('POST', 'createdpspayment', paymentData);
      
      if (response.status === "OK") {
        console.log('Payment session created successfully:', response);
        return response;
      } else {
        console.error('API returned error:', response.error || 'Unknown error');
        throw new Error(response.error || "Failed to create payment session");
      }
    } catch (error) {
      console.error('Payment session creation error:', error);
      throw error;
    }
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

  /**
   * Get Step3 data (insurance options, km charges, extras)
   * Using method name 'step3' as indicated in the API documentation
   */
  async getStep3(params: RCMStep3Request): Promise<RCMStep3Response> {
    console.log('Fetching Step3 data with params:', params);
    
    try {
      const response = await this.request<RCMStep3Response>('POST', 'step3', params);
      
      // Additional logging to debug extras
      if (response.status === "OK" && response.results) {
        console.log('Step3 response received with status OK');
        console.log('Extras in response:', response.results.extras);
        console.log('Extras type:', typeof response.results.extras);
        
        // Ensure extras is always an array
        if (!response.results.extras) {
          console.log('No extras in response, setting to empty array');
          response.results.extras = [];
        } else if (!Array.isArray(response.results.extras)) {
          console.log('Extras is not an array, converting:', response.results.extras);
          try {
            // If the API returns an object or string, try to convert it to an array
            response.results.extras = [];
          } catch (e) {
            console.error('Failed to parse extras:', e);
            response.results.extras = [];
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error in getStep3:', error);
      // Return a valid but empty response on error
      return {
        status: "ERR",
        error: error instanceof Error ? error.message : "Unknown error in getStep3",
        results: {
          insuranceoptions: [],
          kmcharges: [],
          extras: [],
          locationfees: {
            vehiclecategoryid: 0,
            currencysymbol: "$",
            currencyname: "USD"
          }
        }
      };
    }
  }
}

// Export a singleton instance
export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
