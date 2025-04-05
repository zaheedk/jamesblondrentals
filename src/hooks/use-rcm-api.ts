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

export function useRcmApi() {
  const queryClient = useQueryClient();
  
  // Get all locations
  const useLocations = () => {
    return useQuery({
      queryKey: ['locations'],
      queryFn: () => rcmApi.getLocations(),
      onError: (error) => {
        console.error('Location fetch error:', error);
        toast.error('Failed to load locations. Using fallback locations.', {
          description: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    });
  };
  
  // Get available vehicles based on search criteria
  const useAvailableVehicles = (params: RCMAvailabilityRequest | null) => {
    return useQuery({
      queryKey: ['availableVehicles', params],
      queryFn: () => params ? rcmApi.getAvailableVehicles(params) : Promise.resolve([]),
      enabled: !!params,
    });
  };
  
  // Get vehicle details by ID
  const useVehicleDetails = (vehicleId: string | null) => {
    return useQuery({
      queryKey: ['vehicleDetails', vehicleId],
      queryFn: () => vehicleId ? rcmApi.getVehicleById(vehicleId) : Promise.resolve(null),
      enabled: !!vehicleId,
    });
  };
  
  // Create booking mutation
  const useCreateBooking = () => {
    return useMutation({
      mutationFn: (bookingData: RCMBookingRequest) => rcmApi.createBooking(bookingData),
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
  };
}
