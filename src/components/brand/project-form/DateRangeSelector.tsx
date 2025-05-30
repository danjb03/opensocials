
import React from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  startDate: Date | undefined | null;
  endDate: Date | undefined | null;
  onStartDateChange: (date: Date | null | undefined) => void;
  onEndDateChange: (date: Date | null | undefined) => void;
  startLabel?: string;
  endLabel?: string;
  className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = "Start Date",
  endLabel = "End Date",
  className
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      <div className="w-full sm:w-1/2">
        <label className="block text-sm font-medium mb-1">{startLabel}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span>Select {startLabel.toLowerCase()}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => {
                onStartDateChange(date || null);
                // If end date is before start date, reset end date
                if (endDate && date && endDate < date) {
                  onEndDateChange(null);
                }
              }}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full sm:w-1/2">
        <label className="block text-sm font-medium mb-1">{endLabel}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              {endDate ? (
                format(endDate, "PPP")
              ) : (
                <span>Select {endLabel.toLowerCase()}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => onEndDateChange(date || null)}
              disabled={(date) => {
                const today = new Date(new Date().setHours(0, 0, 0, 0));
                return date < today || (startDate ? date < startDate : false);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
