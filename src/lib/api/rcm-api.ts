
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

/**
 * RCM API Client for handling all API requests
 */
class RCMApiClient {
  private config: RCMApiConfig;

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
   * Makes an authenticated API request
   */
  private async request<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;
    const headers = this.createHeaders(method, endpoint, body);

    try {
      console.log(`Making ${method} request to ${url}`);
      
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        mode: 'cors',
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
