import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export type Booking = Database['public']['Tables']['bookings']['Row'];

// Columns needed by the member booking history UI. Selecting the full row of a
// very wide table for 13k+ rows is what caused statement timeouts.
const MEMBER_BOOKING_COLUMNS = [
  'id',
  'user_id',
  'vehicle_name',
  'pickup_date',
  'dropoff_date',
  'pickup_time',
  'dropoff_time',
  'total_days',
  'pickup_location_name',
  'dropoff_location_name',
  'customer_email',
  'total_amount',
  'payment_status',
  'booking_status',
  'booking_reference',
  'reservation_reference',
  'special_requirements',
  'created_at',
].join(',');

export type MemberBooking = Pick<
  Booking,
  'id' | 'user_id' | 'vehicle_name' | 'pickup_date' | 'dropoff_date' | 'pickup_time' |
  'dropoff_time' | 'total_days' | 'pickup_location_name' | 'dropoff_location_name' |
  'customer_email' | 'total_amount' | 'payment_status' | 'booking_status' |
  'booking_reference' | 'reservation_reference' | 'special_requirements' | 'created_at'
>;

/** Bookings belonging to the signed-in user only — fast, indexed, no full-table scan. */
export function useMyBookings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-bookings', user?.id, user?.email],
    queryFn: async (): Promise<MemberBooking[]> => {
      if (!user?.id) throw new Error('User not authenticated');

      const filters = [`user_id.eq.${user.id}`];
      if (user.email) filters.push(`customer_email.eq.${user.email}`);

      const { data, error } = await supabase
        .from('bookings')
        .select(MEMBER_BOOKING_COLUMNS)
        .or(filters.join(','))
        .order('pickup_date', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Error fetching my bookings:', error);
        throw error;
      }

      return (data ?? []) as unknown as MemberBooking[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}

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
const ADMIN_LIST_COLUMNS = 'id, booking_reference, reservation_reference, customer_first_name, customer_last_name, customer_email, vehicle_name, vehicle_rego, vehicle_category, pickup_date, pickup_time, dropoff_date, dropoff_time, pickup_location_name, total_amount, booking_status, payment_status, created_at, hirer_signature';
const SEARCH_COLUMNS = ['booking_reference', 'reservation_reference', 'customer_first_name', 'customer_last_name', 'customer_email', 'vehicle_name', 'vehicle_rego', 'pickup_location_name', 'car_id', 'brand', 'agency', 'agent_name', 'rcm_ref_no', 'company_name', 'rcm_customer_id'];
const sel = (s: string): string => s;

export type AdminBookingRow = Pick<Booking, 'id' | 'booking_reference' | 'reservation_reference' | 'customer_first_name' | 'customer_last_name' | 'customer_email' | 'vehicle_name' | 'vehicle_rego' | 'vehicle_category' | 'pickup_date' | 'pickup_time' | 'dropoff_date' | 'dropoff_time' | 'pickup_location_name' | 'total_amount' | 'booking_status' | 'payment_status' | 'created_at' | 'hirer_signature'>;

/** Loads one page of admin bookings (kind "bookings") or quotes (pending + unpaid) from the server. */
export function useAdminBookingsPage(kind: 'bookings' | 'quotes', page: number, pageSize: number, search: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin-bookings-page', kind, page, pageSize, search],
    enabled: !!user?.id,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      let q = supabase.from('bookings').select(sel(ADMIN_LIST_COLUMNS), { count: 'exact' });
      if (kind === 'quotes') {
        q = q.eq('booking_status', 'pending').eq('payment_status', 'pending');
      } else {
        q = q.or('booking_status.neq.pending,payment_status.neq.pending,booking_status.is.null,payment_status.is.null');
      }
      const term = search.trim().replace(/[,()*%\\]/g, ' ').trim();
      if (term) q = q.or(SEARCH_COLUMNS.map((c) => `${c}.ilike.*${term}*`).join(','));
      const from = (page - 1) * pageSize;
      const { data, error, count } = await q
        .order('pickup_date', { ascending: false })
        .range(from, from + pageSize - 1)
        .returns<AdminBookingRow[]>();
      if (error) throw error;
      return { rows: data || [], count: count || 0 };
    },
  });
}

/** Lightweight rows for the booking journey funnel (only the columns it needs). */
export function useBookingFunnelRows(periodDays: number | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin-booking-funnel', periodDays],
    enabled: !!user?.id,
    queryFn: async () => {
      const rows: Pick<Booking, 'created_at' | 'booking_status' | 'payment_status' | 'total_amount'>[] = [];
      const cutoff = periodDays ? new Date(Date.now() - periodDays * 86400000).toISOString() : null;
      for (let from = 0; ; from += 1000) {
        let q = supabase.from('bookings').select('created_at, booking_status, payment_status, total_amount');
        if (cutoff) q = q.gte('created_at', cutoff);
        const { data, error } = await q.order('created_at', { ascending: false }).range(from, from + 999);
        if (error) throw error;
        rows.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      return rows;
    },
  });
}
