
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';

interface PipelineCampaign {
  id: string;
  name: string;
  brand_name: string;
  budget: number;
  status: string;
  created_at: string;
}

interface PipelineDetailsProps {
  showPipelineDetails: boolean;
  pipelineCampaigns: PipelineCampaign[] | undefined;
  pipelineLoading: boolean;
}

const PipelineDetails = ({ showPipelineDetails, pipelineCampaigns, pipelineLoading }: PipelineDetailsProps) => {
  if (!showPipelineDetails) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Pipeline Campaigns</CardTitle>
        <p className="text-sm text-muted-foreground">
          Draft campaigns awaiting completion and payment
        </p>
      </CardHeader>
      <CardContent>
        {pipelineLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : pipelineCampaigns && pipelineCampaigns.length > 0 ? (
          <div className="space-y-3">
            {pipelineCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{campaign.name}</h4>
                  <p className="text-sm text-muted-foreground">{campaign.brand_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">
                    ${(campaign.budget || 0).toLocaleString()}
                  </div>
                  <Badge variant="secondary">Draft</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No pipeline campaigns found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PipelineDetails;
