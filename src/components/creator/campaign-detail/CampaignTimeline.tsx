
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Upload, CheckCircle } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { Campaign } from '@/types/creator';

interface CampaignTimelineProps {
  campaign: Campaign;
}

export const CampaignTimeline = ({ campaign }: CampaignTimelineProps) => {
  const today = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  const deadlineDate = campaign.deadline ? new Date(campaign.deadline) : endDate;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isAfter(today, startDate) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Campaign Start</div>
              <div className="text-xs text-muted-foreground">{format(startDate, 'MMMM d, yyyy')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isAfter(today, deadlineDate) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <Upload className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Content Deadline</div>
              <div className="text-xs text-muted-foreground">{format(deadlineDate, 'MMMM d, yyyy')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isAfter(today, endDate) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <CheckCircle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Campaign End</div>
              <div className="text-xs text-muted-foreground">{format(endDate, 'MMMM d, yyyy')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={() => window.location.href = `/creator/campaigns/${campaign.id}/upload`}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
          
          <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:support@example.com?subject=Question about campaign ${campaign.title}`)}>
            Contact Support
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          Need help with this campaign? Contact support for assistance.
        </CardFooter>
      </Card>
    </>
  );
};
