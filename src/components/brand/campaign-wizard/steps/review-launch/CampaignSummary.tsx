
import React from 'react';
import { Calendar, DollarSign, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CampaignWizardData } from '@/types/campaignWizard';

interface CampaignSummaryProps {
  data: Partial<CampaignWizardData>;
}

const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span className={`text-sm font-medium ${className}`}>{children}</span>
);

export const CampaignSummary: React.FC<CampaignSummaryProps> = ({ data }) => {
  const selectedCreators = data?.selected_creators || [];
  const totalBudget = data.total_budget || 0;
  const estimatedReach = selectedCreators.length * 50000; // Mock calculation
  const campaignDuration = data.timeline?.start_date && data.timeline?.end_date 
    ? Math.ceil((data.timeline.end_date.getTime() - data.timeline.start_date.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Campaign Details</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Campaign Name</Label>
            <p className="font-medium text-foreground">{data.name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Objective</Label>
            <Badge variant="outline" className="ml-2">
              {data.objective?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Campaign Type</Label>
            <p className="font-medium text-foreground">{data.campaign_type}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Timeline & Budget</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
              <p className="font-medium text-foreground">
                {data.timeline?.start_date && data.timeline?.end_date ? (
                  <>
                    {format(data.timeline.start_date, 'MMM d')} - {format(data.timeline.end_date, 'MMM d, yyyy')}
                    <span className="text-sm text-muted-foreground ml-2">({campaignDuration} days)</span>
                  </>
                ) : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Total Budget</Label>
              <p className="font-medium text-foreground">${totalBudget.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Estimated Reach</Label>
              <p className="font-medium text-foreground">{estimatedReach.toLocaleString()} people</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
