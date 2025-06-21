
import React from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';

interface BudgetSectionProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  register,
  watch,
  errors
}) => {
  const watchedBudget = watch('total_budget');
  const watchedPosts = watch('posts_count');
  const watchedStories = watch('stories_count') || 0;
  const watchedReels = watch('reels_count') || 0;

  // Calculate total deliverables count
  const totalDeliverables = watchedPosts + watchedStories + watchedReels;
  
  // Calculate estimated per deliverable budget for display
  const estimatedPerDeliverable = totalDeliverables > 0 && watchedBudget ? watchedBudget / totalDeliverables : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-foreground" />
        <Label className="text-sm font-medium text-foreground">Campaign Budget</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="total_budget" className="text-sm font-medium text-foreground">
          Total Budget *
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="total_budget"
            type="number"
            {...register('total_budget', { valueAsNumber: true })}
            placeholder="Enter campaign budget"
            className="pl-10 text-lg bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {errors.total_budget && (
          <p className="text-sm text-slate-300">{String(errors.total_budget.message || 'Invalid input')}</p>
        )}
      </div>

      {/* Estimated cost per deliverable */}
      {estimatedPerDeliverable > 0 && (
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="text-sm text-foreground">
            <strong>Estimated per deliverable:</strong> ${estimatedPerDeliverable.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {totalDeliverables} total deliverable{totalDeliverables !== 1 ? 's' : ''} ({watchedPosts} post{watchedPosts !== 1 ? 's' : ''}{watchedStories > 0 ? `, ${watchedStories} stor${watchedStories !== 1 ? 'ies' : 'y'}` : ''}{watchedReels > 0 ? `, ${watchedReels} reel${watchedReels !== 1 ? 's' : ''}` : ''})
          </p>
        </div>
      )}
    </div>
  );
};
