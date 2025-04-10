
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  
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
