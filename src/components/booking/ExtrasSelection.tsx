
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
  selectedExtras: Map<string | number, number>;
  onExtraChange: (extraId: string | number, quantity: number) => void;
  currencySymbol: string;
  optionalFees?: RCMOptionalFee[];
}

const ExtrasSelection = ({
  extras,
  selectedExtras,
  onExtraChange,
  currencySymbol,
  optionalFees = []
}: ExtrasSelectionProps) => {
  const handleCheckboxChange = (extraId: string | number, checked: boolean) => {
    onExtraChange(extraId, checked ? 1 : 0);
  };

  const handleQuantityChange = (extraId: string | number, quantity: number) => {
    onExtraChange(extraId, quantity);
  };

  // Filter out Deposit and FullPayment optional fees
  const filteredOptionalFees = optionalFees.filter(
    fee => !["Deposit", "FullPayment"].includes(fee.name)
  );

  // Show a message if no extras or optional fees
  const hasNoAddons = (!extras || !extras.length) && (!filteredOptionalFees || !filteredOptionalFees.length);
  
  if (hasNoAddons) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-black">ADDITIONAL EXTRAS</h2>
        </div>
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-black">ADDITIONAL EXTRAS</h2>
      </div>
      
      {/* Display optional fees if available */}
      {filteredOptionalFees && filteredOptionalFees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOptionalFees.map((fee) => (
            <Card 
              key={fee.id} 
              className={`relative p-6 cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-black ${
                selectedExtras.has(fee.id) ? 'border-2 border-primary' : 'border border-gray-200'
              }`}
              onClick={() => handleCheckboxChange(fee.id, !selectedExtras.has(fee.id))}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img 
                      src={`https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=80&h=80&fit=crop&crop=center`}
                      alt={fee.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-gray-500 text-xs text-center">No Image</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-black">
                    {fee.name}
                  </h3>
                  {fee.feedescription && (
                    <p className="text-sm text-black">
                      {fee.feedescription}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-black">
                      {currencySymbol}{fee.fees.toFixed(2)}
                    </span>
                    {fee.qtyapply && selectedExtras.has(fee.id) && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`quantity-fee-${fee.id}`} className="text-sm font-bold text-black">Qty:</Label>
                        <Input
                          id={`quantity-fee-${fee.id}`}
                          type="number"
                          min="1"
                          max="10"
                          value={selectedExtras.get(fee.id) || 1}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(fee.id, parseInt(e.target.value, 10));
                          }}
                          className="w-16 h-8 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                  
                  <Checkbox 
                    id={`fee-${fee.id}`}
                    checked={selectedExtras.has(fee.id)} 
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(fee.id, checked as boolean);
                    }}
                    className="sr-only"
                  />
                  
                  <div 
                    className={`w-full text-center py-2 px-4 rounded font-bold text-white ${
                      selectedExtras.has(fee.id) 
                        ? 'bg-primary'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {selectedExtras.has(fee.id) ? 'SELECTED' : 'SELECT'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Display regular extras if available */}
      {extras && extras.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extras.map((extra) => (
            <Card 
              key={extra.id}
              className={`relative p-6 cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-black ${
                selectedExtras.has(extra.id) ? 'border-2 border-primary' : 'border border-gray-200'
              }`}
              onClick={() => handleCheckboxChange(extra.id, !selectedExtras.has(extra.id))}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img 
                      src={`https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=80&h=80&fit=crop&crop=center`}
                      alt={extra.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-gray-500 text-xs text-center">No Image</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-black">
                    {extra.name}
                  </h3>
                  {extra.description && (
                    <p className="text-sm text-black">
                      {extra.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-black">
                      {currencySymbol}{extra.unitprice.toFixed(2)} each
                    </span>
                    {extra.maxquantity > 1 && selectedExtras.has(extra.id) && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`quantity-${extra.id}`} className="text-sm font-bold text-black">Qty:</Label>
                        <Input
                          id={`quantity-${extra.id}`}
                          type="number"
                          min="1"
                          max={extra.maxquantity}
                          value={selectedExtras.get(extra.id) || 1}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(extra.id, parseInt(e.target.value, 10));
                          }}
                          className="w-16 h-8 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                  
                  <Checkbox 
                    id={`extra-${extra.id}`}
                    checked={selectedExtras.has(extra.id)} 
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(extra.id, checked as boolean);
                    }}
                    className="sr-only"
                  />
                  
                  <div 
                    className={`w-full text-center py-2 px-4 rounded font-bold text-white ${
                      selectedExtras.has(extra.id) 
                        ? 'bg-primary'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {selectedExtras.has(extra.id) ? 'SELECTED' : 'SELECT'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Display a message if no extras are selected */}
      {!hasNoAddons && !selectedExtras.size && (
        <div className="text-sm text-black">
          Select any additional extras you'd like to add to your rental.
        </div>
      )}
    </div>
  );
};

export default ExtrasSelection;
