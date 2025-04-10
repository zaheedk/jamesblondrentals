
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RCMExtra } from "@/lib/api/rcm-api-types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExtrasSelectionProps {
  extras: RCMExtra[];
  selectedExtras: Map<string | number, number>;
  onExtraChange: (extraId: string | number, quantity: number) => void;
  currencySymbol: string;
}

const ExtrasSelection = ({
  extras,
  selectedExtras,
  onExtraChange,
  currencySymbol
}: ExtrasSelectionProps) => {
  const handleCheckboxChange = (extraId: string | number, checked: boolean) => {
    onExtraChange(extraId, checked ? 1 : 0);
  };

  const handleQuantityChange = (extraId: string | number, quantity: number) => {
    onExtraChange(extraId, quantity);
  };

  // Enhanced debugging output
  console.log("Extras received in component:", extras);
  console.log("Selected extras:", [...selectedExtras.entries()]);
  console.log("Extras type:", typeof extras);
  console.log("Is extras an array:", Array.isArray(extras));

  // If extras array is undefined, null, or empty, show a message
  if (!extras || !Array.isArray(extras) || extras.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Extras</h3>
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {extras === undefined || extras === null ? 
              "Unable to load extras for this vehicle." : 
              "No additional extras are available for this vehicle."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Extras</h3>
      <Card className="p-4">
        <div className="space-y-4">
          {extras.map((extra) => (
            <div key={extra.id} className="flex items-start justify-between border-b border-gray-100 py-2 last:border-0">
              <div className="flex items-start gap-2">
                <Checkbox 
                  id={`extra-${extra.id}`}
                  checked={selectedExtras.has(extra.id)} 
                  onCheckedChange={(checked) => handleCheckboxChange(extra.id, checked as boolean)}
                />
                <div>
                  <Label htmlFor={`extra-${extra.id}`} className="cursor-pointer font-medium">
                    {extra.name}
                  </Label>
                  {extra.description && (
                    <p className="text-sm text-muted-foreground">{extra.description}</p>
                  )}
                  <div className="text-sm">
                    {currencySymbol}{extra.unitprice.toFixed(2)} each
                  </div>
                </div>
              </div>
              
              {selectedExtras.has(extra.id) && extra.maxquantity > 1 && (
                <div className="flex items-center gap-2">
                  <Label htmlFor={`quantity-${extra.id}`} className="text-sm">Qty:</Label>
                  <Input
                    id={`quantity-${extra.id}`}
                    type="number"
                    min="1"
                    max={extra.maxquantity}
                    value={selectedExtras.get(extra.id) || 1}
                    onChange={(e) => handleQuantityChange(extra.id, parseInt(e.target.value, 10))}
                    className="w-16 h-8 text-sm"
                  />
                </div>
              )}
              
              {selectedExtras.has(extra.id) && (
                <div className="font-semibold text-right min-w-16">
                  {currencySymbol}{((selectedExtras.get(extra.id) || 0) * extra.unitprice).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ExtrasSelection;
