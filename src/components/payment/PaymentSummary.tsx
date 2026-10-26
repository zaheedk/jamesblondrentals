import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { qualifiesForMidweekDiscount } from "@/components/home/form-components/DateTimeUtils";
import { getBookingData } from "@/lib/booking-session";
import { parse } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  bookingInfoTotalCost?: number;
  payment: number;
  balanceDue: number;
  totalLabel?: string;
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
  bookingInfoTotalCost,
  payment,
  balanceDue,
  totalLabel = "Total Cost",
}: PaymentSummaryProps) => {
  const effectiveRentalDays = Math.max(1, rentalDays || 1);

  // Check for midweek discount (for display purposes only - only for qualifying vehicles)
  const bookingData = getBookingData();
  let hasDiscount = false;

  if (bookingData) {
    const pickupDate = new Date(bookingData.pickupDate.split('/').reverse().join('-'));
    const dropoffDate = new Date(bookingData.dropoffDate.split('/').reverse().join('-'));
    const isQualifyingVehicle = bookingData.vehicleName && (
      bookingData.vehicleName.toLowerCase().includes('jumbo') ||
      bookingData.vehicleName.toLowerCase().includes('truck') ||
      bookingData.vehicleName.toLowerCase().includes('ton') ||
      bookingData.vehicleName.toLowerCase().includes('box') ||
      bookingData.vehicleName.toLowerCase().includes('tipper')
    );
    hasDiscount = isQualifyingVehicle && qualifiesForMidweekDiscount(pickupDate, dropoffDate);
  }

  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);

  const mandatoryFeesTotal = mandatoryFees.reduce((sum, fee) => {
    return sum + (fee.amount || 0);
  }, 0);

  const totalOptionalFees = insurancePrice + (extraKmsPrice || 0) + extrasTotal;

  const calculatedTotalCost = (dailyRate * effectiveRentalDays) + mandatoryFeesTotal + totalOptionalFees;

  const displayTotalCost = bookingInfoTotalCost ||
    (totalCost > 0 ? totalCost : calculatedTotalCost);

  const calculatedBalanceDue = balanceDue >= 0 ? balanceDue : Math.max(0, displayTotalCost - payment);

  const displayBalanceDue = typeof balanceDue === 'number' && balanceDue >= 0
    ? balanceDue
    : calculatedBalanceDue;

  const hasExtras = insurancePrice > 0 || extraKmsPrice > 0 || selectedExtras.length > 0;

  return (
    <Accordion type="single" collapsible className="mb-6 rounded-lg border bg-muted/30 px-4">
      <AccordionItem value="price" className="border-b-0">
        <AccordionTrigger className="py-3 hover:no-underline">
          <div className="flex flex-1 items-center justify-between gap-4 pr-1 text-left">
            <span className="text-sm font-medium">{totalLabel}</span>
            <span className="text-base font-bold shrink-0">{formatCurrency(displayTotalCost)}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Vehicle rate ({effectiveRentalDays} {effectiveRentalDays === 1 ? 'day' : 'days'})</span>
              <span>{formatCurrency(dailyRate * effectiveRentalDays)}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between text-sm text-primary">
                <span>50% Midweek Discount Applied</span>
                <span></span>
              </div>
            )}

            {mandatoryFees.length > 0 && (
              <div className="border-t border-border mt-2 pt-2">
                {mandatoryFees.map((fee, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{fee.name}</span>
                    <span>{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            {hasExtras && (
              <div className="border-t border-border mt-2 pt-2">
                {insurancePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{insuranceName || 'Insurance'}</span>
                    <span>{formatCurrency(insurancePrice)}</span>
                  </div>
                )}
                {extraKmsPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{extraKmsName || 'Mileage charge'}</span>
                    <span>{formatCurrency(extraKmsPrice)}</span>
                  </div>
                )}
                {selectedExtras.map((extra, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{extra.name} {extra.quantity > 1 ? `(x${extra.quantity})` : ''}</span>
                    <span>{formatCurrency(extra.price * extra.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            {payment > 0 && (
              <div className="border-t border-border mt-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Payment made</span>
                  <span className="text-primary">{formatCurrency(payment)}</span>
                </div>
                {displayBalanceDue > 0 && (
                  <div className="flex justify-between text-sm font-medium mt-1">
                    <span>Balance due at pickup</span>
                    <span>{formatCurrency(displayBalanceDue)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PaymentSummary;
