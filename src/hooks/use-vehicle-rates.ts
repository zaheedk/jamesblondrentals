import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VehicleRate {
  id: string;
  website_name: string;
  vehicle_category: string;
  daily_rate: number;
  rental_period_days: number;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

interface ScrapingResult {
  success: boolean;
  message: string;
  rates_count?: number;
  websites_scraped?: number;
  error?: string;
}

export function useVehicleRates() {
  const queryClient = useQueryClient();

  const useRates = (limit: number = 50) => {
    return useQuery({
      queryKey: ['vehicle-rates', limit],
      queryFn: async (): Promise<VehicleRate[]> => {
        const { data, error } = await supabase
          .from('vehicle_rental_rates')
          .select('*')
          .order('scraped_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Error fetching rates:', error);
          throw error;
        }

        return data || [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    });
  };

  const useRatesByWebsite = (website: string) => {
    return useQuery({
      queryKey: ['vehicle-rates', 'website', website],
      queryFn: async (): Promise<VehicleRate[]> => {
        const { data, error } = await supabase
          .from('vehicle_rental_rates')
          .select('*')
          .eq('website_name', website)
          .order('scraped_at', { ascending: false });

        if (error) {
          console.error('Error fetching rates by website:', error);
          throw error;
        }

        return data || [];
      },
      enabled: !!website,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  const useRatesByCategory = (category: string) => {
    return useQuery({
      queryKey: ['vehicle-rates', 'category', category],
      queryFn: async (): Promise<VehicleRate[]> => {
        const { data, error } = await supabase
          .from('vehicle_rental_rates')
          .select('*')
          .eq('vehicle_category', category)
          .order('scraped_at', { ascending: false });

        if (error) {
          console.error('Error fetching rates by category:', error);
          throw error;
        }

        return data || [];
      },
      enabled: !!category,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  const useScrapeMutation = () => {
    return useMutation({
      mutationFn: async (): Promise<ScrapingResult> => {
        console.log('Starting vehicle rate scraping...');
        
        const { data, error } = await supabase.functions.invoke('scrape-vehicle-rates');

        if (error) {
          console.error('Scraping function error:', error);
          throw error;
        }

        return data as ScrapingResult;
      },
      onSuccess: (result) => {
        if (result.success) {
          toast.success('Scraping Complete', {
            description: `Successfully scraped ${result.rates_count} rates from ${result.websites_scraped} websites`,
          });
          // Invalidate and refetch rates
          queryClient.invalidateQueries({ queryKey: ['vehicle-rates'] });
        } else {
          toast.error('Scraping Failed', {
            description: result.error || 'Unknown error occurred',
          });
        }
      },
      onError: (error) => {
        console.error('Scraping mutation error:', error);
        toast.error('Scraping Error', {
          description: 'Failed to start the scraping process',
        });
      },
    });
  };

  const getUniqueWebsites = useCallback((rates: VehicleRate[]) => {
    return [...new Set(rates.map(rate => rate.website_name))];
  }, []);

  const getUniqueCategories = useCallback((rates: VehicleRate[]) => {
    return [...new Set(rates.map(rate => rate.vehicle_category))];
  }, []);

  const getRatesByPeriod = useCallback((rates: VehicleRate[], period: number) => {
    return rates.filter(rate => rate.rental_period_days === period);
  }, []);

  const getAverageRateByCategory = useCallback((rates: VehicleRate[], category: string) => {
    const categoryRates = rates.filter(rate => rate.vehicle_category === category);
    if (categoryRates.length === 0) return 0;
    
    const total = categoryRates.reduce((sum, rate) => sum + (rate.daily_rate || 0), 0);
    return total / categoryRates.length;
  }, []);

  const getLowestRateByCategory = useCallback((rates: VehicleRate[], category: string) => {
    const categoryRates = rates.filter(rate => rate.vehicle_category === category && rate.daily_rate);
    if (categoryRates.length === 0) return null;
    
    return Math.min(...categoryRates.map(rate => rate.daily_rate));
  }, []);

  const getHighestRateByCategory = useCallback((rates: VehicleRate[], category: string) => {
    const categoryRates = rates.filter(rate => rate.vehicle_category === category && rate.daily_rate);
    if (categoryRates.length === 0) return null;
    
    return Math.max(...categoryRates.map(rate => rate.daily_rate));
  }, []);

  return {
    useRates,
    useRatesByWebsite,
    useRatesByCategory,
    useScrapeMutation,
    getUniqueWebsites,
    getUniqueCategories,
    getRatesByPeriod,
    getAverageRateByCategory,
    getLowestRateByCategory,
    getHighestRateByCategory,
  };
}