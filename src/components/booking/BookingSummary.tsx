import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format, parse, isValid, differenceInDays } from "date-fns";
import { Calendar, Shield, Package } from "lucide-react";

interface BookingSummaryProps {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | string;
  dropoffDate: Date | string;
  vehicleName: string;
  basePrice: number;
  selectedInsurance: { id: string | number; name: string; price: number } | null;
  selectedExtras: { id: string | number; name: string; quantity: number; totalPrice: number }[];
  kmChargePrice: number;
  currencySymbol: string;
  vehicleImageUrl?: string;
  seasonalRates?: {
    dailyRate: number;
    totalAmount: number;
    discountAmount?: number;
  }[];
  mandatoryFees?: {
    name: string;
    amount: number;
  }[];
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
  currencySymbol,
  vehicleImageUrl,
  seasonalRates = [],
  mandatoryFees = []
}: BookingSummaryProps) => {
  const [imageError, setImageError] = React.useState(false);
  
  const formatSafeDate = (date: Date | string | null | undefined): string => {
    if (!date) return "Date not available";
    
    try {
      if (date instanceof Date && !isNaN(date.getTime())) {
        return format(date, "PPP");
      }
      
      if (typeof date === 'string') {
        if (date.includes('/')) {
          try {
            if (date.match(/\d+\/[A-Za-z]+\/\d+/)) {
              const parts = date.split('/');
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const day = parseInt(parts[0]);
              const monthIndex = monthNames.findIndex(m => parts[1].includes(m));
              const year = parseInt(parts[2]);
              
              if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
                const parsedDate = new Date(year, monthIndex, day);
                if (isValid(parsedDate)) {
                  return format(parsedDate, "PPP");
                }
              }
            }
            
            const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate) && !isNaN(parsedDate.getTime())) {
              return format(parsedDate, "PPP");
            }
          } catch (e) {
            console.error("Failed to parse date with dd/MM/yyyy format:", date, e);
          }
        }
        
        if (date.includes('T')) {
          try {
            const dateObj = new Date(date);
            if (isValid(dateObj) && !isNaN(dateObj.getTime())) {
              return format(dateObj, "PPP");
            }
          } catch (e) {
            console.error("Failed to parse ISO date:", date, e);
          }
        }
        
        try {
          const fallbackDate = new Date(date);
          if (isValid(fallbackDate) && !isNaN(fallbackDate.getTime())) {
            return format(fallbackDate, "PPP");
          }
        } catch (e) {
          console.error("Failed to parse date with generic method:", date, e);
        }
      }
      
      return typeof date === 'string' ? date : "Invalid date format";
    } catch (err) {
      console.error("Error formatting date:", err, date);
      return "Date format error";
    }
  };

  const formattedPickupDate = formatSafeDate(pickupDate);
  const formattedDropoffDate = formatSafeDate(dropoffDate);
  
  const calculateRentalDuration = () => {
    try {
      let pickup: Date | null = null;
      let dropoff: Date | null = null;
      
      if (pickupDate instanceof Date) {
        pickup = pickupDate;
      } else if (typeof pickupDate === 'string') {
        if (pickupDate.match(/\d+\/[A-Za-z]+\/\d+/)) {
          const parts = pickupDate.split('/');
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const day = parseInt(parts[0]);
          const monthIndex = monthNames.findIndex(m => parts[1].includes(m));
          const year = parseInt(parts[2]);
          
          if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
            pickup = new Date(year, monthIndex, day);
          }
        } else if (pickupDate.includes('/')) {
          const [day, month, year] = pickupDate.split('/').map(Number);
          pickup = new Date(year, month - 1, day);
        } else {
          pickup = new Date(pickupDate);
        }
      }
      
      if (dropoffDate instanceof Date) {
        dropoff = dropoffDate;
      } else if (typeof dropoffDate === 'string') {
        if (dropoffDate.match(/\d+\/[A-Za-z]+\/\d+/)) {
          const parts = dropoffDate.split('/');
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const day = parseInt(parts[0]);
          const monthIndex = monthNames.findIndex(m => parts[1].includes(m));
          const year = parseInt(parts[2]);
          
          if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
            dropoff = new Date(year, monthIndex, day);
          }
        } else if (dropoffDate.includes('/')) {
          const [day, month, year] = dropoffDate.split('/').map(Number);
          dropoff = new Date(year, month - 1, day);
        } else {
          dropoff = new Date(dropoffDate);
        }
      }
      
      if (pickup && dropoff && isValid(pickup) && isValid(dropoff)) {
        const days = differenceInDays(dropoff, pickup) + 1;
        return days > 0 ? days : 1;
      }
    } catch (e) {
      console.error("Error calculating duration:", e);
    }
    
    return 1;
  };
  
  const rentalDuration = calculateRentalDuration();

  const handleImageError = () => {
    console.log(`Image failed to load for vehicle: ${vehicleName}`);
    setImageError(true);
  };

  const totalSeasonalRates = seasonalRates.reduce((sum, rate) => sum + rate.totalAmount, 0);
  const totalMandatoryFees = mandatoryFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  const adjustedBasePrice = basePrice - totalMandatoryFees;
  
  const totalPrice = 
    adjustedBasePrice + 
    (selectedInsurance?.price || 0) + 
    selectedExtras.reduce((sum, extra) => sum + extra.totalPrice, 0) + 
    kmChargePrice +
    totalSeasonalRates +
    totalMandatoryFees;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicleImageUrl && !imageError && (
          <div className="w-full aspect-video rounded-md mb-2 overflow-hidden">
            <img
              src={imageError ? '/placeholder.svg' : vehicleImageUrl}
              alt={vehicleName}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <h4 className="font-medium">Vehicle</h4>
          <p className="text-sm">{vehicleName}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Pickup</h4>
          <p className="text-sm">{pickupLocation}</p>
          <p className="text-sm">{formattedPickupDate}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Drop-off</h4>
          <p className="text-sm">{dropoffLocation}</p>
          <p className="text-sm">{formattedDropoffDate}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2" /> Duration of Hire
          </h4>
          <p className="text-sm">{rentalDuration} day{rentalDuration !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="border-t border-gray-200 my-4"></div>
        
        <div className="flex justify-between items-center">
          <span>Base price</span>
          <span>{currencySymbol}{adjustedBasePrice.toFixed(2)}</span>
        </div>
        
        {selectedInsurance && (
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <Shield className="h-4 w-4 mr-2" /> {selectedInsurance.name}
            </span>
            <span>{currencySymbol}{selectedInsurance.price.toFixed(2)}</span>
          </div>
        )}
        
        {kmChargePrice > 0 && (
          <div className="flex justify-between items-center">
            <span>Mileage charge</span>
            <span>{currencySymbol}{kmChargePrice.toFixed(2)}</span>
          </div>
        )}
        
        {selectedExtras.length > 0 && (
          <div className="py-2">
            <div className="font-medium flex items-center mb-2">
              <Package className="h-4 w-4 mr-2" /> Extras:
            </div>
            {selectedExtras.map((extra) => (
              <div key={extra.id} className="flex justify-between pl-6 py-1">
                <span>
                  {extra.name} {extra.quantity > 1 ? `× ${extra.quantity}` : ''}
                </span>
                <span>{currencySymbol}{extra.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        
        {mandatoryFees.length > 0 && (
          <div className="py-2">
            <div className="font-medium flex items-center mb-2">
              <Shield className="h-4 w-4 mr-2" /> Mandatory Fees:
            </div>
            {mandatoryFees.map((fee, index) => (
              <div key={index} className="flex justify-between pl-6 py-1">
                <span>{fee.name}</span>
                <span>{currencySymbol}{fee.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pl-6 py-1 font-medium">
              <span>Total Mandatory Fees</span>
              <span>{currencySymbol}{totalMandatoryFees.toFixed(2)}</span>
            </div>
          </div>
        )}
        
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
