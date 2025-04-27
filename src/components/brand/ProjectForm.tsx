import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, PencilIcon, CalendarDaysIcon, DollarSign, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  }),
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

type ProjectFormProps = {
  onSuccess?: (project: z.infer<typeof formSchema>) => void;
};

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: "",
      currency: "USD",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Here you would typically save this to your database
    // For now we'll just simulate a successful save
    console.log("Form values:", values);
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (onSuccess) {
        onSuccess(values);
      } else {
        toast({
          title: "Project created",
          description: `${values.name} has been successfully created.`,
        });
        navigate('/brand/projects');
      }
    }, 1000);
  }

  // Calculate days remaining
  const calculateDaysRemaining = (date: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = date.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <PencilIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input placeholder="Enter campaign name" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Enter campaign budget" 
                      className="pl-10" 
                      {...field} 
                      type="text"
                      inputMode="decimal"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
