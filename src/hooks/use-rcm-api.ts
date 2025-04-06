
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rcmApi } from '@/lib/api/rcm-api';
import type { 
  RCMVehicle, 
  RCMLocation, 
  RCMBookingRequest, 
  RCMAvailabilityRequest,
  RCMConfigInit
} from '@/lib/api/rcm-api-types';
import { toast } from 'sonner';

// Define retry configuration for API calls
const API_RETRY_CONFIG = {
  retries: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
};

export function useRcmApi() {
  const queryClient = useQueryClient();
  
  // Initialize API with configuration
  const initializeApi = useCallback((config: RCMConfigInit) => {
    rcmApi.initialize(config);
    console.log('API initialized with config:', {
      ...config,
      apiSecret: config.apiSecret ? '******' : undefined
    });
    // Invalidate all location queries to force refetch with new config
    return queryClient.invalidateQueries({ queryKey: ['locations'] });
  }, [queryClient]);
  
  // Get all locations with step1 API call
  const useLocations = () => {
    return useQuery({
      queryKey: ['locations'],
      queryFn: async () => {
        try {
          const response = await rcmApi.getStep1();
          console.log('Step1 API response:', response);
          
          if (response.status === "OK" && response.results?.locations) {
            // Transform the API response to match our expected format
            const locations = response.results.locations.map(loc => ({
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
            
            console.log('Locations loaded successfully:', locations.length);
            return locations;
          } else {
            throw new Error("Invalid location data received");
          }
        } catch (error) {
          console.error('Location fetch error:', error);
          toast.error('API Connection Error', {
            description: 'Failed to connect to RCM API.'
          });
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  // Get office hours
  const useOfficeHours = () => {
    return useQuery({
      queryKey: ['officeHours'],
      queryFn: async () => {
        try {
          const response = await rcmApi.getStep1();
          if (response.status === "OK" && response.results?.officetimes) {
            console.log('Office hours loaded:', response.results.officetimes.length);
            return response.results.officetimes;
          }
          throw new Error("No office hours data received");
        } catch (error) {
          console.error('Office hours fetch error:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  // Get location details by ID to access advanced properties
  const useLocationDetails = () => {
    return useQuery({
      queryKey: ['locationDetails'],
      queryFn: async () => {
        try {
          const response = await rcmApi.getStep1();
          if (response.status === "OK" && response.results?.locations) {
            return response.results.locations;
          }
          throw new Error("No location details received");
        } catch (error) {
          console.error('Location details fetch error:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  // Get driver ages
  const useDriverAges = () => {
    return useQuery({
      queryKey: ['driverAges'],
      queryFn: async () => {
        try {
          const response = await rcmApi.getStep1();
          if (response.status === "OK" && response.results?.driverages) {
            console.log('Driver ages data:', response.results.driverages);
            return Array.from(response.results.driverages);
          }
          throw new Error("No driver ages data received");
        } catch (error) {
          console.error('Driver ages fetch error:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  // Get vehicle categories
  const useVehicleCategories = () => {
    return useQuery({
      queryKey: ['vehicleCategories'],
      queryFn: async () => {
        try {
          const response = await rcmApi.getStep1();
          if (response.status === "OK" && response.results?.categorytypes) {
            console.log('Vehicle categories data:', response.results.categorytypes);
            return Array.from(response.results.categorytypes);
          }
          throw new Error("No vehicle categories data received");
        } catch (error) {
          console.error('Vehicle categories fetch error:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  // Get available vehicles based on search criteria
  const useAvailableVehicles = (params: RCMAvailabilityRequest | null) => {
    return useQuery({
      queryKey: ['availableVehicles', params],
      queryFn: async () => {
        if (!params) return [];
        
        try {
          const vehicles = await rcmApi.getAvailableVehicles(params);
          return vehicles;
        } catch (error) {
          console.error('Failed to fetch available vehicles:', error);
          toast.error('API Connection Error', {
            description: 'Failed to fetch vehicles. Check your API credentials.'
          });
          throw error;
        }
      },
      enabled: !!params,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  // Get vehicle details by ID
  const useVehicleDetails = (vehicleId: string | null) => {
    return useQuery({
      queryKey: ['vehicleDetails', vehicleId],
      queryFn: async () => {
        if (!vehicleId) return null;
        
        try {
          const vehicle = await rcmApi.getVehicleById(vehicleId);
          return vehicle;
        } catch (error) {
          console.error('Failed to fetch vehicle details:', error);
          toast.error('API Connection Error', {
            description: 'Failed to fetch vehicle details. Check your API settings.'
          });
          throw error;
        }
      },
      enabled: !!vehicleId,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  // Create booking mutation
  const useCreateBooking = () => {
    return useMutation({
      mutationFn: async (bookingData: RCMBookingRequest) => {
        try {
          const response = await rcmApi.createBooking(bookingData);
          toast.success('Booking created successfully!', {
            description: `Confirmation #: ${response.confirmationNumber}`
          });
          return response;
        } catch (error) {
          console.error('Booking creation error:', error);
          toast.error('API Connection Error', {
            description: 'Failed to create booking. Check your API credentials.'
          });
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['availableVehicles'] });
      },
    });
  };

  return {
    initializeApi,
    useLocations,
    useOfficeHours,
    useDriverAges,
    useVehicleCategories,
    useAvailableVehicles,
    useVehicleDetails,
    useCreateBooking,
    useLocationDetails
  };
}
