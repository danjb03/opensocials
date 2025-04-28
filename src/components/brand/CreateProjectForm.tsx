
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Plus, 
  Minus, 
  FileText, 
  DollarSign,
  Upload,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectFormValues } from "@/types/project";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];

const platformOptions = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "Twitter" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  campaign_type: z.enum(["single", "weekly", "monthly", "retainer"], {
    required_error: "Please select a campaign type.",
  }),
  start_date: z.date({
    required_error: "Start date is required.",
  }),
  end_date: z.date({
    required_error: "End date is required.",
  }).refine(date => date > new Date(), {
    message: "End date must be in the future"
  }),
  budget: z.string().min(1, {
    message: "Budget is required.",
  }),
  currency: z.enum(["USD", "GBP", "EUR"], {
    required_error: "Please select a currency.",
  }),
  content_requirements: z.object({
    videos: z.object({ quantity: z.number() }).optional(),
    stories: z.object({ quantity: z.number() }).optional(),
    posts: z.object({ quantity: z.number() }).optional(),
  }).refine(val => 
    val.videos || val.stories || val.posts, {
    message: "At least one content type must be selected",
  }),
  platforms: z.array(z.string()).min(1, {
    message: "Select at least one platform",
  }),
  creative_guidelines: z
    .array(z.instanceof(File))
    .optional(),
  usage_duration: z.enum(["3_months", "12_months", "perpetual"], {
    required_error: "Please select the usage duration.",
  }),
  whitelisting: z.boolean().default(false),
  exclusivity: z.string().optional(),
  audience_focus: z.string().optional(),
  campaign_objective: z.enum(["awareness", "engagement", "conversions"], {
    required_error: "Please select a campaign objective.",
  }),
  draft_approval: z.boolean().default(true),
  submission_deadline: z.date().optional(),
  payment_structure: z.enum(["upfront", "50_50", "on_delivery"], {
    required_error: "Please select a payment structure.",
  }),
  description: z.string().optional(),
});

export function CreateProjectForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      campaign_type: "single",
      currency: "USD",
      content_requirements: {},
      platforms: [],
      whitelisting: false,
      draft_approval: true,
      payment_structure: "on_delivery",
    },
  });

  // Validate that end date is after start date
  form.watch("start_date");
  form.watch("end_date");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      ACCEPTED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file(s)",
        description: "Some files were rejected. Files must be PDF, PNG, or JPG and less than 5MB.",
        variant: "destructive"
      });
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatContentRequirements = (data: z.infer<typeof formSchema>) => {
    // Filter out content types with zero quantity
    const content: Record<string, { quantity: number }> = {};
    if (data.content_requirements.videos && data.content_requirements.videos.quantity > 0) {
      content.videos = data.content_requirements.videos;
    }
    if (data.content_requirements.stories && data.content_requirements.stories.quantity > 0) {
      content.stories = data.content_requirements.stories;
    }
    if (data.content_requirements.posts && data.content_requirements.posts.quantity > 0) {
      content.posts = data.content_requirements.posts;
    }
    return content;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Format data for Supabase
      const projectData = {
        name: values.name,
        campaign_type: values.campaign_type,
        start_date: values.start_date,
        end_date: values.end_date,
        budget: parseFloat(values.budget),
        currency: values.currency,
        content_requirements: formatContentRequirements(values),
        platforms: values.platforms,
        usage_duration: values.usage_duration,
        whitelisting: values.whitelisting,
        exclusivity: values.exclusivity || null,
        audience_focus: values.audience_focus || null,
        campaign_objective: values.campaign_objective,
        draft_approval: values.draft_approval,
        submission_deadline: values.submission_deadline || null,
        payment_structure: values.payment_structure,
        description: values.description || null,
        brand_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'draft'
      };

      // Insert project into Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;
      
      // Handle file uploads if any
      if (uploadedFiles.length > 0) {
        // In a real app, we would upload these to Supabase storage
        // and link them to the project
        console.log('Files would be uploaded:', uploadedFiles);
      }

      toast({
        title: "Project created",
        description: `${values.name} has been successfully created.`,
      });
      
      navigate('/brand/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Basic Information</h2>
            <p className="text-sm text-muted-foreground">Enter the fundamental details about your project.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="campaign_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="retainer">12-Month Retainer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
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
                            <span>Select start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
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
                            <span>Select end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.end_date && form.watch('start_date') && form.watch('end_date') &&
                    form.watch('end_date') < form.watch('start_date') && (
                    <FormMessage>End date must be after start date</FormMessage>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        type="text" 
                        inputMode="numeric" 
                        className="pl-10" 
                        placeholder="Enter budget amount" 
                        {...field} 
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
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Content Requirements</h2>
            <p className="text-sm text-muted-foreground">Specify the type and quantity of content needed for this project.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="content_requirements.videos.quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Videos</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                        className="rounded-r-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number"
                        min="0"
                        className="min-w-[80px] max-w-[80px] text-center rounded-none"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange((field.value || 0) + 1)}
                        className="rounded-l-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content_requirements.stories.quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stories</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                        className="rounded-r-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number"
                        min="0"
                        className="min-w-[80px] max-w-[80px] text-center rounded-none"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange((field.value || 0) + 1)}
                        className="rounded-l-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content_requirements.posts.quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posts</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                        className="rounded-r-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number"
                        min="0"
                        className="min-w-[80px] max-w-[80px] text-center rounded-none"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange((field.value || 0) + 1)}
                        className="rounded-l-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="platforms"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Platform Focus</FormLabel>
                  <FormDescription>
                    Select the platforms where this content will be posted.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platformOptions.map((platform) => (
                    <FormField
                      key={platform.id}
                      control={form.control}
                      name="platforms"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={platform.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, platform.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== platform.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {platform.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Creative Guidelines</FormLabel>
            <FormDescription className="mb-2">
              Upload creative guidelines or reference materials (PDF, PNG, JPG, max 5MB each)
            </FormDescription>
            
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, PNG or JPG (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.png,.jpg,.jpeg" 
                  multiple 
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Uploaded files:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Usage Rights & Requirements</h2>
            <p className="text-sm text-muted-foreground">Specify how the content can be used and for how long.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="usage_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3_months">3 Months</SelectItem>
                      <SelectItem value="12_months">12 Months</SelectItem>
                      <SelectItem value="perpetual">Perpetual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="whitelisting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whitelisting Required</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span>{field.value ? "Yes" : "No"}</span>
                  </div>
                  <FormDescription>
                    Creator will grant advertiser access to run paid ads from their account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="exclusivity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exclusivity (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Creator cannot work with competing brands for 30 days" 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Specify any exclusivity requirements for creators.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Campaign Details</h2>
            <p className="text-sm text-muted-foreground">Additional information about the campaign objective and audience.</p>
          </div>
          
          <FormField
            control={form.control}
            name="audience_focus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your target audience (demographics, interests, etc.)" 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="campaign_objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Objective</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="conversions">Conversions</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="draft_approval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Draft Approval Required</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span>{field.value ? "Yes" : "No"}</span>
                  </div>
                  <FormDescription>
                    Do you need to approve content before it's published?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="submission_deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Submission Deadline</FormLabel>
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
                            <span>Select deadline date (optional)</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>When should creators submit their content by?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment_structure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Structure</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment structure" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upfront">100% Upfront</SelectItem>
                      <SelectItem value="50_50">50% Upfront, 50% On Delivery</SelectItem>
                      <SelectItem value="on_delivery">100% On Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide additional details about your project..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
