
import { PencilIcon } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ProjectFormValues } from '@/hooks/useProjectForm2';

export function CampaignNameField() {
  const form = useFormContext<ProjectFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold text-foreground">Campaign Name</FormLabel>
          <FormControl>
            <div className="relative group">
              <PencilIcon className="absolute left-3 top-3 h-4 w-4 text-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Enter campaign name" 
                className="pl-10 border-slate-300 focus-visible:ring-blue-500 transition-all duration-200" 
                {...field}
              />
              {fieldState.error && (
                <div className="absolute right-3 top-3 animate-fade-in">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="animate-fade-in" />
        </FormItem>
      )}
    />
  );
}
