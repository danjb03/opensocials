
import { format } from "date-fns";
import { CalendarIcon } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ProjectFormValues } from '@/hooks/useProjectForm2';

interface ExecutionDateFieldProps {
  calculateDaysRemaining: (date: Date | null) => number;
}

export function ExecutionDateField({ calculateDaysRemaining }: ExecutionDateFieldProps) {
  const form = useFormContext<ProjectFormValues>();
  
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
                    "w-full pl-3 text-left font-normal flex justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      {format(field.value, "PPP")}
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {calculateDaysRemaining(field.value)} days remaining
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      Select execution date
                    </span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value || undefined}
                onSelect={(date) => {
                  // Handle both selection and deselection
                  field.onChange(date || null);
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
