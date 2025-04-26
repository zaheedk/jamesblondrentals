
import React from 'react';
import { CheckCircle2, FrownIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface PaymentStatusHeaderProps {
  status: 'success' | 'failed' | 'pending';
  errorMessage?: string;
  transactionId: string;
  reservationRef?: string;
}

const PaymentStatusHeader = ({ status, errorMessage, transactionId, reservationRef }: PaymentStatusHeaderProps) => {
  if (status === 'success') {
    return (
      <div className="text-center mb-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600">
          Thank you for your booking. Your reservation is confirmed.
        </p>
        {reservationRef && (
          <p className="mt-2 text-blue-500 font-medium">
            Reservation Reference: {reservationRef}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      <div className="bg-red-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <FrownIcon className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <p className="text-gray-600 mb-4">
        Transaction ID: {transactionId || "N/A"}
      </p>
    </div>
  );
};

export default PaymentStatusHeader;
