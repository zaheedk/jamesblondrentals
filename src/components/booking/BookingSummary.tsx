
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface BookingSummaryProps {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  vehicleName: string;
  basePrice: number;
  selectedInsurance: { id: string | number; name: string; price: number } | null;
  selectedExtras: { id: string | number; name: string; quantity: number; totalPrice: number }[];
  kmChargePrice: number;
  currencySymbol: string;
}

const BookingSummary = ({
  pickupLocation,
  dropoffLocation,
  pickupDate,
  dropoffDate,
  vehicleName,
  basePrice,
  selectedInsurance,
  selectedExtras,
  kmChargePrice,
  currencySymbol
}: BookingSummaryProps) => {
  const totalPrice = 
    basePrice + 
    (selectedInsurance?.price || 0) + 
    selectedExtras.reduce((sum, extra) => sum + extra.totalPrice, 0) + 
    kmChargePrice;

  // Add validation for dates before formatting
  const formatSafeDate = (date: Date | string | null | undefined): string => {
    if (!date) return "Date not available";
    
    try {
      // If it's a string, convert to Date first
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if date is valid before formatting
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", date);
        return "Invalid date";
      }
      
      return format(dateObj, "PPP p");
    } catch (err) {
      console.error("Error formatting date:", err, date);
      return "Date format error";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Vehicle</h4>
          <p className="text-sm">{vehicleName}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Pickup</h4>
          <p className="text-sm">{pickupLocation}</p>
          <p className="text-sm">{formatSafeDate(pickupDate)}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Drop-off</h4>
          <p className="text-sm">{dropoffLocation}</p>
          <p className="text-sm">{formatSafeDate(dropoffDate)}</p>
        </div>
        
        <div className="border-t border-gray-200 my-4"></div>
        
        <div className="flex justify-between items-center">
          <span>Base price</span>
          <span>{currencySymbol}{basePrice.toFixed(2)}</span>
        </div>
        
        {selectedInsurance && (
          <div className="flex justify-between items-center">
            <span>Insurance: {selectedInsurance.name}</span>
            <span>{currencySymbol}{selectedInsurance.price.toFixed(2)}</span>
          </div>
        )}
        
        {kmChargePrice > 0 && (
          <div className="flex justify-between items-center">
            <span>Mileage charge</span>
            <span>{currencySymbol}{kmChargePrice.toFixed(2)}</span>
          </div>
        )}
        
        {selectedExtras.map((extra) => (
          <div key={extra.id} className="flex justify-between items-center">
            <span>
              {extra.name} {extra.quantity > 1 ? `× ${extra.quantity}` : ''}
            </span>
            <span>{currencySymbol}{extra.totalPrice.toFixed(2)}</span>
          </div>
        ))}
        
        <div className="border-t border-gray-200 my-4"></div>
        
        <div className="flex justify-between items-center font-semibold">
          <span>Total</span>
          <span>{currencySymbol}{totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
