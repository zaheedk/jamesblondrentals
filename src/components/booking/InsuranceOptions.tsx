
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
    
    // Use the actual insurance name and description from RCM API
    const title = insurance.name || "Insurance Option";
    const description = insurance.description || "";
    
    // Parse bullet points from description (text in brackets)
    const bulletPoints: string[] = [];
    const bracketRegex = /\(([^)]+)\)/g;
    let match;
    while ((match = bracketRegex.exec(description)) !== null) {
      // Split by commas or semicolons and clean up
      const points = match[1].split(/[,;]/).map(point => point.trim()).filter(point => point.length > 0);
      bulletPoints.push(...points);
    }
    
    // Check if this is Peace of Mind for special styling
    const isPeaceOfMind = title.toLowerCase().includes('peace of mind');
    const isRecommended = index === 2 || isPeaceOfMind; // Keep existing logic but also check for Peace of Mind

    return {
      ...insurance,
      title,
      bulletPoints,
      isPeaceOfMind,
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
                displayData.isPeaceOfMind
                  ? 'text-white'
                  : displayData.isRecommended 
                    ? 'bg-black text-white' 
                    : 'bg-gray-50 hover:bg-gray-100'
              } ${isSelected ? 'ring-2 ring-primary' : ''}`}
              style={displayData.isPeaceOfMind ? { backgroundColor: 'hsl(var(--royal-blue))' } : undefined}
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
                  <h3 className={`text-xl font-bold ${(displayData.isRecommended || displayData.isPeaceOfMind) ? 'text-white' : 'text-black'}`}>
                    {displayData.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  {displayData.bulletPoints.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-start gap-2">
                      <span className={`text-sm mt-0.5 ${(displayData.isRecommended || displayData.isPeaceOfMind) ? 'text-white' : 'text-black'}`}>
                        •
                      </span>
                      <span className={`text-sm ${(displayData.isRecommended || displayData.isPeaceOfMind) ? 'text-white' : 'text-black'}`}>
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-lg font-bold ${(displayData.isRecommended || displayData.isPeaceOfMind) ? 'text-white' : 'text-black'}`}>
                      ${displayData.dailyRate.toFixed(2)} PER DAY
                    </span>
                    <span className={`text-xl font-bold ${(displayData.isRecommended || displayData.isPeaceOfMind) ? 'text-white' : 'text-black'}`}>
                      ${(displayData.dailyRate * 7).toFixed(2)}
                    </span>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      isSelected 
                        ? 'bg-primary text-white'
                        : (displayData.isRecommended || displayData.isPeaceOfMind)
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
