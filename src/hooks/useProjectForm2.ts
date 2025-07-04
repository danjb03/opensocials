
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from '@/hooks/use-toast';

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
] as const;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  executionDate: z.date({
    required_error: "Please select an execution date.",
  }).nullable(),
  budget: z.string().min(1, {
    message: "Please enter a budget amount.",
  }),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CHF'], {
    required_error: "Please select a currency.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export type ProjectFormValues = z.infer<typeof formSchema>;

export function useProjectForm2(onSuccess?: (project: ProjectFormValues) => void) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: "",
      currency: "USD",
      executionDate: null, // Using null instead of undefined
    },
  });

  function calculateDaysRemaining(date: Date | null): number {
    if (!date) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = date.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  function onSubmit(values: ProjectFormValues) {
    console.log("Form values before submission:", values);
    
    // Verify that executionDate is a valid Date object if provided
    if (values.executionDate && (!(values.executionDate instanceof Date) || isNaN(values.executionDate.getTime()))) {
      toast({
        title: "Invalid Date",
        description: "Please select a valid execution date.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Ensure dates are properly handled
    const dataToSubmit = {
      ...values,
      executionDate: values.executionDate || null
    };
    
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (onSuccess) {
        onSuccess(dataToSubmit);
      } else {
        toast({
          title: "Campaign created successfully",
          description: `${values.name} has been created.`,
          variant: "default"
        });
      }
    }, 1000);
  }

  return {
    form,
    currencies,
    isSubmitting,
    onSubmit,
    calculateDaysRemaining
  };
}
