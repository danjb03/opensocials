
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, DollarSign } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';
import { BudgetSection } from './budget-deliverables/BudgetSection';
import { DeliverablesSection } from './budget-deliverables/DeliverablesSection';
import { TimelineSection } from './budget-deliverables/TimelineSection';
import { BudgetTips } from './budget-deliverables/BudgetTips';
import { PricingWarning } from './budget-deliverables/PricingWarning';
import { BudgetValidationSection } from './budget-deliverables/BudgetValidationSection';
import { useBudgetValidation } from '@/hooks/useBudgetValidation';
import { toast } from 'sonner';

// Create dynamic schema based on campaign type
const createBudgetDeliverablesSchema = (campaignType: string) => {
  const baseSchema = {
    total_budget: z.number().min(100, 'Minimum budget is $100').max(1000000, 'Maximum budget is $1,000,000'),
    posts_count: z.number().min(1, 'At least 1 post required').max(100, 'Maximum 100 posts'),
    stories_count: z.number().min(0).max(50).optional(),
    reels_count: z.number().min(0).max(20).optional(),
    video_length_minutes: z.number().min(0).max(120).optional(),
  };

  // Add campaign type specific validation
  switch (campaignType) {
    case 'Single':
      return z.object({
        ...baseSchema,
        live_date: z.date({ required_error: 'Live date is required' }),
        end_date: z.date({ required_error: 'End date is required' }),
        upload_deadline: z.date({ required_error: 'Upload deadline is required' }),
      });
    case 'Weekly':
      return z.object({
        ...baseSchema,
        weeks_duration: z.number().min(1, 'At least 1 week required').max(52, 'Maximum 52 weeks'),
        post_day_of_week: z.string().min(1, 'Day of week is required'),
        posts_per_week: z.number().min(1, 'At least 1 post per week').max(7, 'Maximum 7 posts per week'),
      });
    case 'Monthly':
      return z.object({
        ...baseSchema,
        months_duration: z.number().min(1, 'At least 1 month required').max(24, 'Maximum 24 months'),
        monthly_schedule: z.string().min(1, 'Monthly schedule is required'),
        same_creators_monthly: z.boolean().optional(),
      });
    case '12-Month Retainer':
      return z.object({
        ...baseSchema,
        posting_type: z.enum(['fixed', 'flexible'], { required_error: 'Posting type is required' }),
        min_posts_per_month: z.number().min(1, 'At least 1 post per month').max(30, 'Maximum 30 posts per month'),
        blackout_dates: z.array(z.date()).optional(),
      });
    case 'Evergreen':
      return z.object({
        ...baseSchema,
        rolling_basis: z.boolean().optional(),
        monthly_budget_cap: z.number().min(0).optional(),
        scaling_triggers: z.array(z.string()).optional(),
      });
    default:
      return z.object({
        ...baseSchema,
        start_date: z.date({ required_error: 'Start date is required' }),
        end_date: z.date({ required_error: 'End date is required' }),
      });
  }
};

