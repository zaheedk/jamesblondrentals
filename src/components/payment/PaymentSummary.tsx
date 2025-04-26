import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface Extra {
  name: string;
  quantity: number;
  price: number;
}

interface MandatoryFee {
  name: string;
  amount: number;
  quantity?: number;
}

interface PaymentSummaryProps {
  rentalDays: number;
  dailyRate: number;
  insuranceName?: string;
  insurancePrice?: number;
  extraKmsName?: string;
  extraKmsPrice?: number;
  selectedExtras?: Extra[];
  mandatoryFees?: MandatoryFee[];
  totalCost: number;
  payment: number;
  balanceDue: number;
}

const PaymentSummary = ({
  rentalDays,
  dailyRate,
  insuranceName,
  insurancePrice = 0,
  extraKmsName,
  extraKmsPrice = 0,
  selectedExtras = [],
  mandatoryFees = [],
  totalCost,
  payment,
  balanceDue,
}: PaymentSummaryProps) => {
  const effectiveRentalDays = Math.max(1, rentalDays || 1);
  
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  
  const mandatoryFeesTotal = mandatoryFees.reduce((sum, fee) => {
    return sum + (fee.amount || 0);
  }, 0);
  
  const totalOptionalFees = insurancePrice + (extraKmsPrice || 0) + extrasTotal;
  
  const calculatedTotalCost = (dailyRate * effectiveRentalDays) + mandatoryFeesTotal + totalOptionalFees;
  
  const displayTotalCost = totalCost > 0 ? totalCost : calculatedTotalCost;
  
  const calculatedBalanceDue = balanceDue >= 0 ? balanceDue : Math.max(0, displayTotalCost - payment);

  const displayBalanceDue = typeof balanceDue === 'number' && balanceDue >= 0 
    ? balanceDue 
    : calculatedBalanceDue;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Vehicle Rate ({effectiveRentalDays} {effectiveRentalDays === 1 ? 'day' : 'days'})</span>
          <span>{formatCurrency(dailyRate * effectiveRentalDays)}</span>
        </div>
        
        {(mandatoryFees.length > 0) && (
          <div className="border-t border-gray-300 mt-2 pt-2">
            <div className="font-medium mb-2">Mandatory Fees</div>
            {mandatoryFees.map((fee, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{fee.name}</span>
                <span>{formatCurrency(fee.amount)}</span>
              </div>
            ))}
            {mandatoryFeesTotal > 0 && (
              <div className="flex justify-between font-medium text-sm mt-1 pt-1 border-t border-dashed border-gray-200">
                <span>Total Mandatory Fees</span>
                <span>{formatCurrency(mandatoryFeesTotal)}</span>
              </div>
            )}
          </div>
        )}

        {(insurancePrice > 0 || extraKmsPrice > 0 || selectedExtras.length > 0) && (
          <div className="border-t border-gray-300 mt-2 pt-2">
            <div className="font-medium mb-2">Optional Extras & Fees</div>
            {insurancePrice > 0 && (
              <div className="flex justify-between text-sm">
                <span>{insuranceName || 'Insurance'}</span>
                <span>{formatCurrency(insurancePrice)}</span>
              </div>
            )}

            {extraKmsPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span>{extraKmsName || 'Mileage Charge'}</span>
                <span>{formatCurrency(extraKmsPrice)}</span>
              </div>
            )}

            {selectedExtras.length > 0 && selectedExtras.map((extra, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{extra.name} {extra.quantity > 1 ? `(x${extra.quantity})` : ''}</span>
                <span>{formatCurrency(extra.price)}</span>
              </div>
            ))}
            {totalOptionalFees > 0 && (
              <div className="flex justify-between font-medium text-sm mt-1 pt-1 border-t border-dashed border-gray-200">
                <span>Total Optional Fees</span>
                <span>{formatCurrency(totalOptionalFees)}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="border-t border-gray-300 mt-2 pt-2">
          <div className="flex justify-between font-semibold">
            <span>Total Rental Cost</span>
            <span>{formatCurrency(displayTotalCost)}</span>
          </div>
          
          {payment > 0 && (
            <>
              <div className="flex justify-between text-sm mt-2">
                <span>Payment Made</span>
                <span className="text-green-600">{formatCurrency(payment)}</span>
              </div>
              
              {displayBalanceDue > 0 && (
                <div className="flex justify-between font-medium mt-1">
                  <span>Balance Due at Pickup</span>
                  <span>{formatCurrency(displayBalanceDue)}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
