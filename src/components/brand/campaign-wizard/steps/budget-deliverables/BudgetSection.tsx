
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

  // Calculate estimated per post budget for display
  const estimatedPerPostBudget = watchedPosts > 0 ? watchedBudget / watchedPosts : 0;

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

      {/* Estimated cost per deliverable */}
      {estimatedPerPostBudget > 0 && (
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="text-sm text-foreground">
            <strong>Estimated per post:</strong> ${estimatedPerPostBudget.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};
