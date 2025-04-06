
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rcmApi } from '@/lib/api/rcm-api';
import type { 
  RCMVehicle, 
  RCMLocation, 
  RCMBookingRequest, 
  RCMAvailabilityRequest,
  RCMConfigInit,
  RCMOfficeTime
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
  retries: 1, // Reduced retries to avoid unnecessary API calls
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
            description: 'Failed to connect to RCM API. Check your API settings.'
          });
          // Return fallback locations on error
          return FALLBACK_LOCATIONS;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
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
          return [];
        } catch (error) {
          console.error('Office hours fetch error:', error);
          return [];
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
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
          return [];
        } catch (error) {
          console.error('Location details fetch error:', error);
          return [];
        }
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
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
          return [];
        } catch (error) {
          console.error('Driver ages fetch error:', error);
          return [
            { id: "21", driverage: "21-25", isdefault: false },
            { id: "26", driverage: "26+", isdefault: true }
          ];
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
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
          return [];
        } catch (error) {
          console.error('Vehicle categories fetch error:', error);
          return [
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
          ];
        }
      },
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
          toast.error('API Connection Error', {
            description: 'Failed to fetch vehicles. Check your API credentials.'
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
          toast.error('API Connection Error', {
            description: 'Failed to fetch vehicle details. Check your API settings.'
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
    useLocationDetails,
    FALLBACK_LOCATIONS
  };
}
