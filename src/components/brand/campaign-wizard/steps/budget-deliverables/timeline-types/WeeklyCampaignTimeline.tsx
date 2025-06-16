
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WeeklyCampaignTimelineProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

export const WeeklyCampaignTimeline: React.FC<WeeklyCampaignTimelineProps> = ({
  setValue,
  watch,
  errors
}) => {
  const weeksDuration = watch('weeks_duration');
  const postDayOfWeek = watch('post_day_of_week');
  const postsPerWeek = watch('posts_per_week');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Campaign Duration (Weeks) *</Label>
          <Input
            type="number"
            min="1"
            max="52"
            value={weeksDuration || ''}
            onChange={(e) => setValue('weeks_duration', parseInt(e.target.value) || 0)}
            placeholder="e.g., 4"
            className="bg-background border-border text-foreground"
          />
          {errors.weeks_duration && (
            <p className="text-sm text-slate-300">{String(errors.weeks_duration.message || 'Duration is required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Post Day of Week *</Label>
          <Select value={postDayOfWeek} onValueChange={(value) => setValue('post_day_of_week', value)}>
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {daysOfWeek.map(day => (
                <SelectItem key={day.value} value={day.value} className="text-popover-foreground">
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.post_day_of_week && (
            <p className="text-sm text-slate-300">{String(errors.post_day_of_week.message || 'Day is required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Posts Per Week *</Label>
          <Input
            type="number"
            min="1"
            max="7"
            value={postsPerWeek || ''}
            onChange={(e) => setValue('posts_per_week', parseInt(e.target.value) || 1)}
            placeholder="e.g., 1"
            className="bg-background border-border text-foreground"
          />
          {errors.posts_per_week && (
            <p className="text-sm text-slate-300">{String(errors.posts_per_week.message || 'Posts per week is required')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
