
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface OptionSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { id: string | number; name: string }[];
  getOptionName: (id: string) => string;
  isLoading: boolean;
  defaultValue?: string;
  placeholder?: string;
}

export const OptionSelect = ({
  id,
  label,
  value,
  onValueChange,
  options,
  getOptionName,
  isLoading,
  placeholder = "Select option",
  defaultValue
}: OptionSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(value) => {
        console.log(`Setting ${id} to:`, value);
        onValueChange(value);
      }}>
        <SelectTrigger id={id} className={isLoading ? "animate-pulse" : ""}>
          <SelectValue>
            {value ? getOptionName(value) : defaultValue || placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
