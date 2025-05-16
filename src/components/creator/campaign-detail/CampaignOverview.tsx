
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/project';
import { Campaign } from '@/types/creator';

interface CampaignOverviewProps {
  campaign: Campaign;
}

export const CampaignOverview = ({ campaign }: CampaignOverviewProps) => {
  const deadlineDate = campaign.deadline ? parseISO(campaign.deadline) : parseISO(campaign.endDate);

  return (
    <div className="space-y-4">
      <div className="prose dark:prose-invert max-w-none">
        <h3 className="text-lg font-medium">About this Campaign</h3>
        <p className="text-muted-foreground">
          {campaign.description || 'No description provided for this campaign.'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="font-medium text-sm text-muted-foreground mb-1">Timeline</div>
            <div className="font-medium">
              {format(parseISO(campaign.startDate), 'MMM d')} - {format(parseISO(campaign.endDate), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="font-medium text-sm text-muted-foreground mb-1">Payment</div>
            <div className="font-medium">{formatCurrency(campaign.value)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="font-medium text-sm text-muted-foreground mb-1">Content Deadline</div>
            <div className="font-medium">
              {format(deadlineDate, 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="font-medium text-sm text-muted-foreground mb-1">Content Pieces</div>
            <div className="font-medium">
              {Object.entries(campaign.contentRequirements || {}).reduce(
                (total, [_, value]: [string, any]) => total + (value?.quantity || 0), 
                0
              ) || 'Not specified'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
