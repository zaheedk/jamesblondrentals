
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
  numberOfDays: number;
}

const InsuranceOptions = ({
  insuranceOptions,
  selectedInsuranceId,
  onSelectInsurance,
  currencySymbol,
  numberOfDays
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
    // Calculate daily rate from total amount divided by number of days
    const totalAmount = parseFloat(insurance.totalinsuranceamount.toString()) || 0;
    const dailyRate = numberOfDays > 0 ? totalAmount / numberOfDays : totalAmount;
    
    // Use feedescription1 if available, otherwise fall back to name
    const webDescription = insurance.feedescription1 || "";
    const title = insurance.name || "Insurance Option";
    
    // Use feedescription for first line and feedescription1 for second line
    const firstLineText = (insurance.feedescription && insurance.feedescription.trim()) ? insurance.feedescription.trim() : "";
    const secondLineHtml = (insurance.feedescription1 && insurance.feedescription1.trim()) ? insurance.feedescription1.trim() : "";
    
    // Parse and format the second line HTML to add X icons before "Exclude" and tick icons before "Include"
    let formattedSecondLineHtml = secondLineHtml;
    if (secondLineHtml) {
      // Add X icon before any text that contains "Exclude"
      formattedSecondLineHtml = secondLineHtml.replace(
        /(\b\w*[Ee]xclud\w*)/g, 
        '<span class="inline-flex items-center gap-1 whitespace-nowrap"><svg class="w-4 h-4 text-red-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>$1</span>'
      );
      
      // Add tick icon before any text that contains "Include"
      formattedSecondLineHtml = formattedSecondLineHtml.replace(
        /(\b\w*[Ii]nclud\w*)/g, 
        '<span class="inline-flex items-center gap-1 whitespace-nowrap"><svg class="w-4 h-4 text-green-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>$1</span>'
      );
    }
    
    // Parse excess amount and bracket text for fallback
    let excessAmount = "";
    let bracketText: string[] = [];
    
    if (secondLineHtml) {
      // Extract excess amount from HTML content
      const excessMatch = secondLineHtml.match(/\$\s*(\d+(?:,\d+)?)\s*Excess/i);
      excessAmount = excessMatch ? `$${excessMatch[1]} excess` : "";
      
      // Extract list items from HTML
      const listItemsMatch = secondLineHtml.match(/<li>([^<]+)<\/li>/g);
      if (listItemsMatch) {
        bracketText = listItemsMatch.map(item => item.replace(/<\/?li>/g, ''));
      }
    } else {
      // Fallback to parsing name field
      const nameExcessMatch = title.match(/\$(\d+(?:,\d+)?)\s*excess/i);
      excessAmount = nameExcessMatch ? `$${nameExcessMatch[1]} excess` : "";
      
      // Extract text in brackets from name
      const bracketMatch = title.match(/\(([^)]+)\)/);
      bracketText = bracketMatch ? bracketMatch[1].split('|').map(text => text.trim()).filter(text => text.length > 0) : [];
    }
    
    // Check if this is Peace of Mind for special styling
    const isPeaceOfMind = title.toLowerCase().includes('peace of mind');
    const isRecommended = index === 2 || isPeaceOfMind; // Keep existing logic but also check for Peace of Mind
    const isPopular = index === 1; // Middle option is popular

    return {
      ...insurance,
      title,
      firstLineText,
      formattedSecondLineHtml,
      excessAmount,
      bracketText,
      isPeaceOfMind,
      isRecommended,
      isPopular,
      dailyRate
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-black">Choose Insurance</h1>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {sortedInsuranceOptions.map((insurance, index) => {
          const displayData = getInsuranceDisplayData(insurance, index);
          const isSelected = selectedInsuranceId?.toString() === insurance.id.toString();
          
          return (
            <Card 
              key={insurance.id}
              className={`relative p-0 cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-black overflow-hidden ${
                isSelected ? 'border-2 border-primary' : 'border border-gray-200'
              }`}
              onClick={() => onSelectInsurance(insurance.id)}
            >
              {displayData.isRecommended && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-green-800 text-white px-3 py-1 rounded text-xs font-bold shadow-lg">
                    RECOMMENDED
                  </div>
                </div>
              )}
              
              {displayData.isPopular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-primary text-white px-3 py-1 rounded text-xs font-bold shadow-lg">
                    POPULAR
                  </div>
                </div>
              )}

              {displayData.title.toLowerCase().includes('easy rider') && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-orange-700 text-white px-3 py-1 rounded text-xs font-bold shadow-lg">
                    RISK TAKER
                  </div>
                </div>
              )}
              
              <div className="p-6 pb-4">
                 <div className="space-y-2 mb-4">
                   {(!displayData.firstLineText || !displayData.formattedSecondLineHtml) && (
                     <h3 className="text-lg font-bold text-black">
                       {displayData.title}
                     </h3>
                   )}
                    {displayData.firstLineText && (
                      <div className="text-lg font-bold text-black">
                        {displayData.firstLineText}
                      </div>
                    )}
                   {displayData.formattedSecondLineHtml && (
                     <div className="text-sm text-black" dangerouslySetInnerHTML={{ __html: displayData.formattedSecondLineHtml }} />
                   )}
                   {!displayData.firstLineText && !displayData.formattedSecondLineHtml && displayData.excessAmount && (
                     <div className="text-sm font-medium text-black">
                       {displayData.excessAmount}
                     </div>
                   )}
                   {!displayData.firstLineText && !displayData.formattedSecondLineHtml && displayData.bracketText.length > 0 && (
                      <div className="text-sm text-black">
                        {displayData.bracketText.map((line, lineIndex) => (
                          <div key={lineIndex}>{line}</div>
                        ))}
                      </div>
                    )}
                 </div>

                <div className="pt-4 border-t border-gray-300">
                   <div className="flex justify-center items-center mb-4">
                     <span className="text-lg font-bold text-black">
                       ${displayData.dailyRate.toFixed(2)} PER DAY
                     </span>
                   </div>
                </div>
              </div>
              
              <div 
                className={`w-full text-center py-1 font-bold transition-colors ${
                  isSelected 
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectInsurance(insurance.id);
                }}
              >
                {isSelected ? 'SELECTED' : 'SELECT'}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InsuranceOptions;
