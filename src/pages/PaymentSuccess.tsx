
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
  
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
    
    // Parse URL parameters to determine payment status
    const queryParams = new URLSearchParams(location.search);
    const result = queryParams.get("result");
    
    if (result === "failed" || queryParams.get("error")) {
      setPaymentStatus("failed");
      toast.error("Payment Failed", {
        description: queryParams.get("message") || "Your payment was not successful. Please try again."
      });
    } else if (result === "cancelled") {
      setPaymentStatus("failed");
      toast.error("Payment Cancelled", {
        description: "You cancelled the payment process."
      });
    } else {
      // Assume success if no error parameters
      setPaymentStatus("success");
      // Only clear booking data on successful payment
      clearBookingData();
      toast.success("Payment Successful", {
        description: "Your booking has been confirmed."
      });
    }
  }, [navigate, location]);
  
  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {paymentStatus === "success" ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your booking. Your reservation is confirmed.
            </p>
            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to your email address.
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Not Completed</h1>
            <p className="text-gray-600 mb-6">
              Your payment was not completed successfully.
            </p>
            <p className="text-gray-600 mb-8">
              Please try again or contact customer support for assistance.
            </p>
            <Button 
              onClick={() => navigate("/payment-options")}
              className="w-full mb-4"
              variant="outline"
            >
              Try Payment Again
            </Button>
          </>
        )}
        
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
            <span className="font-medium">Payment Amount:</span> 
            <span>${bookingDetails.paymentAmount?.toFixed(2) || bookingDetails.basePrice?.toFixed(2)}</span>
          </div>
          {bookingDetails.paymentType === "deposit" && (
            <div className="flex justify-between py-2">
              <span className="font-medium">Balance Due:</span> 
              <span>${(bookingDetails.basePrice - bookingDetails.paymentAmount).toFixed(2)}</span>
            </div>
          )}
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
