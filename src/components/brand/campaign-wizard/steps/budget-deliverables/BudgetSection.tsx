
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

  // Calculate estimated creator budget (75% of total)
  const estimatedCreatorBudget = watchedBudget * 0.75;
  const estimatedPerPostBudget = watchedPosts > 0 ? estimatedCreatorBudget / watchedPosts : 0;
  const costToRunCampaign = watchedBudget * 0.25;

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
            placeholder="5000"
            className="pl-10 text-lg bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {errors.total_budget && (
          <p className="text-sm text-slate-300">{String(errors.total_budget.message || 'Invalid input')}</p>
        )}
      </div>

      {/* Budget Breakdown */}
      {watchedBudget > 0 && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-foreground">Budget Breakdown</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creator Payments:</span>
              <span className="font-medium text-foreground">${estimatedCreatorBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost to run campaign:</span>
              <span className="font-medium text-foreground">${costToRunCampaign.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium border-t border-border pt-1">
              <span className="text-foreground">Total:</span>
              <span className="text-foreground">${watchedBudget.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Estimated cost per deliverable */}
      {estimatedPerPostBudget > 0 && (
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="text-sm text-foreground">
            <strong>Estimated per post:</strong> ${estimatedPerPostBudget.toFixed(2)} 
            <span className="text-xs ml-1 text-muted-foreground">(creator receives 75%)</span>
          </p>
        </div>
      )}
    </div>
  );
};
