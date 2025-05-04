
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
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold">Campaign Name</FormLabel>
          <FormControl>
            <div className="relative">
              <PencilIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Enter campaign name" 
                className="pl-10 border-slate-300 focus-visible:ring-blue-500" 
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
