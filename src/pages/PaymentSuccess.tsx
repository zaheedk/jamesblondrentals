
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  useEffect(() => {
    // Get booking data from session
    const bookingData = getBookingData();
    
    if (!bookingData) {
      // If no booking data, redirect to home
      toast.error("No booking information found");
      navigate("/");
      return;
    }
    
    setBookingDetails(bookingData);
    
    // Clear booking data as we're done with it
    clearBookingData();
  }, [navigate]);
  
  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your booking. Your reservation is confirmed.
        </p>
        <p className="text-gray-600 mb-8">
          A confirmation email has been sent to your email address.
        </p>
        <div className="text-left mb-8 border-t border-b py-4">
          <div className="flex justify-between py-2">
            <span className="font-medium">Vehicle:</span> 
            <span>{bookingDetails.vehicleName}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Pickup Date:</span> 
            <span>{bookingDetails.pickupDate} at {bookingDetails.pickupTime}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Return Date:</span> 
            <span>{bookingDetails.dropoffDate} at {bookingDetails.dropoffTime}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Total Amount:</span> 
            <span>${bookingDetails.basePrice?.toFixed(2)}</span>
          </div>
        </div>
        <Button 
          onClick={() => navigate("/")}
          className="w-full"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
