
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Circle, Clock, Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: string | null;
  budget: number | null;
  currency: string | null;
  campaign_type: string;
  brand_id: string | null;
}

interface CampaignCardProps {
  campaign: Campaign;
  showUploadButton?: boolean;
}

const getCampaignStatusColor = (status: string | null) => {
  switch (status) {
    case 'active':
      return 'text-emerald-500';
    case 'upcoming':
      return 'text-blue-500';
    case 'completed':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, showUploadButton = false }) => {
  const navigate = useNavigate();

  return (
    <Card key={campaign.id}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{campaign.name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {campaign.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Circle className={`h-4 w-4 ${getCampaignStatusColor(campaign.status)}`} />
          <span className="text-muted-foreground">Status: {campaign.status || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Budget: {campaign.currency}{campaign.budget?.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
          className="border-white/10 text-foreground hover:bg-white/5 hover:border-white/20"
        >
          View Details
        </Button>
        {showUploadButton && (
          <Button 
            size="sm"
            onClick={() => navigate(`/creator/campaigns/${campaign.id}/upload`)}
            className="bg-white text-black hover:bg-white/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Content
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
