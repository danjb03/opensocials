
import React from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';

interface DeliverablesSectionProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
  selectedCreatorsCount?: number;
}

export const DeliverablesSection: React.FC<DeliverablesSectionProps> = ({
  register,
  watch,
  errors,
  selectedCreatorsCount = 0
}) => {
  const watchedPosts = watch('posts_count') || 0;
  const watchedStories = watch('stories_count') || 0;
  const watchedReels = watch('reels_count') || 0;
  const watchedVideoLength = watch('video_length_minutes') || 0;

  // Calculate totals based on selected creators
  const totalPosts = watchedPosts * Math.max(selectedCreatorsCount, 1);
  const totalStories = watchedStories * Math.max(selectedCreatorsCount, 1);
  const totalReels = watchedReels * Math.max(selectedCreatorsCount, 1);

  const hasSelectedCreators = selectedCreatorsCount > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-foreground" />
        <Label className="text-sm font-medium text-foreground">Content Deliverables Per Creator</Label>
      </div>

      {hasSelectedCreators && (
        <div className="bg-muted rounded-lg p-3 mb-4">
          <p className="text-sm text-foreground font-medium mb-2">
            Campaign Totals ({selectedCreatorsCount} creator{selectedCreatorsCount !== 1 ? 's' : ''} selected):
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {totalPosts > 0 && <span>{totalPosts} total posts</span>}
            {totalStories > 0 && <span>{totalStories} total stories</span>}
            {totalReels > 0 && <span>{totalReels} total reels</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="posts_count" className="text-sm font-medium text-foreground">
            Feed Posts Per Creator *
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
            Stories Per Creator
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
            Reels/Short Videos Per Creator
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
            Video Length Per Creator (min)
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
