
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rcmApi } from '@/lib/api/rcm-api';
import type { 
  RCMVehicle, 
  RCMLocation, 
  RCMBookingRequest, 
  RCMAvailabilityRequest 
} from '@/lib/api/rcm-api-types';
import { toast } from 'sonner';

// Fallback locations in case the API call fails
const FALLBACK_LOCATIONS: RCMLocation[] = [
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
];

// Define retry configuration for API calls
const API_RETRY_CONFIG = {
  retries: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
};

export function useRcmApi() {
  const queryClient = useQueryClient();
  
  // Get all locations with fallback mechanism
  const useLocations = () => {
    return useQuery({
      queryKey: ['locations'],
      queryFn: async () => {
        try {
          const locations = await rcmApi.getLocations();
          console.log('Locations loaded successfully:', locations.length);
          return locations;
        } catch (error) {
          console.error('Location fetch error:', error);
          toast.error('Failed to load locations. Using fallback locations.', {
            description: error instanceof Error ? error.message : 'Unknown error occurred'
          });
          // Return fallback locations on error
          return FALLBACK_LOCATIONS;
        }
      },
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
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
          toast.error('Error loading available vehicles', {
            description: error instanceof Error ? error.message : 'Unknown error occurred'
          });
          return [];
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
          toast.error('Error loading vehicle details', {
            description: error instanceof Error ? error.message : 'Unknown error occurred'
          });
          return null;
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
          toast.error('Failed to create booking', {
            description: error instanceof Error ? error.message : 'Unknown error occurred'
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
    useLocations,
    useAvailableVehicles,
    useVehicleDetails,
    useCreateBooking,
    FALLBACK_LOCATIONS
  };
}
