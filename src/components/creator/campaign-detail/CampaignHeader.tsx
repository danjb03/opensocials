
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { format, isAfter, isBefore } from 'date-fns';
import { Campaign } from '@/types/creator';

interface CampaignHeaderProps {
  campaign: Campaign;
  getPlatformIcon: (platform: string) => JSX.Element | null;
}

export const CampaignHeader = ({ campaign, getPlatformIcon }: CampaignHeaderProps) => {
  const today = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  
  const isActive = isBefore(startDate, today) && isAfter(endDate, today);
  const isUpcoming = isAfter(startDate, today);
  const isCompleted = isBefore(endDate, today) || campaign.status === 'completed';
  
  const getCampaignStatus = () => {
    if (isCompleted) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (isUpcoming) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Calendar className="h-3 w-3 mr-1" />
          Starts {format(startDate, 'MMM d')}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <Clock className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        {getCampaignStatus()}
        
        <div className="flex gap-2">
          {campaign.platforms.map((platform, index) => (
            <Badge key={index} variant="outline" className="gap-1">
              {getPlatformIcon(platform)}
              {platform}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-10 w-10 rounded-md">
          {campaign.brandLogo ? (
            <AvatarImage src={campaign.brandLogo} alt={campaign.brandName} />
          ) : (
            <AvatarFallback className="rounded-md bg-primary/10 text-primary">
              {campaign.brandName?.substring(0, 2) || 'BR'}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{campaign.title}</CardTitle>
          <CardDescription className="text-base">{campaign.brandName}</CardDescription>
        </div>
      </div>
    </>
  );
};
