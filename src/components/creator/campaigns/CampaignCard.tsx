
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Eye, Clock } from 'lucide-react';
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

export const CampaignCard: React.FC<CampaignCardProps> = ({ 
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
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <Card className={`hover:shadow-md transition-all ${isUnderReview ? 'opacity-60' : ''}`}>
      {isUnderReview && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center gap-2 text-yellow-800">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {getReviewStatusLabel(campaign.review_status!)} - Campaign not yet available
            </span>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {campaign.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {campaign.brand_profiles?.company_name}
            </p>
          </div>
          {deal && (
            <Badge className={getStatusColor(deal.status)}>
              {deal.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              {campaign.currency} {deal?.deal_value?.toLocaleString() || campaign.budget?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{campaign.campaign_type}</span>
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
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-2"
              onClick={handleViewCampaign}
              disabled={isUnderReview}
            >
              <Eye className="h-4 w-4" />
              {isUnderReview ? 'Under Review' : 'View Details'}
            </Button>
            
            {deal?.status === 'invited' && !isUnderReview && (
              <Button size="sm" className="flex-1">
                Accept
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
