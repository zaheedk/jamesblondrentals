
import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getNowInNZ } from "./DateTimeUtils";

interface DateSelectProps {
  id: string;
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disableDate?: (date: Date) => boolean;
  locationId?: string;
  allowSameDay?: boolean;
  locationDetails?: any[];
}

export const DateSelect = ({
  id,
  label,
  date,
  onDateChange,
  disableDate,
  locationId,
  allowSameDay = true, // Default to allowing same day selections
  locationDetails = []
}: DateSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Ensure consistent time part when selecting a date
      const consistentDate = new Date(newDate);
      consistentDate.setHours(12, 0, 0, 0);
      onDateChange(consistentDate);
    } else {
      onDateChange(newDate);
    }
    setOpen(false);
  };

  const combinedDisabledDate = (date: Date) => {
    // First check the passed in disable function
    if (disableDate && disableDate(date)) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={combinedDisabledDate}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
