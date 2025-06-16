
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface MonthlyCampaignTimelineProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

export const MonthlyCampaignTimeline: React.FC<MonthlyCampaignTimelineProps> = ({
  setValue,
  watch,
  errors
}) => {
  const monthsDuration = watch('months_duration');
  const monthlySchedule = watch('monthly_schedule');
  const sameCreatorsMonthly = watch('same_creators_monthly');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Campaign Duration (Months) *</Label>
          <Input
            type="number"
            min="1"
            max="24"
            value={monthsDuration || ''}
            onChange={(e) => setValue('months_duration', parseInt(e.target.value) || 0)}
            placeholder="e.g., 3"
            className="bg-background border-border text-foreground"
          />
          {errors.months_duration && (
            <p className="text-sm text-slate-300">{String(errors.months_duration.message || 'Duration is required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-creators"
              checked={sameCreatorsMonthly}
              onCheckedChange={(checked) => setValue('same_creators_monthly', checked)}
            />
            <Label htmlFor="same-creators" className="text-sm font-medium text-foreground">
              Use same creators each month
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Monthly Posting Schedule *</Label>
        <Textarea
          value={monthlySchedule || ''}
          onChange={(e) => setValue('monthly_schedule', e.target.value)}
          placeholder="Describe the posting schedule (e.g., 1st week: product launch, 2nd week: behind the scenes, etc.)"
          className="bg-background border-border text-foreground"
          rows={3}
        />
        {errors.monthly_schedule && (
          <p className="text-sm text-slate-300">{String(errors.monthly_schedule.message || 'Schedule is required')}</p>
        )}
      </div>
    </div>
  );
};
