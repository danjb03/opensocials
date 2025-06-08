
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
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold">Description</FormLabel>
          <FormControl>
            <div className="relative group">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500 transition-colors group-focus-within:text-primary z-10" />
              <Textarea 
                placeholder="Describe the campaign and its goals" 
                className="min-h-[120px] pl-10 pt-8 border-slate-300 focus-visible:ring-blue-500 transition-all duration-200 resize-none" 
                {...field}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {field.value?.length || 0}/500
              </div>
              {fieldState.error && (
                <div className="absolute right-3 top-3 animate-fade-in z-10">
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
