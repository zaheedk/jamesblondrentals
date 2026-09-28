import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, CalendarRange, CarIcon, Clock, Loader2, MapPin, Search, Truck } from 'lucide-react';
import { useMyBookings } from '@/hooks/use-bookings';
import { rcmApi } from '@/lib/api/rcm-api';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  pending: 'bg-primary/10 text-primary',
  confirmed: 'bg-portal-emerald-soft text-portal-emerald',
  active: 'bg-portal-emerald-soft text-portal-emerald',
  'checked out': 'bg-portal-emerald-soft text-portal-emerald',
  completed: 'bg-muted text-muted-foreground',
  'checked in': 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  pending: 'Reservation Request',
  confirmed: 'Confirmed',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'checked out': 'Checked Out',
  'checked in': 'Checked In',
};

const paymentStyles: Record<string, string> = {
  pending: 'bg-portal-alert-soft text-portal-alert',
  paid: 'bg-portal-emerald-soft text-portal-emerald',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

const paymentLabels: Record<string, string> = {
  pending: 'Payment Pending',
  paid: 'Paid',
  failed: 'Payment Failed',
  refunded: 'Refunded',
};

const pill = 'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold leading-none';

const RCM_IMAGE_BASE = 'https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493';

function getRcmVehicleImage(vehicleImage?: string, documentPath?: string): string | null {
  const image = vehicleImage?.trim();
  if (!image) return null;

  if (/^https?:\/\//i.test(image)) return image;

  const base = documentPath?.trim() || RCM_IMAGE_BASE;
  return `${base.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
}

const VehiclePhoto = ({ name, imageUrl }: { name?: string | null; imageUrl?: string | null }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageUrl || imageFailed) {
    return (
      <div className="flex h-28 w-44 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Truck className="h-8 w-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name || 'Vehicle'}
      loading="lazy"
      className="h-28 w-44 shrink-0 rounded-lg bg-muted object-contain"
      onError={() => setImageFailed(true)}
    />
  );
};

type RcmBookingDetails = {
  status: string;
  imageUrl: string | null;
  reservationNo: string;
  loading: boolean;
  totalCost?: number;
  paid?: number;
  balanceDue?: number;
  rentalSubtotal?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  fees?: { name: string; amount: number; insurance: boolean; bond: boolean }[];
};

const SupabaseBookingHistory = () => {
  const { data: bookings, isLoading, error } = useMyBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rcmDetails, setRcmDetails] = useState<Record<string, RcmBookingDetails>>({});

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
      if (rcmDetails[ref] && !rcmDetails[ref].loading) return;

      setRcmDetails(prev => ({
        ...prev,
        [ref]: { status: '', imageUrl: null, reservationNo: '', loading: true },
      }));

      try {
        const response = await rcmApi.getBookingInfoByReference(ref);
        const bookingInfoResult = response?.results?.bookinginfo;
        const bookingInfo = (Array.isArray(bookingInfoResult) ? bookingInfoResult[0] : bookingInfoResult) as Record<string, any> | undefined;
        const rcmStatus = bookingInfo?.status || bookingInfo?.bookingstatus || bookingInfo?.reservationstatus || '';
        const imageUrl = getRcmVehicleImage(bookingInfo?.vehicleimage, bookingInfo?.urlpathfordocuments);
        const reservationNo = String(bookingInfo?.reservationno || '');
        const results = response?.results as Record<string, any> | undefined;
        const payments = Array.isArray(results?.paymentinfo) ? results!.paymentinfo : [];
        const rates = Array.isArray(results?.rateinfo) ? results!.rateinfo : [];
        const extras = Array.isArray(results?.extrafees) ? results!.extrafees : [];
        const num = (v: any) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? undefined : Number(v));
        setRcmDetails(prev => ({
          ...prev,
          [ref]: {
            status: rcmStatus, imageUrl, reservationNo, loading: false,
            totalCost: num(bookingInfo?.totalcost),
            balanceDue: num(bookingInfo?.balancedue),
            paid: payments.reduce((sum: number, p: any) => sum + (Number(p?.paidamount) || 0), 0),
            rentalSubtotal: rates.reduce((sum: number, r: any) => sum + (Number(r?.ratesubtotal) || 0), 0),
            pickupLocation: bookingInfo?.pickuplocationname || undefined,
            dropoffLocation: bookingInfo?.dropofflocationname || undefined,
            fees: extras.map((f: any) => ({
              name: String(f?.name || 'Extra'),
              amount: Number(f?.totalfeeamount) || 0,
              insurance: !!f?.isinsurancefee,
              bond: !!f?.isbondfee,
            })),
          },
        }));
      } catch (err) {
        console.error('Failed to fetch RCM booking details for', ref, err);
        setRcmDetails(prev => ({
          ...prev,
          [ref]: { status: '', imageUrl: null, reservationNo: '', loading: false },
        }));
      }
    });
  }, [bookings]);

  if (error) {
    console.error('Error fetching bookings:', error);
    toast.error('Failed to load booking history');
  }

  const matchesStatus = (booking: any) => {
    if (statusFilter === 'all') return true;
    const ref = booking.reservation_reference;
    const live = ref ? rcmDetails[ref]?.status : '';
    const status = (live || booking.booking_status || '').toLowerCase();
    return status === statusFilter || status.includes(statusFilter);
  };

  const matchesDateRange = (booking: any) => {
    if (dateRange === 'all') return true;
    const pickup = booking.pickup_date ? new Date(booking.pickup_date) : null;
    if (!pickup || isNaN(pickup.getTime())) return dateRange === 'past';
    const now = new Date();
    if (dateRange === 'upcoming') return pickup >= new Date(now.toDateString());
    if (dateRange === 'past') return pickup < new Date(now.toDateString());
    if (dateRange === 'thisyear') return pickup.getFullYear() === now.getFullYear();
    return true;
  };

  const filteredBookings = bookings?.filter((booking) =>
    ((booking.reservation_reference ? rcmDetails[booking.reservation_reference]?.reservationNo : '')
        ?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booking_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pickup_location_name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    matchesStatus(booking) &&
    matchesDateRange(booking)
  ) || [];

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const lower = status.toLowerCase();
    const style = statusStyles[lower] || 'bg-muted text-muted-foreground';
    return <span className={`${pill} ${style}`}>{statusLabels[lower] || status}</span>;
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return null;
    const style = paymentStyles[status] || 'bg-muted text-muted-foreground';
    return <span className={`${pill} ${style}`}>{paymentLabels[status] || status}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    // Accept "10:30:00" or "10:30" — trim seconds for a cleaner look
    const parts = timeString.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = formatDate(dateString);
    const time = formatTime(timeString);
    return time ? `${date} at ${time}` : date;
  };

  const formatCurrency = (amount?: number) => {
    return amount != null ? `$${amount.toFixed(2)}` : '—';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex gap-4">
              <Skeleton className="h-28 w-44 rounded-lg" />
              <div className="flex-1 space-y-3 py-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
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
      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings by reference, vehicle, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-card pl-9 shadow-none"
          />
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full rounded-lg bg-card sm:w-[150px]">
              <CalendarRange className="h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="thisyear">This year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full rounded-lg bg-card sm:w-[150px]">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="pending">Reservation Request</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No bookings match your search or filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const ref = booking.reservation_reference;
            const rcmData = ref ? rcmDetails[ref] : null;
            const displayReference = rcmData?.reservationNo || booking.booking_reference || 'N/A';
            const displayStatus = rcmData?.status || booking.booking_status;
            const isOpen = expandedId === booking.id;

            return (
              <div
                key={booking.id}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/25"
              >
                <div className="flex flex-col gap-4 md:flex-row md:gap-5">
                  <VehiclePhoto name={booking.vehicle_name} imageUrl={rcmData?.imageUrl} />

                  <div className="min-w-0 flex-1">
                    {/* Title, ref, badges */}
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <div className="min-w-0">
                        <h3 className="font-portalHeading text-base font-bold leading-6 text-foreground md:text-lg">
                          {booking.vehicle_name || 'Vehicle Rental'}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Ref. {displayReference}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {rcmData?.loading ? (
                          <span className={`${pill} bg-muted text-muted-foreground`}>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Checking...
                          </span>
                        ) : (
                          getStatusBadge(displayStatus)
                        )}
                        {rcmData && !rcmData.loading && rcmData.totalCost !== undefined
                          ? getPaymentStatusBadge(
                              (rcmData.paid || 0) <= 0 ? 'unpaid'
                                : (rcmData.balanceDue ?? rcmData.totalCost - (rcmData.paid || 0)) > 0.009 ? 'partial' : 'paid')
                          : getPaymentStatusBadge(booking.payment_status)}
                      </div>
                    </div>

                    {/* Detail columns */}
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" /> Pickup
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDateTime(booking.pickup_date, booking.pickup_time)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {rcmData?.pickupLocation || booking.pickup_location_name || 'Location pending'}
                        </p>
                      </div>
                      <div className="md:border-l md:border-border md:pl-4">
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> Drop-off
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDateTime(booking.dropoff_date, booking.dropoff_time)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {rcmData?.dropoffLocation || booking.dropoff_location_name || 'Location pending'}
                        </p>
                      </div>
                      <div className="md:border-l md:border-border md:pl-4">
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> Duration
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {booking.total_days} day{booking.total_days !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="md:border-l md:border-border md:pl-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Total
                        </p>
                        <p className="mt-1 font-portalHeading text-xl font-bold text-foreground">
                          {formatCurrency(rcmData?.totalCost ?? booking.total_amount)}
                        </p>
                        {rcmData?.totalCost !== undefined && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Paid {formatCurrency(rcmData.paid || 0)} · Due {formatCurrency(rcmData.balanceDue ?? 0)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer row */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Booked on {booking.created_at ? formatDate(booking.created_at) : '—'}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-full border-primary/30 px-4 text-primary hover:bg-primary/5 hover:text-primary"
                        onClick={() => setExpandedId(isOpen ? null : booking.id)}
                      >
                        {isOpen ? 'Hide details' : 'View details'}
                      </Button>
                    </div>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="mt-3 space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Booking reference:</span>{' '}
                            {displayReference}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Payment status:</span>{' '}
                            {rcmData?.totalCost !== undefined
                              ? (rcmData.paid || 0) <= 0 ? 'Unpaid' : (rcmData.balanceDue || 0) > 0.009 ? 'Part paid' : 'Paid in full'
                              : booking.payment_status ? paymentLabels[booking.payment_status] || booking.payment_status : '—'}
                          </p>
                        </div>
                        {rcmData?.totalCost !== undefined && (
                          <div className="mt-2 divide-y divide-border rounded-md border border-border bg-card">
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-muted-foreground">Vehicle hire</span>
                              <span className="text-foreground">{formatCurrency(rcmData.rentalSubtotal || 0)}</span>
                            </div>
                            {(rcmData.fees || []).map((f, i) => (
                              <div key={i} className="flex justify-between gap-4 px-3 py-2">
                                <span className="text-muted-foreground">
                                  {f.insurance && <span className="mr-1.5 font-medium text-foreground">Insurance:</span>}
                                  {f.name}
                                  {f.bond && <span className="ml-1 text-xs">(refundable)</span>}
                                </span>
                                <span className="shrink-0 text-foreground">{f.amount > 0 ? formatCurrency(f.amount) : 'Included'}</span>
                              </div>
                            ))}
                            <div className="flex justify-between px-3 py-2 font-medium">
                              <span className="text-foreground">Total</span>
                              <span className="text-foreground">{formatCurrency(rcmData.totalCost)}</span>
                            </div>
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-muted-foreground">Paid</span>
                              <span className="text-portal-emerald">{formatCurrency(rcmData.paid || 0)}</span>
                            </div>
                            <div className="flex justify-between px-3 py-2 font-semibold">
                              <span className="text-foreground">Balance due</span>
                              <span className="text-foreground">{formatCurrency(rcmData.balanceDue ?? 0)}</span>
                            </div>
                          </div>
                        )}
                        <div className="hidden">
                        </div>
                        {booking.special_requirements && (
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Notes:</span>{' '}
                            {booking.special_requirements}
                          </p>
                        )}
                      </div>
                    )}
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
