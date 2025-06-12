
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target } from 'lucide-react';
import { CampaignWizardData, CampaignObjective } from '@/types/campaignWizard';
import { CampaignNameField } from './campaign-basics/CampaignNameField';
import { ObjectiveSelector } from './campaign-basics/ObjectiveSelector';
import { CampaignTypeSelector } from './campaign-basics/CampaignTypeSelector';
import { QuickTips } from './campaign-basics/QuickTips';

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <CampaignNameField 
            register={register}
            errors={errors}
          />

          <ObjectiveSelector
            value={watchedObjective}
            onChange={handleObjectiveChange}
            errors={errors}
          />

          <CampaignTypeSelector
            value={watchedCampaignType}
            onChange={handleCampaignTypeChange}
            errors={errors}
          />

          <QuickTips />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!isValid || isLoading} 
          className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
        >
          Continue to Content Requirements
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default CampaignBasicsStep;
