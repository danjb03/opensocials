
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

const budgetDeliverablesSchema = z.object({
  total_budget: z.number().min(100, 'Minimum budget is $100').max(1000000, 'Maximum budget is $1,000,000'),
  posts_count: z.number().min(1, 'At least 1 post required').max(100, 'Maximum 100 posts'),
  stories_count: z.number().min(0).max(50).optional(),
  reels_count: z.number().min(0).max(20).optional(),
  video_length_minutes: z.number().min(0).max(120).optional(),
  start_date: z.date({ required_error: 'Start date is required' }),
  end_date: z.date({ required_error: 'End date is required' }),
}).refine((data) => data.end_date >= data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type BudgetDeliverablesForm = z.infer<typeof budgetDeliverablesSchema>;

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
  const {
    showValidationModal,
    validationError,
    validateCreatorBudgets,
    handleUpdateOffer,
    handleCloseValidationModal,
    showPricingWarning
  } = useBudgetValidation(data);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<BudgetDeliverablesForm>({
    resolver: zodResolver(budgetDeliverablesSchema),
    defaultValues: {
      total_budget: data?.total_budget || 0,
      posts_count: data?.deliverables?.posts_count || 1,
      stories_count: data?.deliverables?.stories_count || 0,
      reels_count: data?.deliverables?.reels_count || 0,
      video_length_minutes: data?.deliverables?.video_length_minutes || 0,
      start_date: data?.timeline?.start_date || undefined,
      end_date: data?.timeline?.end_date || undefined,
    },
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

    const timeline = {
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    onComplete({
      total_budget: formData.total_budget,
      deliverables,
      timeline
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
