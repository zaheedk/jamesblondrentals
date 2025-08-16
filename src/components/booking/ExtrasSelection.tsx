
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

// Function to get image URL for extra items based on name or ID
const getExtraItemImage = (name: string, id: string | number): string | null => {
  // Fleet accessories image mappings based on the actual fleet page
  const imageMap: { [key: string]: string } = {
    // Child safety items
    'child seat': '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png',
    'baby seat': '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png',
    'booster seat': '/lovable-uploads/aded4525-6592-42ec-9193-53b898de2c13.png',
    
    // Moving equipment
    'pallet jack': '/lovable-uploads/7399d499-7037-41fe-b5c3-3d013ad2163e.png',
    'straps': '/lovable-uploads/6242ae39-7570-4898-b18a-1fa9753856af.png',
    'ratchet': '/lovable-uploads/6242ae39-7570-4898-b18a-1fa9753856af.png',
    'strap': '/lovable-uploads/6242ae39-7570-4898-b18a-1fa9753856af.png',
    'hand trolley': '/lovable-uploads/2462a28e-2cb6-44ef-82b9-b46b5559d465.png',
    'trolley': '/lovable-uploads/2462a28e-2cb6-44ef-82b9-b46b5559d465.png',
    'large hand trolley': '/lovable-uploads/2462a28e-2cb6-44ef-82b9-b46b5559d465.png',
    
    // GPS and electronics (using a child seat as fallback since no GPS image available)
    'gps': '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png',
    'navigation': '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png',
    'sat nav': '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png',
    
    // Additional drivers (using child seat as fallback)
    'additional driver': '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png',
    'extra driver': '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png',
  };

  // Check if the name contains any of the keywords
  const lowerName = name.toLowerCase();
  for (const [keyword, imageUrl] of Object.entries(imageMap)) {
    if (lowerName.includes(keyword)) {
      return imageUrl;
    }
  }

  // Return first image as default fallback
  return '/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png';
};

const ExtrasSelection = ({
  extras,
  selectedExtras,
  onExtraChange,
  currencySymbol,
  optionalFees = []
}: ExtrasSelectionProps) => {
  const handleCheckboxChange = (extraId: string | number, checked: boolean) => {
    console.log('Checkbox changed:', { extraId, checked });
    onExtraChange(extraId, checked ? 1 : 0);
  };

  const handleQuantityChange = (extraId: string | number, quantity: number) => {
    console.log('Quantity changed:', { extraId, quantity });
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
                    {getExtraItemImage(fee.name, fee.id) ? (
                      <img 
                        src={getExtraItemImage(fee.name, fee.id)}
                        alt={fee.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="text-gray-500 text-xs text-center">No Image</div>
                    )}
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
                      {selectedExtras.has(fee.id) 
                        ? `${currencySymbol}${((selectedExtras.get(fee.id) || 1) * fee.fees).toFixed(2)} total`
                        : `${currencySymbol}${fee.fees.toFixed(2)}`
                      }
                    </span>
                    {selectedExtras.has(fee.id) && (
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
                    {getExtraItemImage(extra.name, extra.id) ? (
                      <img 
                        src={getExtraItemImage(extra.name, extra.id)}
                        alt={extra.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="text-gray-500 text-xs text-center">No Image</div>
                    )}
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
                      {selectedExtras.has(extra.id) 
                        ? `${currencySymbol}${((selectedExtras.get(extra.id) || 1) * extra.unitprice).toFixed(2)} total`
                        : `${currencySymbol}${extra.unitprice.toFixed(2)} each`
                      }
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
