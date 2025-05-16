
import { Campaign } from '@/types/creator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CampaignRequirementsProps {
  campaign: Campaign;
}

export const CampaignRequirements = ({ campaign }: CampaignRequirementsProps) => {
  return (
    <div className="space-y-4">
      <div className="prose dark:prose-invert max-w-none">
        <h3 className="text-lg font-medium">Content Requirements</h3>
        
        {Object.keys(campaign.contentRequirements || {}).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Object.entries(campaign.contentRequirements).map(([contentType, details]: [string, any]) => (
              <Card key={contentType}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{contentType.charAt(0).toUpperCase() + contentType.slice(1)}</CardTitle>
                  <CardDescription>Quantity: {details.quantity || 0}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {details.description || `Create ${details.quantity || 'some'} ${contentType} content for this campaign.`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No specific content requirements provided for this campaign.</p>
        )}
      </div>
    </div>
  );
};
