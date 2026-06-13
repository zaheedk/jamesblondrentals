import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type Booking = Database['public']['Tables']['bookings']['Row'];

export function useBookings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async (): Promise<Booking[]> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Fetch all bookings using pagination to bypass the 1000 row limit
      const allBookings: Booking[] = [];
      const pageSize = 1000;
      let from = 0;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('pickup_date', { ascending: false })
          .range(from, from + pageSize - 1);

        if (error) {
          console.error('Error fetching bookings:', error);
          throw error;
        }

        if (data) {
          allBookings.push(...data);
        }

        hasMore = data?.length === pageSize;
        from += pageSize;
      }

      return allBookings;
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

// Update booking payment status by booking reference (works for guest users too)
export async function updateBookingPaymentStatus(
  bookingReference: string,
  paymentStatus: 'paid' | 'failed' | 'pending',
  bookingStatus: 'confirmed' | 'pending' | 'cancelled',
  transactionId?: string,
  references?: {
    bookingReference?: string | null;
    reservationReference?: string | null;
  }
) {
  if (!bookingReference) {
    console.error('No booking reference provided for payment status update');
    return null;
  }

  const referenceCandidates = [
    bookingReference,
    references?.bookingReference,
    references?.reservationReference,
  ]
    .map((reference) => reference?.trim())
    .filter((reference): reference is string => Boolean(reference));

  const uniqueReferences = [...new Set(referenceCandidates)];

  console.log('Updating booking payment status:', {
    bookingReference,
    paymentStatus,
    bookingStatus,
    transactionId,
    references: uniqueReferences,
  });

  const { error } = await supabase.rpc(
    'update_booking_payment_status_by_reference',
    {
      _references: uniqueReferences,
      _payment_status: paymentStatus,
      _booking_status: bookingStatus,
      _payment_intent_id: transactionId ?? null,
      _booking_reference: references?.bookingReference ?? null,
      _reservation_reference: references?.reservationReference ?? null,
    }
  );

  if (error) {
    console.error('Error updating booking payment status:', error);
    return null;
  }

  console.log('Booking payment status update request completed successfully');
  return {
    updated: true,
    references: uniqueReferences,
  };
}