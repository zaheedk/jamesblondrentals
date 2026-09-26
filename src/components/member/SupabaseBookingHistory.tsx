import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CarIcon, Loader2, Search } from 'lucide-react';
import { useMyBookings } from '@/hooks/use-bookings';
import { rcmApi } from '@/lib/api/rcm-api';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  pending: 'bg-portal-alert-soft text-portal-alert',
  confirmed: 'bg-portal-emerald-soft text-portal-emerald',
  active: 'bg-portal-emerald-soft text-portal-emerald',
  'checked out': 'bg-portal-emerald-soft text-portal-emerald',
  completed: 'bg-muted text-muted-foreground',
  'checked in': 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const paymentStyles: Record<string, string> = {
  pending: 'bg-portal-alert-soft text-portal-alert',
  paid: 'bg-portal-emerald-soft text-portal-emerald',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

const pill = 'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none';

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
          <div key={i} className="rounded-lg border border-border bg-card px-5 py-4">
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
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg bg-card pl-9 shadow-none"
        />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-sm text-muted-foreground">
          No bookings match your search criteria.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredBookings.map((booking) => {
            const ref = booking.reservation_reference;
            const rcmData = ref ? rcmStatuses[ref] : null;
            const displayStatus = rcmData?.status || booking.booking_status;

            return (
              <div
                key={booking.id}
                className="rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary/25"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <h3 className="truncate font-portalHeading text-sm font-semibold leading-5 text-foreground">
                        {booking.vehicle_name || 'Vehicle Rental'}
                      </h3>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {booking.reservation_reference || booking.booking_reference || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">
                      <span className="font-medium text-foreground/80">Rental:</span>{' '}
                      {formatDateTime(booking.pickup_date, booking.pickup_time)}
                      {' · '}{booking.pickup_location_name || 'Location pending'}
                      <span className="mx-1.5 text-border">→</span>
                      {formatDateTime(booking.dropoff_date, booking.dropoff_time)}
                      {' · '}{booking.dropoff_location_name || 'Location pending'}
                    </p>
                    <p className="text-[11px] leading-4 text-muted-foreground">
                      {booking.total_days} day{booking.total_days !== 1 ? 's' : ''}
                      <span className="mx-1.5 text-border">•</span>
                      <span className="font-semibold text-foreground">{formatCurrency(booking.total_amount)}</span>
                      {booking.created_at && (
                        <>
                          <span className="mx-1.5 text-border">•</span>
                          Booked {formatDate(booking.created_at)}
                        </>
                      )}
                    </p>
                    {booking.special_requirements && (
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground/80">Notes:</span> {booking.special_requirements}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:max-w-40 sm:justify-end">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SupabaseBookingHistory;
