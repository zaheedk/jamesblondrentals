import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type Booking = Database['public']['Tables']['bookings']['Row'];

export function useBookings() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'zaheedk@gmail.com';

  return useQuery({
    queryKey: ['bookings', user?.id, isAdmin],
    queryFn: async (): Promise<Booking[]> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      let query = supabase.from('bookings').select('*');
      
      // If admin, get all bookings; otherwise only user's own bookings
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

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