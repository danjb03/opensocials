import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowRight, ArrowLeft, Calendar as CalendarIcon, DollarSign, Target, Clock, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CampaignWizardData } from '@/types/campaignWizard';

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

  const watchedBudget = watch('total_budget');
  const watchedStartDate = watch('start_date');
  const watchedEndDate = watch('end_date');
  const watchedPosts = watch('posts_count');

  // Calculate estimated creator budget (75% of total)
  const estimatedCreatorBudget = watchedBudget * 0.75;
  const estimatedPerPostBudget = watchedPosts > 0 ? estimatedCreatorBudget / watchedPosts : 0;

  const onSubmit = (formData: BudgetDeliverablesForm) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />Budget & Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <Label className="text-sm font-medium">Campaign Budget</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total_budget" className="text-sm font-medium">
                Total Budget *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="total_budget"
                  type="number"
                  {...register('total_budget', { valueAsNumber: true })}
                  placeholder="5000"
                  className="pl-10 text-lg"
                />
              </div>
              {errors.total_budget && (
                <p className="text-sm text-red-600">{errors.total_budget.message}</p>
              )}
            </div>

            {/* Budget Breakdown */}
            {watchedBudget > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900">Budget Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Creator Payments:</span>
                    <span className="font-medium">${estimatedCreatorBudget.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span className="font-medium">${(watchedBudget * 0.25).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total:</span>
                    <span>${watchedBudget.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deliverables Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <Label className="text-sm font-medium">Content Deliverables</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="posts_count" className="text-sm font-medium">
                  Feed Posts *
                </Label>
                <Input
                  id="posts_count"
                  type="number"
                  {...register('posts_count', { valueAsNumber: true })}
                  min="1"
                  max="100"
                />
                {errors.posts_count && (
                  <p className="text-sm text-red-600">{errors.posts_count.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stories_count" className="text-sm font-medium">
                  Stories
                </Label>
                <Input
                  id="stories_count"
                  type="number"
                  {...register('stories_count', { valueAsNumber: true })}
                  min="0"
                  max="50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reels_count" className="text-sm font-medium">
                  Reels/Short Videos
                </Label>
                <Input
                  id="reels_count"
                  type="number"
                  {...register('reels_count', { valueAsNumber: true })}
                  min="0"
                  max="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_length_minutes" className="text-sm font-medium">
                  Video Length (min)
                </Label>
                <Input
                  id="video_length_minutes"
                  type="number"
                  {...register('video_length_minutes', { valueAsNumber: true })}
                  min="0"
                  max="120"
                />
              </div>
            </div>

            {/* Estimated cost per deliverable */}
            {estimatedPerPostBudget > 0 && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Estimated per post:</strong> ${estimatedPerPostBudget.toFixed(2)} 
                  <span className="text-xs ml-1">(creator receives 75%)</span>
                </p>
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <Label className="text-sm font-medium">Campaign Timeline</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedStartDate ? format(watchedStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchedStartDate}
                      onSelect={(date) => setValue('start_date', date!)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.start_date && (
                  <p className="text-sm text-red-600">{errors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedEndDate ? format(watchedEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchedEndDate}
                      onSelect={(date) => setValue('end_date', date!)}
                      disabled={(date) => date < (watchedStartDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.end_date && (
                  <p className="text-sm text-red-600">{errors.end_date.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />Budget Tips
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Higher budgets attract premium creators with larger audiences</li>
              <li>• Consider your cost per engagement when setting budgets</li>
              <li>• Longer campaigns often provide better value and engagement</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
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
          className="flex items-center gap-2"
        >
          Continue to Creator Selection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default BudgetDeliverablesStep;