
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
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Content Requirements</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Platforms</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.content_requirements?.platforms?.map(platform => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Content Types</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.content_requirements?.content_types?.map(type => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-muted-foreground">Deliverables</Label>
        <div className="flex gap-4 mt-1 text-sm">
          <span className="text-foreground">{data.deliverables?.posts_count || 0} posts</span>
          {(data.deliverables?.stories_count || 0) > 0 && (
            <span className="text-foreground">{data.deliverables.stories_count} stories</span>
          )}
          {(data.deliverables?.reels_count || 0) > 0 && (
            <span className="text-foreground">{data.deliverables.reels_count} reels</span>
          )}
        </div>
      </div>
    </div>
  );
};
