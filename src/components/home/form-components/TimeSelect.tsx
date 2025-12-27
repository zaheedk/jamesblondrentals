
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock, ClockAlert } from "lucide-react";
import { memo, useCallback } from "react";

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

// Memoize TimeSelect to prevent unnecessary re-renders and improve INP
export const TimeSelect = memo(({
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
  console.log(`TimeSelect: ${id} - full options array:`, timeOptions);
  
  // Determine the message to show based on the component state
  let selectMessage = "Select time";
  let showNoticeWarning = false;
  
  if (isLoading) {
    selectMessage = "Loading times...";
  } else if (disabled) {
    if (placeholder) {
      selectMessage = placeholder;
    } else {
      selectMessage = "Select location and date first";
    }
  } else if (timeOptions.length === 0) {
    // If there are no time options but the component is not disabled, explain why
    selectMessage = "No times available - check notice requirements";
    showNoticeWarning = true;
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
        <SelectTrigger id={id} className={`flex items-center ${showNoticeWarning ? 'border-orange-400' : ''}`}>
          {showNoticeWarning ? (
            <ClockAlert className="mr-2 h-4 w-4 text-orange-500" />
          ) : (
            <Clock className="mr-2 h-4 w-4 opacity-70" />
          )}
          <SelectValue placeholder={selectMessage} />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {timeOptions.length > 0 ? (
            timeOptions.map(time => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))
          ) : (
            <div className="py-2 px-2 text-sm text-muted-foreground">
              No available times found
            </div>
          )}
        </SelectContent>
      </Select>
      {timeOptions.length === 0 && !disabled && (
        <p className="text-xs text-orange-600 mt-1">
          Notice period required - please choose a later date
        </p>
      )}
    </div>
  );
});

TimeSelect.displayName = 'TimeSelect';
