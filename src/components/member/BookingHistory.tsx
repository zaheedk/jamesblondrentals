
import { useState, useEffect } from 'react';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';

interface BookingHistoryProps {
  userEmail: string;
}

export default function BookingHistory({ userEmail }: BookingHistoryProps) {
  const { rcmApi } = useRcmApi();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userEmail) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Example of how we might call the RCM API to get bookings by email
        // This will need to be adjusted based on the actual RCM API endpoint and parameters
        const response = await rcmApi.request('POST', 'getbookingsbyemail', {
          method: 'getbookingsbyemail',
          email: userEmail
        });
        
        console.log('Booking history response:', response);
        
        if (response && response.status === "OK" && response.results) {
          setBookings(Array.isArray(response.results) ? response.results : [response.results]);
        } else {
          setError('No booking history found.');
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching booking history:', err);
        setError('Failed to load booking history. Please try again later.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userEmail, rcmApi]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CalendarCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No booking history found</h3>
            <p className="text-sm text-gray-500 mt-2">
              We couldn't find any bookings associated with your email.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CalendarCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No bookings yet</h3>
            <p className="text-sm text-gray-500 mt-2">
              When you make a booking, it will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your Booking History</h2>
      
      {bookings.map((booking, index) => (
        <Card key={booking.reservationref || index} className="overflow-hidden">
          <CardHeader className="bg-muted pb-2">
            <div className="flex flex-wrap justify-between items-center">
              <CardTitle className="text-lg">
                {booking.vehicledescription || 'Rental Booking'}
              </CardTitle>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-sm font-medium">
              Booking Ref: {booking.reservationref || 'N/A'}
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Pickup</h4>
                <p className="font-medium">{formatDate(booking.pickupdate)}</p>
                <p className="text-sm">{booking.pickuplocation || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Return</h4>
                <p className="font-medium">{formatDate(booking.returndate)}</p>
                <p className="text-sm">{booking.returnlocation || 'N/A'}</p>
              </div>
            </div>
            
            {booking.totalamount && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    ${parseFloat(booking.totalamount).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
