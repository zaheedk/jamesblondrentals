import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type Booking = Database['public']['Tables']['bookings']['Row'];

export function useBookings() {
  const { user } = useAuth();
  // Admin status is now determined by RLS policy using is_admin_user() function
  // which checks the user_roles table instead of hardcoded email

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async (): Promise<Booking[]> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // RLS policy handles admin vs regular user access automatically
      // Admins see all bookings, users see only their own
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useCreateBooking() {
  return {
    mutate: async (bookingData: Database['public']['Tables']['bookings']['Insert']) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    }
  };
}