
import React from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface ExecutionDateFieldProps {
  calculateDaysRemaining: (date: Date | null) => number;
}

export function ExecutionDateField({ calculateDaysRemaining }: ExecutionDateFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="executionDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Execution Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick an execution date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" style={{ pointerEvents: 'auto' }}>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(date)}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {field.value && (
            <p className="text-sm text-muted-foreground">
              {calculateDaysRemaining(field.value)} days remaining
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
