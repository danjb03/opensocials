
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CampaignWizardData } from '@/types/campaignWizard';

interface CampaignBriefSummaryProps {
  data: Partial<CampaignWizardData>;
}

const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span className={`text-sm font-medium ${className}`}>{children}</span>
);

export const CampaignBriefSummary: React.FC<CampaignBriefSummaryProps> = ({ data }) => {
  const briefData = data?.brief_data;

  if (!briefData) {
    return (
      <div className="text-muted-foreground">
        No campaign brief data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Campaign Brief</h3>
      
      <div className="grid gap-4">
        <div>
          <Label className="text-muted-foreground">Product/Service:</Label>
          <p className="text-foreground mt-1">{briefData.product_description}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Hook:</Label>
          <p className="text-foreground mt-1">{briefData.hook}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Content Format:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {briefData.content_format?.map(format => (
              <Badge key={format} variant="outline" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">Tone & Vibe:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {briefData.tone_vibe?.map(tone => (
              <Badge key={tone} variant="outline" className="text-xs">
                {tone}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">Key Messaging:</Label>
          <p className="text-foreground mt-1">{briefData.key_messaging}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Platform Destination:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {briefData.platform_destination?.map(platform => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">Call to Action:</Label>
          <p className="text-foreground mt-1">{briefData.call_to_action}</p>
        </div>

        {briefData.references_restrictions && (
          <div>
            <Label className="text-muted-foreground">References & Restrictions:</Label>
            <p className="text-foreground mt-1">{briefData.references_restrictions}</p>
          </div>
        )}
      </div>
    </div>
  );
};
