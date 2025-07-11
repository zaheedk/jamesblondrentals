
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RCMInsuranceOption } from "@/lib/api/rcm-api-types";
import { Check, X, Info } from "lucide-react";

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

  // Sort insurance options by total insurance amount
  const sortedInsuranceOptions = [...insuranceOptions].sort((a, b) => {
    const amountA = parseFloat(a.totalinsuranceamount.toString()) || 0;
    const amountB = parseFloat(b.totalinsuranceamount.toString()) || 0;
    return amountA - amountB;
  });

  // Map insurance options to display data with enhanced features
  const getInsuranceDisplayData = (insurance: RCMInsuranceOption, index: number) => {
    const dailyRate = parseFloat(insurance.totalinsuranceamount.toString()) || 0;
    
    // Define standard features based on insurance level
    const baseFeatures = [
      { name: "Windscreen & Tyre", included: index > 0 },
      { name: "Premium 24/7 Roadside Assistance", included: index > 0 },
      { name: "Lost Key Replacement", included: index > 1 }
    ];

    // Use the actual insurance name and description from RCM API
    const title = insurance.name || "Insurance Option";
    const subtitle = insurance.description || "";
    
    // Set excess and bond based on index/price level for display
    let excess = "";
    let bond = "";
    let isRecommended = false;

    if (index === 0 || dailyRate === 0) {
      excess = "$2000 EXCESS";
      bond = "$2000 BOND";
    } else if (index === 1) {
      excess = "$500 EXCESS";
      bond = "$500 BOND";
    } else {
      excess = "$0 EXCESS";
      bond = "$0 BOND";
      isRecommended = true;
    }

    return {
      ...insurance,
      title,
      subtitle,
      excess,
      bond,
      features: baseFeatures,
      isRecommended,
      dailyRate
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-black">INSURANCE COVER</h1>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-primary font-medium">Key Insurance Info</span>
        <Info className="h-4 w-4 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedInsuranceOptions.map((insurance, index) => {
          const displayData = getInsuranceDisplayData(insurance, index);
          const isSelected = selectedInsuranceId?.toString() === insurance.id.toString();
          
          return (
            <Card 
              key={insurance.id}
              className={`relative p-6 cursor-pointer transition-all duration-200 ${
                displayData.isRecommended 
                  ? 'bg-black text-white' 
                  : 'bg-gray-50 hover:bg-gray-100'
              } ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onSelectInsurance(insurance.id)}
            >
              {displayData.isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-3 py-1 rounded text-xs font-medium">
                    RECOMMENDED
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-bold ${displayData.isRecommended ? 'text-white' : 'text-black'}`}>
                    {displayData.title}
                  </h3>
                  <p className={`text-sm ${displayData.isRecommended ? 'text-gray-300' : 'text-gray-600'}`}>
                    {displayData.subtitle}
                  </p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                  <p className={`text-sm font-medium ${displayData.isRecommended ? 'text-white' : 'text-black'}`}>
                    {displayData.excess}, {displayData.bond}
                  </p>
                </div>

                <div className="space-y-2">
                  {displayData.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className={`h-4 w-4 ${displayData.isRecommended ? 'text-primary' : 'text-green-600'}`} />
                      ) : (
                        <X className={`h-4 w-4 ${displayData.isRecommended ? 'text-gray-400' : 'text-gray-400'}`} />
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? (displayData.isRecommended ? 'text-white' : 'text-black')
                          : (displayData.isRecommended ? 'text-gray-400' : 'text-gray-400')
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-lg font-bold ${displayData.isRecommended ? 'text-white' : 'text-black'}`}>
                      ${displayData.dailyRate.toFixed(2)} PER DAY
                    </span>
                    <span className={`text-xl font-bold ${displayData.isRecommended ? 'text-white' : 'text-black'}`}>
                      ${(displayData.dailyRate * 7).toFixed(2)}
                    </span>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      isSelected 
                        ? 'bg-primary text-white'
                        : displayData.isRecommended
                          ? 'bg-white text-black hover:bg-gray-100'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectInsurance(insurance.id);
                    }}
                  >
                    {isSelected ? 'SELECTED' : 'SELECT'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InsuranceOptions;
