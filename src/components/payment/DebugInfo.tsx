
import React from 'react';

interface DebugInfoProps {
  apiResponse: any;
  bookingData?: any;
  windcaveResponseDetails?: {
    amount?: number;
    transactionDate?: string;
    status?: string;
    transactionId?: string;
    reservationRef?: string;
    cardDetails?: {
      cardholder?: string;
      payType?: string;
      cardNumber?: string;
    };
  };
}

const DebugInfo = ({ apiResponse, bookingData, windcaveResponseDetails = {} }: DebugInfoProps) => {
  const hasData = apiResponse || bookingData || windcaveResponseDetails.status;
  
  if (!hasData) return null;

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-bold mb-2">Debug Information</h2>
      
      {bookingData && (
        <div className="bg-gray-100 rounded-lg p-4 mb-4 overflow-auto max-h-60">
          <h3 className="text-lg font-semibold mb-2">Booking Session Data</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(bookingData, null, 2)}
          </pre>
        </div>
      )}
      
      {apiResponse && (
        <div className="bg-gray-100 rounded-lg p-4 mb-4 overflow-auto max-h-60">
          <h3 className="text-lg font-semibold mb-2">API Response Data</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      {windcaveResponseDetails.status && (
        <div className="bg-gray-100 rounded-lg p-4 mt-4">
          <h3 className="text-xl font-semibold mb-2">Payment Transaction Details</h3>
          <div className="space-y-2">
            <p><strong>Status:</strong> {windcaveResponseDetails.status}</p>
            <p><strong>Amount:</strong> ${windcaveResponseDetails.amount?.toFixed(2)}</p>
            <p><strong>Transaction ID:</strong> {windcaveResponseDetails.transactionId}</p>
            <p><strong>Transaction Date:</strong> {windcaveResponseDetails.transactionDate}</p>
            {windcaveResponseDetails.reservationRef && (
              <p><strong>Reservation Reference:</strong> {windcaveResponseDetails.reservationRef}</p>
            )}
            {windcaveResponseDetails.cardDetails && (
              <div>
                <h4 className="font-medium mt-2">Card Details</h4>
                <p><strong>Cardholder:</strong> {windcaveResponseDetails.cardDetails.cardholder}</p>
                <p><strong>Card Number:</strong> {windcaveResponseDetails.cardDetails.cardNumber}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;
