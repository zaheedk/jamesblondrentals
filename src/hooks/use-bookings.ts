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

  const updateData: Database['public']['Tables']['bookings']['Update'] = {
    payment_status: paymentStatus,
    booking_status: bookingStatus,
    updated_at: new Date().toISOString(),
  };

  if (transactionId) {
    updateData.payment_intent_id = transactionId;
  }

  if (references?.bookingReference) {
    updateData.booking_reference = references.bookingReference;
  }

  if (references?.reservationReference) {
    updateData.reservation_reference = references.reservationReference;
  }

  const referenceFilter = uniqueReferences
    .flatMap((reference) => [
      `booking_reference.eq.${reference}`,
      `reservation_reference.eq.${reference}`,
    ])
    .join(',');

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .or(referenceFilter);

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