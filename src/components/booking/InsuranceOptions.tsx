
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RCMInsuranceOption } from "@/lib/api/rcm-api-types";

interface InsuranceOptionsProps {
  insuranceOptions: RCMInsuranceOption[];
  selectedInsuranceId: string | number | null;
  onSelectInsurance: (insuranceId: string | number) => void;
  currencySymbol: string;
}

const InsuranceOptions = ({
  insuranceOptions,
  selectedInsuranceId,
  onSelectInsurance,
  currencySymbol
}: InsuranceOptionsProps) => {
  // Check if we have valid insurance options
  if (!insuranceOptions || insuranceOptions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Insurance Options</h3>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground italic">No insurance options available</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Insurance Options</h3>
      <Card className="p-4">
        <RadioGroup
          value={selectedInsuranceId?.toString()}
          onValueChange={(value) => onSelectInsurance(value)}
          className="space-y-2"
        >
          {insuranceOptions.map((insurance) => (
            <div
              key={insurance.id}
              className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={insurance.id.toString()} id={`insurance-${insurance.id}`} />
                <Label htmlFor={`insurance-${insurance.id}`} className="cursor-pointer">
                  <div>
                    <span className="font-medium">{insurance.name}</span>
                    {insurance.description && (
                      <p className="text-sm text-muted-foreground">{insurance.description}</p>
                    )}
                  </div>
                </Label>
              </div>
              <span className="font-semibold">
                {currencySymbol}{parseFloat(insurance.totalinsuranceamount.toString()).toFixed(2)}
              </span>
            </div>
          ))}
        </RadioGroup>
      </Card>
    </div>
  );
};

export default InsuranceOptions;
