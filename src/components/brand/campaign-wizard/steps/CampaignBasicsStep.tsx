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
import { ArrowRight, Target, Zap, TrendingUp, Heart, ShoppingCart } from 'lucide-react';
import { CampaignWizardData, CampaignObjective } from '@/types/campaignWizard';

const campaignBasicsSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  objective: z.enum(['brand_awareness', 'product_launch', 'sales_drive', 'engagement', 'conversions']),
  campaign_type: z.string().min(1, 'Please select a campaign type'),
});

type CampaignBasicsForm = z.infer<typeof campaignBasicsSchema>;

interface CampaignBasicsStepProps {
  data?: Partial<CampaignWizardData>;
  onComplete: (data: Partial<CampaignWizardData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const objectiveOptions = [
  {
    value: 'brand_awareness' as CampaignObjective,
    label: 'Brand Awareness',
    description: 'Increase visibility and recognition of your brand',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600'
  },
  {
    value: 'product_launch' as CampaignObjective,
    label: 'Product Launch',
    description: 'Introduce a new product or service to the market',
    icon: <Target className="h-5 w-5" />,
    color: 'text-green-600'
  },
  {
    value: 'sales_drive' as CampaignObjective,
    label: 'Sales Drive',
    description: 'Drive direct sales and conversions',
    icon: <ShoppingCart className="h-5 w-5" />,
    color: 'text-purple-600'
  },
  {
    value: 'engagement' as CampaignObjective,
    label: 'Engagement',
    description: 'Boost interactions and community building',
    icon: <Heart className="h-5 w-5" />,
    color: 'text-pink-600'
  },
  {
    value: 'conversions' as CampaignObjective,
    label: 'Conversions',
    description: 'Drive specific actions like sign-ups or downloads',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600'
  }
];

const campaignTypes = [
  { value: 'Single', label: 'Single Campaign', description: 'One-time campaign with specific deliverables' },
  { value: 'Weekly', label: 'Weekly Campaign', description: 'Recurring weekly content for short-term goals' },
  { value: 'Monthly', label: 'Monthly Campaign', description: 'Monthly content series for ongoing engagement' },
  { value: '12-Month Retainer', label: '12-Month Retainer', description: 'Long-term partnership with consistent content' },
  { value: 'Evergreen', label: 'Evergreen Campaign', description: 'Ongoing campaign without fixed end date' }
];

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
    formState: { errors, isValid }
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

  const onSubmit = (formData: CampaignBasicsForm) => {
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Campaign Basics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Campaign Name *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Summer Collection Launch 2024"
              className="text-lg"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Campaign Objective */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              What's your main objective? *
            </Label>
            <RadioGroup
              value={watchedObjective}
              onValueChange={(value) => setValue('objective', value as CampaignObjective)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {objectiveOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`
                    flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedObjective === option.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <RadioGroupItem 
                    id={option.value}
                    value={option.value} 
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={option.color}>{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
            {errors.objective && (
              <p className="text-sm text-red-600">{errors.objective.message}</p>
            )}
          </div>

          {/* Campaign Type */}
          <div className="space-y-2">
            <Label htmlFor="campaign_type" className="text-sm font-medium">
              Campaign Type *
            </Label>
            <Select 
              value={watchedCampaignType} 
              onValueChange={(value) => setValue('campaign_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign duration and type" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="space-y-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.campaign_type && (
              <p className="text-sm text-red-600">{errors.campaign_type.message}</p>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Choose a clear, memorable campaign name that reflects your goal</li>
              <li>• Your objective will help us recommend the best creators for your needs</li>
              <li>• Campaign type determines pricing and creator availability</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!isValid || isLoading}
          className="flex items-center gap-2"
        >
          Continue to Content Requirements
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default CampaignBasicsStep;