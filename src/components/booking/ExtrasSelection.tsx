
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RCMExtra, RCMOptionalFee } from "@/lib/api/rcm-api-types";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExtrasSelectionProps {
  extras: RCMExtra[];
  selectedExtras: { id: string | number; name: string; quantity: number; totalPrice: number }[];
  onSelect: (extras: { id: string | number; name: string; quantity: number; totalPrice: number }[]) => void;
  currencySymbol: string;
}

const ExtrasSelection = ({
  extras,
  selectedExtras,
  onSelect,
  currencySymbol
}: ExtrasSelectionProps) => {
  // Create helper functions to check if an extra is selected and get its quantity
  const isSelected = (id: string | number): boolean => {
    return selectedExtras.some(extra => extra.id.toString() === id.toString());
  };

  const getQuantity = (id: string | number): number => {
    const extra = selectedExtras.find(extra => extra.id.toString() === id.toString());
    return extra ? extra.quantity : 0;
  };

  const handleCheckboxChange = (extraId: string | number, name: string, price: number, checked: boolean) => {
    if (checked) {
      // Add extra with quantity 1
      const updatedExtras = [
        ...selectedExtras,
        { id: extraId, name, quantity: 1, totalPrice: price }
      ];
      onSelect(updatedExtras);
    } else {
      // Remove extra
      const updatedExtras = selectedExtras.filter(
        extra => extra.id.toString() !== extraId.toString()
      );
      onSelect(updatedExtras);
    }
  };

  const handleQuantityChange = (extraId: string | number, name: string, price: number, quantity: number) => {
    const updatedExtras = selectedExtras.filter(
      extra => extra.id.toString() !== extraId.toString()
    );
    
    if (quantity > 0) {
      updatedExtras.push({
        id: extraId,
        name,
        quantity,
        totalPrice: price * quantity
      });
    }
    
    onSelect(updatedExtras);
  };

  // Show a message if no extras
  if (!extras || !extras.length) {
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
                  checked={isSelected(extra.id)} 
                  onCheckedChange={(checked) => handleCheckboxChange(
                    extra.id, 
                    extra.name, 
                    extra.unitprice, 
                    checked as boolean
                  )}
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
              
              {isSelected(extra.id) && extra.maxquantity > 1 && (
                <div className="flex items-center gap-2">
                  <Label htmlFor={`quantity-${extra.id}`} className="text-sm">Qty:</Label>
                  <Input
                    id={`quantity-${extra.id}`}
                    type="number"
                    min="1"
                    max={extra.maxquantity}
                    value={getQuantity(extra.id)}
                    onChange={(e) => handleQuantityChange(
                      extra.id, 
                      extra.name,
                      extra.unitprice,
                      parseInt(e.target.value, 10)
                    )}
                    className="w-16 h-8 text-sm"
                  />
                </div>
              )}
              
              {isSelected(extra.id) && (
                <div className="font-semibold text-right min-w-16">
                  {currencySymbol}{(getQuantity(extra.id) * extra.unitprice).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      {selectedExtras.length === 0 && (
        <div className="text-sm text-muted-foreground">
          Select any additional extras you'd like to add to your rental.
        </div>
      )}
    </div>
  );
};

export default ExtrasSelection;
