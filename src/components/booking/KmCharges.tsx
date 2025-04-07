
import React from "react";
import { Card } from "@/components/ui/card";
import { RCMKmCharge } from "@/lib/api/rcm-api-types";

interface KmChargesProps {
  kmCharges: RCMKmCharge[];
  numberOfDays: number;
  currencySymbol: string;
}

const KmCharges = ({
  kmCharges,
  numberOfDays,
  currencySymbol
}: KmChargesProps) => {
  // Find the default KM charge
  const defaultKmCharge = kmCharges.find(km => km.isdefault) || kmCharges[0];

  const renderKmChargeDescription = (kmCharge: RCMKmCharge) => {
    const { dailyrate, numberofkmsfree, feeforeachadditionalkm, mileagedesc } = kmCharge;

    if (dailyrate === 0 && numberofkmsfree === 0 && feeforeachadditionalkm === 0) {
      return `Unlimited ${mileagedesc}`;
    } else if (dailyrate > 0 && numberofkmsfree === 0 && feeforeachadditionalkm === 0) {
      return `Unlimited ${mileagedesc} (${currencySymbol}${dailyrate.toFixed(2)}/day)`;
    } else if (dailyrate > 0 && numberofkmsfree > 0) {
      return `${numberofkmsfree} ${mileagedesc}/day (${currencySymbol}${dailyrate.toFixed(2)}/day)`;
    } else {
      return `${numberofkmsfree} ${mileagedesc}/day, additional ${currencySymbol}${feeforeachadditionalkm.toFixed(2)} per ${mileagedesc}`;
    }
  };

  const calculateTotal = (kmCharge: RCMKmCharge) => {
    if (kmCharge.dailyrate > 0) {
      return numberOfDays * kmCharge.dailyrate;
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mileage Options</h3>
      <Card className="p-4">
        {defaultKmCharge && (
          <div className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
            <span className="text-sm">{renderKmChargeDescription(defaultKmCharge)}</span>
            {calculateTotal(defaultKmCharge) > 0 && (
              <span className="font-semibold">
                {currencySymbol}{calculateTotal(defaultKmCharge).toFixed(2)}
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default KmCharges;
