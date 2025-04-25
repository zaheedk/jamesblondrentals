
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Car, CarFront, Truck, Bus } from "lucide-react";

interface OptionSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { id: string | number; name: string; isdefault?: boolean }[];
  getOptionName: (id: string) => string;
  isLoading: boolean;
  defaultValue?: string;
  placeholder?: string;
  allOptionId?: string | number;
  allOptionLabel?: string;
}

const getIconForCategory = (name: string) => {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes('van')) {
    return <Bus className="mr-2 h-4 w-4" />;
  } else if (lowercaseName.includes('truck')) {
    return <Truck className="mr-2 h-4 w-4" />;
  } else if (lowercaseName.includes('premium')) {
    return <CarFront className="mr-2 h-4 w-4" />;
  }
  
  return <Car className="mr-2 h-4 w-4" />;
};

export const OptionSelect = ({
  id,
  label,
  value,
  onValueChange,
  options,
  getOptionName,
  isLoading,
  placeholder = "Select option",
  defaultValue,
  allOptionId = "0",
  allOptionLabel = "All Categories"
}: OptionSelectProps) => {
  const formatOptionName = (name: string) => {
    // Always show 26+ for ages 26 and above
    const numericAge = parseInt(name);
    return (numericAge >= 26 && !isNaN(numericAge)) 
      ? "26+" 
      : name;
  };

  console.log(`OptionSelect ${id} rendering with value:`, value);
  
  // If this is the driver-age select and we have no value set yet but have options,
  // try to find and use the default value
  if (id === "driver-age" && (!value || value === "0") && options.length > 0) {
    const defaultOption = options.find(opt => opt.isdefault === true);
    
    if (defaultOption) {
      console.log(`Setting default driver age to ${defaultOption.id} (${defaultOption.name})`);
      setTimeout(() => onValueChange(String(defaultOption.id)), 0);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select 
        value={value} 
        onValueChange={(value) => {
          console.log(`Setting ${id} to:`, value);
          onValueChange(value);
        }}
      >
        <SelectTrigger id={id} className={isLoading ? "animate-pulse" : ""}>
          <SelectValue>
            {value ? (
              <div className="flex items-center">
                {id === "car-category" && getIconForCategory(getOptionName(value))}
                <span>{formatOptionName(getOptionName(value))}</span>
              </div>
            ) : (
              defaultValue || placeholder
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 && (
            <SelectItem key="all" value={String(allOptionId)}>
              <div className="flex items-center">
                {id === "car-category" && <Car className="mr-2 h-4 w-4" />}
                <span>{allOptionLabel}</span>
              </div>
            </SelectItem>
          )}
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              <div className="flex items-center">
                {id === "car-category" && getIconForCategory(option.name)}
                <span>{formatOptionName(option.name)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
