
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RetainerTimelineProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

export const RetainerTimeline: React.FC<RetainerTimelineProps> = ({
  setValue,
  watch,
  errors
}) => {
  const postingType = watch('posting_type');
  const minPostsPerMonth = watch('min_posts_per_month');
  const blackoutDates = watch('blackout_dates') || [];

  const addBlackoutDate = (date: Date) => {
    const currentDates = blackoutDates || [];
    setValue('blackout_dates', [...currentDates, date]);
  };

  const removeBlackoutDate = (index: number) => {
    const currentDates = blackoutDates || [];
    setValue('blackout_dates', currentDates.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Posting Type *</Label>
          <Select value={postingType} onValueChange={(value) => setValue('posting_type', value)}>
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Select posting type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="fixed" className="text-popover-foreground">
                Fixed Schedule
              </SelectItem>
              <SelectItem value="flexible" className="text-popover-foreground">
                Flexible Timing
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.posting_type && (
            <p className="text-sm text-slate-300">{String(errors.posting_type.message || 'Posting type is required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Minimum Posts Per Month *</Label>
          <Input
            type="number"
            min="1"
            max="30"
            value={minPostsPerMonth || ''}
            onChange={(e) => setValue('min_posts_per_month', parseInt(e.target.value) || 1)}
            placeholder="e.g., 4"
            className="bg-background border-border text-foreground"
          />
          {errors.min_posts_per_month && (
            <p className="text-sm text-slate-300">{String(errors.min_posts_per_month.message || 'Minimum posts is required')}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Blackout Dates (Optional)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {blackoutDates.map((date: Date, index: number) => (
            <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
              {format(date, "MMM d, yyyy")}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBlackoutDate(index)}
                className="h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-background border-border text-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Add Blackout Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover border-border">
            <Calendar
              mode="single"
              onSelect={(date) => date && addBlackoutDate(date)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
