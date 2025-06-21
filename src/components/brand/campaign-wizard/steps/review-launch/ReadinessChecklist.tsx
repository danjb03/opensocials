
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';

interface ReadinessChecklistProps {
  data: Partial<CampaignWizardData>;
}

export const ReadinessChecklist: React.FC<ReadinessChecklistProps> = ({ data }) => {
  const checklistItems = [
    {
      label: 'Campaign Name & Objective',
      completed: !!(data?.name && data?.objective),
      details: data?.name ? `"${data.name}"` : 'Missing campaign name'
    },
    {
      label: 'Campaign Brief',
      completed: !!(data?.brief_data && data?.brief_data?.product_description && data?.brief_data?.platform_destination?.length > 0),
      details: data?.brief_data?.platform_destination?.length ? `${data.brief_data.platform_destination.length} platforms selected` : 'Missing brief details'
    },
    {
      label: 'Budget & Timeline',
      completed: !!(data?.total_budget && data?.total_budget > 0),
      details: data?.total_budget ? `$${data.total_budget.toLocaleString()}` : 'Budget not set'
    },
    {
      label: 'Deliverables',
      completed: !!(data?.deliverables && (data.deliverables.posts_count > 0 || data.deliverables.stories_count > 0 || data.deliverables.reels_count > 0)),
      details: data?.deliverables ? `${Object.values(data.deliverables).reduce((sum, count) => sum + (count || 0), 0)} total deliverables` : 'No deliverables set'
    },
    {
      label: 'Creator Selection',
      completed: !!(data?.selected_creators && data.selected_creators.length > 0),
      details: data?.selected_creators?.length ? `${data.selected_creators.length} creators selected` : 'No creators selected'
    }
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const isReady = completedCount === totalCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Launch Readiness</h3>
        <Badge variant={isReady ? "default" : "secondary"} className="text-xs">
          {completedCount}/{totalCount} Complete
        </Badge>
      </div>
      
      <div className="space-y-3">
        {checklistItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {item.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                {item.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {item.details}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
