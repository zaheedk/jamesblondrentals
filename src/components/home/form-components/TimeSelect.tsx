
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimeSelectProps {
  id: string;
  label: string;
  time: string;
  onTimeChange: (time: string) => void;
  timeOptions: string[];
  isLoading: boolean;
  disabled: boolean;
  placeholder?: string;
}

export const TimeSelect = ({
  id,
  label,
  time,
  onTimeChange,
  timeOptions,
  isLoading,
  disabled,
  placeholder
}: TimeSelectProps) => {
  // Add more debug logging to track the issue
  console.log(`TimeSelect: ${id} - options count: ${timeOptions.length}, disabled: ${disabled}, selected: ${time}`);
  
  if (timeOptions.length === 0 && !disabled) {
    console.log(`Warning: ${id} has no time options but is not disabled`);
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select 
        value={time} 
        onValueChange={(value) => {
          console.log(`Setting ${id} time to:`, value);
          onTimeChange(value);
        }}
        disabled={disabled || timeOptions.length === 0}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={
            isLoading ? "Loading times..." :
            disabled ? placeholder || "Select location and date first" :
            timeOptions.length === 0 ? "No times available" :
            "Select time"
          } />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {timeOptions.map(time => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
