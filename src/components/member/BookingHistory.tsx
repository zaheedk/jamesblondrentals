
import { useState, useEffect } from 'react';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

interface BookingHistoryProps {
  userEmail: string;
}

interface BookingResponse {
  status: string;
  results?: any[] | any;
  error?: string;
}

export default function BookingHistory({ userEmail }: BookingHistoryProps) {
  const { rcmApi } = useRcmApi();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userEmail) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching bookings for email:', userEmail);
        
        // Use the findbooking API method to get bookings
        const response = await rcmApi.request('POST', 'findbooking', {
          method: 'findbooking',
          email: userEmail
        }) as BookingResponse;
        
        console.log('FindBooking API response:', response);
        
        if (response && response.status === "OK") {
          if (response.results) {
            // Handle both array and single object responses
            const bookingResults = Array.isArray(response.results) ? response.results : [response.results];
            setBookings(bookingResults);
            console.log('Bookings loaded successfully:', bookingResults.length);
          } else {
            setBookings([]);
          }
        } else {
          setError(response.error || 'Failed to load booking history.');
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

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => 
    booking.reservationref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.vehicledescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.pickuplocation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-48" />
        </div>
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
            <CalendarCheck className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium">Unable to load booking history</h3>
            <p className="text-sm text-gray-700 mt-2">{error}</p>
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
            <CalendarCheck className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium">No bookings found</h3>
            <p className="text-sm text-gray-700 mt-2">
              No bookings were found for your email address. When you make a booking, it will appear here.
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
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    try {
      if (!dateString) return 'N/A';
      const dateStr = timeString ? `${dateString} ${timeString}` : dateString;
      return format(new Date(dateStr), 'PPP p');
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Your Booking History ({bookings.length})</h2>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredBookings.length === 0 && searchQuery ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium">No bookings match your search</h3>
              <p className="text-sm text-gray-700 mt-2">
                Try adjusting your search terms or clear the search to see all bookings.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        filteredBookings.map((booking, index) => (
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
                  <h4 className="text-sm font-medium text-gray-700">Pickup</h4>
                  <p className="font-medium">{formatDateTime(booking.pickupdate, booking.pickuptime)}</p>
                  <p className="text-sm">{booking.pickuplocation || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Return</h4>
                  <p className="font-medium">{formatDateTime(booking.returndate, booking.returntime)}</p>
                  <p className="text-sm">{booking.returnlocation || 'N/A'}</p>
                </div>
              </div>
              
              {(booking.customername || booking.customerphone) && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {booking.customername && (
                      <p><span className="font-medium">Name:</span> {booking.customername}</p>
                    )}
                    {booking.customerphone && (
                      <p><span className="font-medium">Phone:</span> {booking.customerphone}</p>
                    )}
                  </div>
                </div>
              )}
              
              {booking.totalamount && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount</span>
                    <span className="font-bold text-lg">
                      ${parseFloat(booking.totalamount).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
