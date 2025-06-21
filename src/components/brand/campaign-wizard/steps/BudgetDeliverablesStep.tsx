
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

const budgetDeliverablesSchema = z.object({
  total_budget: z.number().min(1, 'Budget must be at least $1'),
  posts_count: z.number().min(1, 'At least 1 post per creator is required'),
  stories_count: z.number().min(0).optional(),
  reels_count: z.number().min(0).optional(),
  video_length_minutes: z.number().min(0).optional(),
  timeline: z.object({
    start_date: z.date(),
    end_date: z.date()
  }).refine(data => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["timeline"]
  })
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
      timeline: {
        start_date: data?.timeline?.start_date || new Date(),
        end_date: data?.timeline?.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    },
    mode: 'onChange'
  });

  // Get the number of selected creators for calculations
  const selectedCreatorsCount = data?.selected_creators?.length || 0;

  const onSubmit = (formData: BudgetDeliverablesForm) => {
    const deliverables = {
      posts_count: formData.posts_count,
      stories_count: formData.stories_count || 0,
      reels_count: formData.reels_count || 0,
      video_length_minutes: formData.video_length_minutes || 0
    };

    onComplete({
      total_budget: formData.total_budget,
      deliverables,
      timeline: formData.timeline
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="bg-background border-border shadow-lg">
        <CardHeader>
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
            watch={watch}
            errors={errors}
            selectedCreatorsCount={selectedCreatorsCount}
          />

          <TimelineSection 
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
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
  );
};

export default BudgetDeliverablesStep;
