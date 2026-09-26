import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ClockIcon, MapPinIcon, CarIcon, Loader2, Search } from 'lucide-react';
import { useMyBookings } from '@/hooks/use-bookings';
import { rcmApi } from '@/lib/api/rcm-api';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100/70 text-amber-800',
  confirmed: 'bg-emerald-100/70 text-emerald-800',
  active: 'bg-emerald-100/70 text-emerald-800',
  'checked out': 'bg-emerald-100/70 text-emerald-800',
  completed: 'bg-muted text-muted-foreground',
  'checked in': 'bg-muted text-muted-foreground',
  cancelled: 'bg-red-100/70 text-red-700',
};

const paymentStyles: Record<string, string> = {
  pending: 'bg-amber-100/70 text-amber-800',
  paid: 'bg-emerald-100/70 text-emerald-800',
  failed: 'bg-red-100/70 text-red-700',
  refunded: 'bg-muted text-muted-foreground',
};

const pill = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold';

const SupabaseBookingHistory = () => {
  const { data: bookings, isLoading, error } = useMyBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [rcmStatuses, setRcmStatuses] = useState<Record<string, { status: string; loading: boolean }>>({});

  // Fetch RCM status for bookings that have a reservation_reference
  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    // Only check live status for the 10 most recent bookings — one API call per
    // booking makes this the slowest part of the page.
    const bookingsWithRef = bookings.filter(b => b.reservation_reference).slice(0, 10);
    if (bookingsWithRef.length === 0) return;

    bookingsWithRef.forEach(async (booking) => {
      const ref = booking.reservation_reference;
      if (!ref) return;
      // Skip if already fetched
      if (rcmStatuses[ref] && !rcmStatuses[ref].loading) return;

      setRcmStatuses(prev => ({ ...prev, [ref]: { status: '', loading: true } }));

      try {
        const response = await rcmApi.getBookingInfoByReference(ref);
        const bookingInfo = response?.results?.bookinginfo?.[0] as Record<string, any> | undefined;
        const rcmStatus = bookingInfo?.status || bookingInfo?.bookingstatus || bookingInfo?.reservationstatus || '';
        setRcmStatuses(prev => ({ ...prev, [ref]: { status: rcmStatus, loading: false } }));
      } catch (err) {
        console.error('Failed to fetch RCM status for', ref, err);
        setRcmStatuses(prev => ({ ...prev, [ref]: { status: '', loading: false } }));
      }
    });
  }, [bookings]);

  if (error) {
    console.error('Error fetching bookings:', error);
    toast.error('Failed to load booking history');
  }

  const filteredBookings = bookings?.filter((booking) =>
    booking.reservation_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.pickup_location_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusBadge = (status?: string) => {
    if (!status) return <span className={`${pill} bg-muted text-muted-foreground`}>Unknown</span>;
    const lower = status.toLowerCase();
    const labelMap: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      active: 'Active',
      completed: 'Completed',
      cancelled: 'Cancelled',
      'checked out': 'Checked Out',
      'checked in': 'Checked In',
    };
    const style = statusStyles[lower] || 'bg-muted text-muted-foreground';
    return <span className={`${pill} ${style}`}>{labelMap[lower] || status}</span>;
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return null;
    const labelMap: Record<string, string> = {
      pending: 'Payment Pending',
      paid: 'Paid',
      failed: 'Payment Failed',
      refunded: 'Refunded',
    };
    const style = paymentStyles[status] || 'bg-muted text-muted-foreground';
    return <span className={`${pill} ${style}`}>{labelMap[status] || status}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = formatDate(dateString);
    return timeString ? `${date} at ${timeString}` : date;
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toFixed(2)}` : '—';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-muted-foreground">
        Failed to load booking history. Please try again later.
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
        <CarIcon className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">
          No bookings found. Make your first booking to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full pl-9 bg-card"
        />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-sm text-muted-foreground">
          No bookings match your search criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const ref = booking.reservation_reference;
            const rcmData = ref ? rcmStatuses[ref] : null;
            const displayStatus = rcmData?.status || booking.booking_status;

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Header row */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-portalHeading text-[15px] font-bold leading-6 text-foreground">
                      {booking.vehicle_name || 'Vehicle Rental'}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      Ref. {booking.reservation_reference || booking.booking_reference || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:justify-end shrink-0">
                    {rcmData?.loading ? (
                      <span className={`${pill} bg-muted text-muted-foreground`}>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Checking...
                      </span>
                    ) : (
                      getStatusBadge(displayStatus)
                    )}
                    {getPaymentStatusBadge(booking.payment_status)}
                  </div>
                </div>

                {/* Detail row */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/60 pt-4 sm:grid-cols-4">
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">Pickup</p>
                      <p className="text-[13px] font-medium leading-5 text-foreground">{formatDateTime(booking.pickup_date, booking.pickup_time)}</p>
                      <p className="truncate text-xs text-muted-foreground">{booking.pickup_location_name || 'Location pending'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">Drop-off</p>
                      <p className="text-[13px] font-medium leading-5 text-foreground">{formatDateTime(booking.dropoff_date, booking.dropoff_time)}</p>
                      <p className="truncate text-xs text-muted-foreground">{booking.dropoff_location_name || 'Location pending'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ClockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">Duration</p>
                      <p className="text-[13px] font-medium leading-5 text-foreground">{booking.total_days} day{booking.total_days !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">Total</p>
                      <p className="font-portalHeading text-[15px] font-bold leading-5 text-foreground">{formatCurrency(booking.total_amount)}</p>
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                {(booking.special_requirements || booking.created_at) && (
                  <div className="mt-3 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                    {booking.special_requirements && (
                      <p>
                        <span className="font-medium">Special Requirements:</span> {booking.special_requirements}
                      </p>
                    )}
                    {booking.created_at && <p>Booked on {formatDate(booking.created_at)}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SupabaseBookingHistory;
