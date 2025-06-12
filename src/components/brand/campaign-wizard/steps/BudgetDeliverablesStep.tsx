
import React, { useState, useEffect } from 'react';
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
import { BudgetValidationModal } from '../BudgetValidationModal';
import { usePricingFloorsByType } from '@/hooks/usePricingFloorsByType';
import { useCreatorTiers } from '@/hooks/useCreatorTiers';
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
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationError, setValidationError] = useState<{
    creatorName?: string;
    tier: string;
    campaignType: string;
    minPrice: number;
    currentOffer: number;
  } | null>(null);

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

  // Get pricing floors for the current campaign type
  const { data: pricingFloors } = usePricingFloorsByType(data?.campaign_type || 'Single');
  
  // Get creator tiers for validation
  const creatorIds = data?.selected_creators?.map(c => c.creator_id) || [];
  const { data: creatorTiers } = useCreatorTiers(creatorIds);

  const validateCreatorBudgets = (): boolean => {
    if (!data?.selected_creators || !pricingFloors || !creatorTiers) {
      return true; // Skip validation if data not loaded
    }

    for (const creator of data.selected_creators) {
      const tier = creatorTiers[creator.creator_id];
      const minPrice = pricingFloors[tier];
      
      if (minPrice && creator.individual_budget < minPrice) {
        setValidationError({
          tier,
          campaignType: data.campaign_type || 'Single',
          minPrice,
          currentOffer: creator.individual_budget
        });
        setShowValidationModal(true);
        return false;
      }
    }

    return true;
  };

  const onSubmit = (formData: BudgetDeliverablesForm) => {
    // First validate creator budgets
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

  const handleUpdateOffer = () => {
    setShowValidationModal(false);
    setValidationError(null);
    toast.info('Please update the creator offers to meet minimum pricing requirements');
  };

  const handleCloseValidationModal = () => {
    setShowValidationModal(false);
    setValidationError(null);
  };

  return (
    <>
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
            disabled={!isValid || isLoading}
            className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
          >
            Continue to Creator Selection
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {validationError && (
        <BudgetValidationModal
          isOpen={showValidationModal}
          onClose={handleCloseValidationModal}
          onUpdateOffer={handleUpdateOffer}
          tier={validationError.tier}
          campaignType={validationError.campaignType}
          minPrice={validationError.minPrice}
          currentOffer={validationError.currentOffer}
        />
      )}
    </>
  );
};

export default BudgetDeliverablesStep;
