import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, Target, Zap, TrendingUp, Heart, ShoppingCart, Lightbulb, Clock, Calendar, Repeat, RotateCcw, Infinity } from 'lucide-react';
import { CampaignWizardData, CampaignObjective } from '@/types/campaignWizard';

const campaignBasicsSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  objective: z.enum(['brand_awareness', 'product_launch', 'sales_drive', 'engagement', 'conversions']),
  campaign_type: z.string().min(1, 'Please select a campaign type')
});

type CampaignBasicsForm = z.infer<typeof campaignBasicsSchema>;

interface CampaignBasicsStepProps {
  data?: Partial<CampaignWizardData>;
  onComplete: (data: Partial<CampaignWizardData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const objectiveOptions = [{
  value: 'brand_awareness' as CampaignObjective,
  label: 'Brand Awareness',
  description: 'Increase visibility and recognition of your brand',
  icon: <Zap className="h-5 w-5" />
}, {
  value: 'product_launch' as CampaignObjective,
  label: 'Product Launch',
  description: 'Introduce a new product or service to the market',
  icon: <Target className="h-5 w-5" />
}, {
  value: 'sales_drive' as CampaignObjective,
  label: 'Sales Drive',
  description: 'Drive direct sales and conversions',
  icon: <ShoppingCart className="h-5 w-5" />
}, {
  value: 'engagement' as CampaignObjective,
  label: 'Engagement',
  description: 'Boost interactions and community building',
  icon: <Heart className="h-5 w-5" />
}, {
  value: 'conversions' as CampaignObjective,
  label: 'Conversions',
  description: 'Drive specific actions like sign-ups or downloads',
  icon: <TrendingUp className="h-5 w-5" />
}];

const campaignTypes = [{
  value: 'Single',
  label: 'Single Campaign',
  description: 'One-time campaign with specific deliverables',
  icon: <Clock className="h-4 w-4" />
}, {
  value: 'Weekly',
  label: 'Weekly Campaign',
  description: 'Recurring weekly content for short-term goals',
  icon: <Calendar className="h-4 w-4" />
}, {
  value: 'Monthly',
  label: 'Monthly Campaign',
  description: 'Monthly content series for ongoing engagement',
  icon: <Repeat className="h-4 w-4" />
}, {
  value: '12-Month Retainer',
  label: '12-Month Retainer',
  description: 'Long-term partnership with consistent content',
  icon: <RotateCcw className="h-4 w-4" />
}, {
  value: 'Evergreen',
  label: 'Evergreen Campaign',
  description: 'Ongoing campaign without fixed end date',
  icon: <Infinity className="h-4 w-4" />
}];

const CampaignBasicsStep: React.FC<CampaignBasicsStepProps> = ({
  data,
  onComplete,
  isLoading
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isValid
    },
    trigger
  } = useForm<CampaignBasicsForm>({
    resolver: zodResolver(campaignBasicsSchema),
    defaultValues: {
      name: data?.name || '',
      objective: data?.objective || undefined,
      campaign_type: data?.campaign_type || ''
    },
    mode: 'onChange'
  });

  const watchedObjective = watch('objective');
  const watchedCampaignType = watch('campaign_type');
  const watchedName = watch('name');

  // Force validation check when values change
  React.useEffect(() => {
    trigger();
  }, [watchedObjective, watchedCampaignType, watchedName, trigger]);

  const onSubmit = (formData: CampaignBasicsForm) => {
    console.log('Form submitted with data:', formData);
    onComplete(formData);
  };

  const handleObjectiveChange = (value: CampaignObjective) => {
    setValue('objective', value);
    trigger('objective');
  };

  const handleCampaignTypeChange = (value: string) => {
    setValue('campaign_type', value);
    trigger('campaign_type');
  };

  // Debug logging
  React.useEffect(() => {
    console.log('Form state:', {
      name: watchedName,
      objective: watchedObjective,
      campaign_type: watchedCampaignType,
      isValid,
      errors
    });
  }, [watchedName, watchedObjective, watchedCampaignType, isValid, errors]);

  // Get the selected campaign type details for display
  const selectedCampaignType = campaignTypes.find(type => type.value === watchedCampaignType);

  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="bg-background border-border shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <div className="p-2 bg-foreground rounded-lg">
              <Target className="h-5 w-5 text-background" />
            </div>
            Campaign Basics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Campaign Name *
            </Label>
            <Input id="name" {...register('name')} placeholder="e.g., Summer Collection Launch 2024" className="text-lg bg-background border-border text-foreground placeholder:text-muted-foreground" />
            {errors.name && <p className="text-sm text-slate-300">{errors.name.message}</p>}
          </div>

          {/* Campaign Objective */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">
              What's your main objective? *
            </Label>
            <RadioGroup value={watchedObjective} onValueChange={handleObjectiveChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objectiveOptions.map(option => <Label key={option.value} htmlFor={option.value} className={`
                    flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedObjective === option.value ? 'border-foreground bg-card' : 'border-border hover:border-foreground bg-card'}
                  `}>
                  <RadioGroupItem id={option.value} value={option.value} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{option.icon}</span>
                      <span className="font-medium text-foreground">{option.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </Label>)}
            </RadioGroup>
            {errors.objective && <p className="text-sm text-destructive">{errors.objective.message}</p>}
          </div>

          {/* Campaign Type */}
          <div className="space-y-3">
            <Label htmlFor="campaign_type" className="text-sm font-medium text-foreground">
              Campaign Type *
            </Label>
            <Select value={watchedCampaignType} onValueChange={handleCampaignTypeChange}>
              <SelectTrigger className="bg-background border-border text-foreground h-auto min-h-[60px] p-4">
                <SelectValue placeholder="Select campaign duration and type">
                  {selectedCampaignType && <div className="flex items-center gap-3 text-left">
                      <div className="text-foreground">
                        {selectedCampaignType.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{selectedCampaignType.label}</div>
                        <div className="text-sm text-muted-foreground">{selectedCampaignType.description}</div>
                      </div>
                    </div>}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {campaignTypes.map(type => <SelectItem 
                    key={type.value} 
                    value={type.value} 
                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground p-4 cursor-pointer data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="text-current">
                        {type.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-current">{type.label}</div>
                        <div className="text-sm text-current opacity-70">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            {errors.campaign_type && <p className="text-sm text-slate-300">{errors.campaign_type.message}</p>}
          </div>

          {/* Quick Tips */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Quick Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Choose a clear, memorable campaign name that reflects your goal</li>
              <li>• Your objective will help us recommend the best creators for your needs</li>
              <li>• Campaign type determines pricing and creator availability</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid || isLoading} className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90">
          Continue to Content Requirements
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>;
};

export default CampaignBasicsStep;
