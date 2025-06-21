
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CampaignWizardData } from '@/types/campaignWizard';

interface ContentRequirementsProps {
  data: Partial<CampaignWizardData>;
}

const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span className={`text-sm font-medium ${className}`}>{children}</span>
);

export const ContentRequirements: React.FC<ContentRequirementsProps> = ({ data }) => {
  const selectedCreatorsCount = data?.selected_creators?.length || 0;
  const postsPerCreator = data?.deliverables?.posts_count || 0;
  const storiesPerCreator = data?.deliverables?.stories_count || 0;
  const reelsPerCreator = data?.deliverables?.reels_count || 0;

  // Calculate totals
  const totalPosts = postsPerCreator * selectedCreatorsCount;
  const totalStories = storiesPerCreator * selectedCreatorsCount;
  const totalReels = reelsPerCreator * selectedCreatorsCount;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Content Requirements</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Platforms</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.brief_data?.platform_destination?.map(platform => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Content Types</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.brief_data?.content_format?.map(type => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-muted-foreground">Deliverables</Label>
        <div className="space-y-2 mt-1">
          {/* Per creator breakdown */}
          <div className="text-sm">
            <span className="font-medium text-foreground">Per Creator:</span>
            <div className="flex gap-4 mt-1">
              <span className="text-foreground">{postsPerCreator} posts</span>
              {storiesPerCreator > 0 && (
                <span className="text-foreground">{storiesPerCreator} stories</span>
              )}
              {reelsPerCreator > 0 && (
                <span className="text-foreground">{reelsPerCreator} reels</span>
              )}
            </div>
          </div>
          
          {/* Campaign totals */}
          {selectedCreatorsCount > 0 && (
            <div className="text-sm bg-muted rounded p-2">
              <span className="font-medium text-foreground">Campaign Totals ({selectedCreatorsCount} creators):</span>
              <div className="flex gap-4 mt-1">
                <span className="text-foreground">{totalPosts} total posts</span>
                {totalStories > 0 && (
                  <span className="text-foreground">{totalStories} total stories</span>
                )}
                {totalReels > 0 && (
                  <span className="text-foreground">{totalReels} total reels</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
