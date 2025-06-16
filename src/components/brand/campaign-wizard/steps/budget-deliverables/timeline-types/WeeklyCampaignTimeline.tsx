
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
  const postDaysOfWeek = watch('post_days_of_week') || [];
  const postsPerWeek = watch('posts_per_week');

  const handleSingleDayChange = (value: string) => {
    setValue('post_day_of_week', value);
    // Clear multiple days when switching to single day
    setValue('post_days_of_week', []);
  };

  const handleMultipleDaysChange = (dayValue: string, checked: boolean) => {
    const currentDays = postDaysOfWeek || [];
    let newDays;
    
    if (checked) {
      newDays = [...currentDays, dayValue];
    } else {
      newDays = currentDays.filter((day: string) => day !== dayValue);
    }
    
    // Limit selection to posts_per_week
    if (newDays.length <= postsPerWeek) {
      setValue('post_days_of_week', newDays);
      // Clear single day when using multiple days
      setValue('post_day_of_week', '');
    }
  };

  const isMultiplePosts = postsPerWeek > 1;

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

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {isMultiplePosts ? `Post Days of Week * (Select ${postsPerWeek})` : 'Post Day of Week *'}
          </Label>
          
          {!isMultiplePosts ? (
            <Select value={postDayOfWeek} onValueChange={handleSingleDayChange}>
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
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {daysOfWeek.map(day => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.value}
                    checked={postDaysOfWeek.includes(day.value)}
                    onCheckedChange={(checked) => handleMultipleDaysChange(day.value, checked as boolean)}
                    disabled={!postDaysOfWeek.includes(day.value) && postDaysOfWeek.length >= postsPerWeek}
                    className="border-border"
                  />
                  <Label htmlFor={day.value} className="text-sm text-foreground cursor-pointer">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          {(errors.post_day_of_week || errors.post_days_of_week) && (
            <p className="text-sm text-slate-300">
              {String(errors.post_day_of_week?.message || errors.post_days_of_week?.message || 'Day selection is required')}
            </p>
          )}
        </div>
      </div>

      {isMultiplePosts && postDaysOfWeek.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="text-sm text-foreground">
            <strong>Selected days:</strong> {postDaysOfWeek.map((day: string) => 
              daysOfWeek.find(d => d.value === day)?.label
            ).join(', ')}
          </p>
          {postDaysOfWeek.length < postsPerWeek && (
            <p className="text-xs text-muted-foreground mt-1">
              Select {postsPerWeek - postDaysOfWeek.length} more day(s)
            </p>
          )}
        </div>
      )}
    </div>
  );
};
