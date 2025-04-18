
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
  balanceDue
}: PaymentSummaryProps) => {
  const rentalValue = rentalDays * dailyRate;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Rental Value ({rentalDays} days × ${dailyRate.toFixed(2)})</span>
          <span>{formatCurrency(rentalValue)}</span>
        </div>

        {insurancePrice > 0 && (
          <div className="flex justify-between">
            <span>{insuranceName || 'Insurance'}</span>
            <span>{formatCurrency(insurancePrice)}</span>
          </div>
        )}

        {extraKmsPrice > 0 && (
          <div className="flex justify-between">
            <span>{extraKmsName || 'Mileage Charge'}</span>
            <span>{formatCurrency(extraKmsPrice)}</span>
          </div>
        )}

        {selectedExtras.length > 0 && (
          <>
            <div className="border-t border-gray-300 my-2 pt-2">
              <div className="font-medium mb-2">Extra Items</div>
              {selectedExtras.map((extra, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{extra.name} {extra.quantity > 1 ? `(x${extra.quantity})` : ''}</span>
                  <span>{formatCurrency(extra.price)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {mandatoryFees.length > 0 && (
          <>
            <div className="border-t border-gray-300 my-2 pt-2">
              <div className="font-medium mb-2">Mandatory Fees</div>
              {mandatoryFees.map((fee, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{fee.name}</span>
                  <span>{formatCurrency(fee.amount)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="border-t border-gray-300 my-2 pt-2">
          <div className="flex justify-between font-semibold">
            <span>Total Cost</span>
            <span>{formatCurrency(totalCost)}</span>
          </div>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Paid</span>
          <span>{formatCurrency(payment)}</span>
        </div>

        {balanceDue > 0 && (
          <div className="flex justify-between text-red-600 font-bold">
            <span>Balance Due</span>
            <span>{formatCurrency(balanceDue)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;
