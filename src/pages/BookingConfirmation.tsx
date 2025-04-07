
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState<'quote' | 'booking'>('booking');
  const [bookingReference, setBookingReference] = useState('REF-' + Math.floor(Math.random() * 1000000));
  
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'quote' || type === 'booking') {
      setBookingType(type);
    }
  }, [searchParams]);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">
              {bookingType === 'booking' ? 'Booking Confirmed' : 'Quote Requested'}
            </CardTitle>
            <CardDescription>
              {bookingType === 'booking' 
                ? 'Your vehicle booking has been successfully confirmed.'
                : 'Your quote request has been received. We will email it to you shortly.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookingType === 'booking' && (
              <>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Booking Reference:</span>
                  <span>{bookingReference}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
                <p className="text-center text-muted-foreground text-sm mt-6">
                  A confirmation email with all booking details has been sent to your email address.
                </p>
              </>
            )}
            
            {bookingType === 'quote' && (
              <>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Quote Reference:</span>
                  <span>{bookingReference}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Status:</span>
                  <span className="text-amber-600 font-medium">Processing</span>
                </div>
                <p className="text-center text-muted-foreground text-sm mt-6">
                  We are preparing your quote and will email it to you shortly.
                  The quote will be valid for 7 days.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={() => navigate("/")} className="w-full">
              Return to Home
            </Button>
            {bookingType === 'quote' && (
              <Button variant="outline" onClick={() => navigate("/vehicles")} className="w-full">
                Browse More Vehicles
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmation;