interface BudgetDeliverablesStepProps {
  data?: Partial<CampaignWizardData>;
  onComplete: (data: Partial<CampaignWizardData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const BudgetDeliverablesStep: React.FC<BudgetDeliverablesStepProps> = ({
  data,
  onComplete,
  onBack,
  isLoading
}) => {
  const campaignType = data?.campaign_type || 'Single';
  const budgetDeliverablesSchema = createBudgetDeliverablesSchema(campaignType);
  type BudgetDeliverablesForm = z.infer<typeof budgetDeliverablesSchema>;

  const {
    showValidationModal,
    validationError,
    validateCreatorBudgets,
    handleUpdateOffer,
    handleCloseValidationModal,
    showPricingWarning
  } = useBudgetValidation(data);

  // Create default values based on campaign type and existing data
  const getDefaultValues = () => {
    const base = {
      total_budget: data?.total_budget || 0,
      posts_count: data?.deliverables?.posts_count || 1,
      stories_count: data?.deliverables?.stories_count || 0,
      reels_count: data?.deliverables?.reels_count || 0,
      video_length_minutes: data?.deliverables?.video_length_minutes || 0,
    };

    // Add campaign type specific defaults
    switch (campaignType) {
      case 'Weekly':
        return {
          ...base,
          weeks_duration: data?.campaign_type_data?.weekly?.weeks_duration || 1,
          post_day_of_week: data?.campaign_type_data?.weekly?.post_day_of_week || '',
          posts_per_week: data?.campaign_type_data?.weekly?.posts_per_week || 1,
        };
      case 'Monthly':
        return {
          ...base,
          months_duration: data?.campaign_type_data?.monthly?.months_duration || 1,
          monthly_schedule: data?.campaign_type_data?.monthly?.monthly_schedule || '',
          same_creators_monthly: data?.campaign_type_data?.monthly?.same_creators_monthly || false,
        };
      case '12-Month Retainer':
        return {
          ...base,
          posting_type: data?.campaign_type_data?.retainer?.posting_type || 'fixed',
          min_posts_per_month: data?.campaign_type_data?.retainer?.min_posts_per_month || 1,
          blackout_dates: data?.campaign_type_data?.retainer?.blackout_dates || [],
        };
      case 'Evergreen':
        return {
          ...base,
          rolling_basis: data?.campaign_type_data?.evergreen?.rolling_basis || false,
          monthly_budget_cap: data?.campaign_type_data?.evergreen?.monthly_budget_cap || 0,
          scaling_triggers: data?.campaign_type_data?.evergreen?.scaling_triggers || [],
        };
      default:
        return {
          ...base,
          live_date: data?.campaign_type_data?.single?.live_date || undefined,
          end_date: data?.campaign_type_data?.single?.end_date || undefined,
          upload_deadline: data?.campaign_type_data?.single?.upload_deadline || undefined,
        };
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<BudgetDeliverablesForm>({
    resolver: zodResolver(budgetDeliverablesSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });

  const onSubmit = (formData: BudgetDeliverablesForm) => {
    // First validate creator budgets if we have selected creators
    if (!validateCreatorBudgets()) {
      return;
    }

    const deliverables = {
      posts_count: formData.posts_count,
      stories_count: formData.stories_count || 0,
      reels_count: formData.reels_count || 0,
      video_length_minutes: formData.video_length_minutes || 0,
    };

    // Create campaign type specific data structure
    const campaignTypeData: any = {};
    
    switch (campaignType) {
      case 'Single':
        campaignTypeData.single = {
          live_date: (formData as any).live_date,
          end_date: (formData as any).end_date,
          upload_deadline: (formData as any).upload_deadline,
        };
        break;
      case 'Weekly':
        campaignTypeData.weekly = {
          weeks_duration: (formData as any).weeks_duration,
          post_day_of_week: (formData as any).post_day_of_week,
          posts_per_week: (formData as any).posts_per_week,
        };
        break;
      case 'Monthly':
        campaignTypeData.monthly = {
          months_duration: (formData as any).months_duration,
          monthly_schedule: (formData as any).monthly_schedule,
          same_creators_monthly: (formData as any).same_creators_monthly,
        };
        break;
      case '12-Month Retainer':
        campaignTypeData.retainer = {
          posting_type: (formData as any).posting_type,
          min_posts_per_month: (formData as any).min_posts_per_month,
          blackout_dates: (formData as any).blackout_dates,
        };
        break;
      case 'Evergreen':
        campaignTypeData.evergreen = {
          rolling_basis: (formData as any).rolling_basis,
          monthly_budget_cap: (formData as any).monthly_budget_cap,
          scaling_triggers: (formData as any).scaling_triggers,
        };
        break;
    }

    // For legacy compatibility, still set timeline if it's a single campaign
    const timeline = campaignType === 'Single' ? {
      start_date: (formData as any).live_date,
      end_date: (formData as any).end_date,
    } : data?.timeline || {};

    onComplete({
      total_budget: formData.total_budget,
      deliverables,
      timeline,
      campaign_type_data: campaignTypeData
    });
  };

  const handleUpdateOfferWithToast = () => {
    handleUpdateOffer();
    toast.info('Please update the creator offers to meet minimum pricing requirements');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-background border-border shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-foreground">
              <div className="p-2 bg-foreground rounded-lg">
                <DollarSign className="h-5 w-5 text-background" />
              </div>
              Budget & Deliverables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {showPricingWarning && <PricingWarning />}

            <BudgetSection 
              register={register}
              watch={watch}
              errors={errors}
            />

            <DeliverablesSection 
              register={register}
              errors={errors}
            />

            <TimelineSection 
              setValue={setValue}
              watch={watch}
              errors={errors}
              campaignType={campaignType}
            />

            <BudgetTips />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 border-border text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={!isValid || isLoading || showPricingWarning}
            className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
          >
            Continue to Creator Selection
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <BudgetValidationSection
        showValidationModal={showValidationModal}
        validationError={validationError}
        onUpdateOffer={handleUpdateOfferWithToast}
        onCloseModal={handleCloseValidationModal}
      />
    </div>
  );
};

export default BudgetDeliverablesStep;
