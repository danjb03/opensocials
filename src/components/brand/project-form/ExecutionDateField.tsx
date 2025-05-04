
import { format } from "date-fns";
import { CalendarIcon, CalendarDaysIcon } from 'lucide-react';
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
  calculateDaysRemaining: (date: Date) => number;
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
                  <div className="flex items-center">
                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      <>
                        {format(field.value, "PPP")}
                        <span className="ml-2 text-sm text-gray-500">
                          ({calculateDaysRemaining(field.value)} days remaining)
                        </span>
                      </>
                    ) : (
                      <span>Select date</span>
                    )}
                  </div>
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
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
