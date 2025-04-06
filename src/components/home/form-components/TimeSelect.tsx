
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
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select 
        value={time} 
        onValueChange={onTimeChange}
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
        <SelectContent className="bg-white">
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
