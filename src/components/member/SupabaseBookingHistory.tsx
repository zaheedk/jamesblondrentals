import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ClockIcon, MapPinIcon, CarIcon, CreditCardIcon, UserIcon } from 'lucide-react';
import { useBookings, type Booking } from '@/hooks/use-bookings';
import { toast } from 'sonner';

const SupabaseBookingHistory = () => {
  const { data: bookings, isLoading, error } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');

  if (error) {
    console.error('Error fetching bookings:', error);
    toast.error('Failed to load booking history');
  }

  const filteredBookings = bookings?.filter((booking) =>
    booking.booking_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.pickup_location_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      confirmed: { variant: 'default' as const, label: 'Confirmed' },
      active: { variant: 'default' as const, label: 'Active' },
      completed: { variant: 'outline' as const, label: 'Completed' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { variant: 'secondary' as const, label: status };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      paid: { variant: 'default' as const, label: 'Paid' },
      failed: { variant: 'destructive' as const, label: 'Failed' },
      refunded: { variant: 'outline' as const, label: 'Refunded' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { variant: 'secondary' as const, label: status };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = formatDate(dateString);
    return timeString ? `${date} at ${timeString}` : date;
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toFixed(2)}` : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load booking history. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No bookings found. Make your first booking to see it here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Bookings ({filteredBookings.length})</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No bookings match your search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {booking.vehicle_name || 'Vehicle Rental'}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(booking.booking_status)}
                    {getPaymentStatusBadge(booking.payment_status)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Booking Reference: {booking.booking_reference || 'N/A'}
                  {booking.reservation_reference && (
                    <span className="ml-3">RCM Ref: {booking.reservation_reference}</span>
                  )}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Dates & Times */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Pickup:</span>
                      <span>{formatDateTime(booking.pickup_date, booking.pickup_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Dropoff:</span>
                      <span>{formatDateTime(booking.dropoff_date, booking.dropoff_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Duration:</span>
                      <span>{booking.total_days} day{booking.total_days !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Pickup:</span>
                      <span>{booking.pickup_location_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Dropoff:</span>
                      <span>{booking.dropoff_location_name || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Vehicle & Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Vehicle:</span>
                      <span>{booking.vehicle_category || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Total:</span>
                      <span className="font-semibold">{formatCurrency(booking.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {(booking.customer_first_name || booking.customer_email) && (
                  <div className="border-t pt-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Customer:</span>
                      <span>
                        {booking.customer_first_name && booking.customer_last_name 
                          ? `${booking.customer_first_name} ${booking.customer_last_name}`
                          : booking.customer_email
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Special Requirements */}
                {booking.special_requirements && (
                  <div className="border-t pt-3">
                    <p className="text-sm">
                      <span className="font-medium">Special Requirements:</span> {booking.special_requirements}
                    </p>
                  </div>
                )}

                {/* Booking Date */}
                <div className="border-t pt-3 text-xs text-muted-foreground">
                  Booked on {formatDate(booking.created_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupabaseBookingHistory;