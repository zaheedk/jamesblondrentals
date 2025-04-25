import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rcmApi } from '@/lib/api/rcm-api';
import type { 
  RCMVehicle, 
  RCMLocation, 
  RCMBookingRequest, 
  RCMAvailabilityRequest,
  RCMConfigInit,
  RCMStep2Request,
  RCMDriverAge,
  RCMStep3Request
} from '@/lib/api/rcm-api-types';
import { toast } from 'sonner';

const API_RETRY_CONFIG = {
  retries: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
};

export function useRcmApi() {
  const queryClient = useQueryClient();
  
  const initializeApi = useCallback((config: RCMConfigInit) => {
    rcmApi.initialize(config);
    console.log('API initialized with config:', {
      ...config,
      apiSecret: config.apiSecret ? '******' : undefined
    });
    return queryClient.invalidateQueries({ queryKey: ['locations'] });
  }, [queryClient]);
  
  const useLocations = () => {
    return useQuery({
      queryKey: ['locations'],
      queryFn: async () => {
        try {
          const response = await rcmApi.getStep1();
          console.log('Step1 API response:', response);
          
          if (response.status === "OK" && response.results?.locations) {
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
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
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
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
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
  
  const useDriverAges = () => {
    return useQuery({
      queryKey: ['driverAges'],
      queryFn: async (): Promise<RCMDriverAge[]> => {
        try {
          const response = await rcmApi.getStep1();
          if (response.status === "OK" && response.results?.driverages) {
            const driverAges = Array.from(response.results.driverages);
            
            const twentySixPlusAge = driverAges.find(
              age => age.driverage === '26+' || age.driverage === '26'
            );
            
            driverAges.forEach(age => {
              age.isdefault = age === twentySixPlusAge;
            });
            
            console.log('Driver ages data:', driverAges);
            return driverAges;
          }
          throw new Error("No driver ages data received");
        } catch (error) {
          console.error('Driver ages fetch error:', error);
          toast.error('Failed to load driver ages', {
            description: 'This may affect vehicle availability search.'
          });
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
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
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  const useStep2Vehicles = (params: RCMStep2Request | null) => {
    return useQuery({
      queryKey: ['step2Vehicles', params],
      queryFn: async () => {
        if (!params) return null;
        
        try {
          console.log('Fetching Step2 vehicles with params:', params);
          
          if (!params.ageid) {
            console.error('Missing required ageid parameter for Step2 API call');
            toast.error('API Parameter Error', {
              description: 'Missing required driver age parameter'
            });
            throw new Error('Missing required ageid parameter');
          }
          
          const response = await rcmApi.getStep2(params);
          console.log('Step2 response:', response);
          
          if (response.status === "OK") {
            return response;
          } else {
            throw new Error(response.error || "Failed to fetch available vehicles");
          }
        } catch (error) {
          console.error('Failed to fetch available vehicles:', error);
          toast.error('API Connection Error', {
            description: 'Failed to fetch vehicles. Please try again.'
          });
          throw error;
        }
      },
      enabled: !!params && !!params.ageid,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
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
  
  const useStep3Details = (params: RCMStep3Request | null) => {
    return useQuery({
      queryKey: ['step3Details', params],
      queryFn: async () => {
        if (!params) return null;
        
        try {
          console.log('Fetching Step3 details with params:', params);
          
          const response = await rcmApi.getStep3(params);
          console.log('Step3 response:', response);
          
          if (response.status === "OK") {
            return response;
          } else {
            throw new Error(response.error || "Failed to fetch vehicle extras");
          }
        } catch (error) {
          console.error('Failed to fetch vehicle extras:', error);
          toast.error('API Connection Error', {
            description: 'Failed to fetch vehicle extras. Please try again.'
          });
          throw error;
        }
      },
      enabled: !!params,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };
  
  const useCreateBooking = () => {
    return useMutation({
      mutationFn: async (bookingData: RCMBookingRequest) => {
        try {
          console.log('Creating booking with data:', bookingData);
          const response = await rcmApi.createBooking(bookingData);
          
          if (response.status === "OK") {
            toast.success('Booking created successfully!', {
              description: response.confirmationNumber 
                ? `Confirmation #: ${response.confirmationNumber}` 
                : (response.results?.reservationref 
                  ? `Reservation #: ${response.results.reservationref}` 
                  : "Booking confirmed!")
            });
          } else {
            toast.error('Booking failed', {
              description: response.error || "Unknown error occurred"
            });
            throw new Error(response.error || "Failed to create booking");
          }
          
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

  const useBookingDetails = (reservationRef: string | null) => {
    return useQuery({
      queryKey: ['bookingDetails', reservationRef],
      queryFn: async () => {
        if (!reservationRef) return null;
        
        try {
          console.log('Fetching booking details for reservation:', reservationRef);
          
          const response = await rcmApi.request('POST', 'bookinginfo', {
            method: 'bookinginfo',
            reservationref: reservationRef
          });
          
          const typedResponse = response as { status: string, results?: any, error?: string };
          
          if (typedResponse.status === "OK") {
            console.log('Booking details retrieved:', typedResponse);
            return typedResponse.results;
          } else {
            throw new Error(typedResponse.error || "Failed to fetch booking details");
          }
        } catch (error) {
          console.error('Failed to fetch booking details:', error);
          toast.error('API Connection Error', {
            description: 'Failed to fetch booking details.'
          });
          throw error;
        }
      },
      enabled: !!reservationRef,
      retry: API_RETRY_CONFIG.retries,
      retryDelay: API_RETRY_CONFIG.retryDelay,
    });
  };

  return {
    rcmApi,
    initializeApi,
    useLocations,
    useOfficeHours,
    useDriverAges,
    useVehicleCategories,
    useAvailableVehicles,
    useVehicleDetails,
    useCreateBooking,
    useLocationDetails,
    useStep2Vehicles,
    useStep3Details,
    useBookingDetails
  };
}
