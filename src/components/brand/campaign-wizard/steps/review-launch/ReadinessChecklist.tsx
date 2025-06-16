
import React from 'react';
import { CheckCircle, AlertCircle, Target, DollarSign, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CampaignWizardData } from '@/types/campaignWizard';

interface ReadinessChecklistProps {
  data: Partial<CampaignWizardData>;
}

export const ReadinessChecklist: React.FC<ReadinessChecklistProps> = ({ data }) => {
  const selectedCreators = data?.selected_creators || [];

  const readinessChecks = [
    {
      label: 'Campaign details complete',
      complete: !!(data.name && data.objective && data.description),
      icon: <Target className="h-4 w-4" />
    },
    {
      label: 'Content requirements defined',
      complete: !!(data.content_requirements?.platforms?.length && data.content_requirements?.content_types?.length),
      icon: <Target className="h-4 w-4" />
    },
    {
      label: 'Budget and timeline set',
      complete: !!(data.total_budget && data.timeline?.start_date && data.timeline?.end_date),
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      label: 'Creators selected',
      complete: selectedCreators.length > 0,
      icon: <Users className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Launch Readiness</h3>
      <div className="space-y-2">
        {readinessChecks.map((check, index) => (
          <div key={index} className="flex items-center gap-3">
            {check.complete ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            )}
            <span className={check.complete ? 'text-foreground' : 'text-muted-foreground'}>
              {check.label}
            </span>
            {check.complete && <Badge variant="secondary" className="ml-auto">Complete</Badge>}
          </div>
        ))}
      </div>
    </div>
  );
};
