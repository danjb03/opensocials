
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Eye, Clock, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    campaign_type: string;
    budget?: number;
    currency?: string;
    status: string;
    review_status?: string;
    start_date?: string;
    end_date?: string;
    brand_profiles?: {
      company_name: string;
    };
    creator_deals?: {
      id: string;
      status: string;
      deal_value: number;
    }[];
  };
  showActions?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  showActions = true 
}) => {
  const navigate = useNavigate();
  const deal = campaign.creator_deals?.[0];
  const isUnderReview = campaign.review_status && 
    ['pending_review', 'under_review', 'needs_revision'].includes(campaign.review_status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'invited':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'accepted':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'declined':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'completed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/20';
    }
  };

  const getReviewStatusLabel = (reviewStatus: string) => {
    switch (reviewStatus) {
      case 'pending_review':
        return 'Pending Review';
      case 'under_review':
        return 'Under Review';
      case 'needs_revision':
        return 'Needs Revision';
      default:
        return 'Under Review';
    }
  };

  const handleViewCampaign = () => {
    if (!isUnderReview) {
      navigate(`/creator/campaigns/${campaign.id}`);
    }
  };

  return (
    <Card className={`border-border bg-card/30 backdrop-blur hover:bg-card/50 transition-all duration-200 ${isUnderReview ? 'opacity-60' : ''}`}>
      {isUnderReview && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {getReviewStatusLabel(campaign.review_status!)} - Campaign not yet available
            </span>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium line-clamp-1 text-foreground">
              {campaign.name}
            </CardTitle>
            {campaign.brand_profiles?.company_name && (
              <div className="flex items-center gap-2 mt-2">
                <Building className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {campaign.brand_profiles.company_name}
                </p>
              </div>
            )}
          </div>
          {deal && (
            <Badge className={`${getStatusColor(deal.status)} font-light px-3 py-1`}>
              {deal.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {campaign.currency} {deal?.deal_value?.toLocaleString() || campaign.budget?.toLocaleString() || 'TBD'}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="text-foreground font-medium ml-1">
              {campaign.campaign_type}
            </span>
          </div>
        </div>

        {campaign.start_date && campaign.end_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
            </span>
          </div>
        )}

        {showActions && (
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-2 border-border hover:bg-muted/50"
              onClick={handleViewCampaign}
              disabled={isUnderReview}
            >
              <Eye className="h-4 w-4" />
              {isUnderReview ? 'Under Review' : 'View Details'}
            </Button>
            
            {deal?.status === 'invited' && !isUnderReview && (
              <Button 
                size="sm" 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Accept
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
export { CampaignCard };
