
import { FileText } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectFormValues } from '@/hooks/useProjectForm2';

export function DescriptionField() {
  const form = useFormContext<ProjectFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Textarea 
                placeholder="Describe the campaign and its goals" 
                className="min-h-[120px] pl-10 pt-8" 
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
