
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SingleCampaignTimelineProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

export const SingleCampaignTimeline: React.FC<SingleCampaignTimelineProps> = ({
  setValue,
  watch,
  errors
}) => {
  const liveDate = watch('live_date');
  const endDate = watch('end_date');
  const uploadDeadline = watch('upload_deadline');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Campaign Live Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-background border-border",
                  !liveDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {liveDate ? format(liveDate, "PPP") : "Select live date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border">
              <Calendar
                mode="single"
                selected={liveDate}
                onSelect={(date) => setValue('live_date', date!)}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.live_date && (
            <p className="text-sm text-slate-300">{String(errors.live_date.message || 'Live date is required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Campaign End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-background border-border",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => setValue('end_date', date!)}
                disabled={(date) => date < (liveDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.end_date && (
            <p className="text-sm text-slate-300">{String(errors.end_date.message || 'End date is required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Content Upload Deadline *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-background border-border",
                  !uploadDeadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {uploadDeadline ? format(uploadDeadline, "PPP") : "Select deadline"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border">
              <Calendar
                mode="single"
                selected={uploadDeadline}
                onSelect={(date) => setValue('upload_deadline', date!)}
                disabled={(date) => date >= (liveDate || new Date()) || date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.upload_deadline && (
            <p className="text-sm text-slate-300">{String(errors.upload_deadline.message || 'Upload deadline is required')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
