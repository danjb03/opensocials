
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';

interface DeliverablesSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const DeliverablesSection: React.FC<DeliverablesSectionProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-foreground" />
        <Label className="text-sm font-medium text-foreground">Content Deliverables</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="posts_count" className="text-sm font-medium text-foreground">
            Feed Posts *
          </Label>
          <Input
            id="posts_count"
            type="number"
            {...register('posts_count', { valueAsNumber: true })}
            min="1"
            max="100"
            className="bg-background border-border text-foreground"
          />
          {errors.posts_count && (
            <p className="text-sm text-slate-300">{String(errors.posts_count.message || 'Invalid input')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stories_count" className="text-sm font-medium text-foreground">
            Stories
          </Label>
          <Input
            id="stories_count"
            type="number"
            {...register('stories_count', { valueAsNumber: true })}
            min="0"
            max="50"
            className="bg-background border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reels_count" className="text-sm font-medium text-foreground">
            Reels/Short Videos
          </Label>
          <Input
            id="reels_count"
            type="number"
            {...register('reels_count', { valueAsNumber: true })}
            min="0"
            max="20"
            className="bg-background border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="video_length_minutes" className="text-sm font-medium text-foreground">
            Video Length (min)
          </Label>
          <Input
            id="video_length_minutes"
            type="number"
            {...register('video_length_minutes', { valueAsNumber: true })}
            min="0"
            max="120"
            className="bg-background border-border text-foreground"
          />
        </div>
      </div>
    </div>
  );
};
