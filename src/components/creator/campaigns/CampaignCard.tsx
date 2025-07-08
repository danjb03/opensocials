
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Eye, Clock, Building, ArrowRight, Timer, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'invited':
        return {
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: Timer,
          label: 'Invited'
        };
      case 'accepted':
        return {
          color: 'bg-green-500/10 text-green-400 border-green-500/20',
          icon: CheckCircle2,
          label: 'Accepted'
        };
      case 'declined':
        return {
          color: 'bg-red-500/10 text-red-400 border-red-500/20',
          icon: Clock,
          label: 'Declined'
        };
      case 'completed':
        return {
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          icon: CheckCircle2,
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-muted/20 text-muted-foreground border-muted/20',
          icon: Clock,
          label: 'Pending'
        };
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

  const statusConfig = getStatusConfig(deal?.status || 'pending');
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={`group border-border bg-card/40 backdrop-blur hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 ${isUnderReview ? 'opacity-60' : 'hover:-translate-y-1'}`}>
      {isUnderReview && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-4">
          <div className="flex items-center gap-3 text-yellow-400">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {getReviewStatusLabel(campaign.review_status!)}
              </p>
              <p className="text-xs text-yellow-400/70">Campaign not yet available</p>
            </div>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium line-clamp-2 text-foreground group-hover:text-blue-400 transition-colors">
              {campaign.name}
            </CardTitle>
            {campaign.brand_profiles?.company_name && (
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded bg-muted/20 flex items-center justify-center">
                  <Building className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {campaign.brand_profiles.company_name}
                </p>
              </div>
            )}
          </div>
          {deal && (
            <Badge className={`${statusConfig.color} font-medium px-3 py-1.5 flex items-center gap-2`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm mb-1">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-muted-foreground">Value</span>
            </div>
            <p className="text-foreground font-semibold">
              {campaign.currency} {deal?.deal_value?.toLocaleString() || campaign.budget?.toLocaleString() || 'TBD'}
            </p>
          </div>
          
          <div className="bg-muted/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm mb-1">
              <Eye className="h-4 w-4 text-blue-400" />
              <span className="text-muted-foreground">Type</span>
            </div>
            <p className="text-foreground font-semibold capitalize">
              {campaign.campaign_type}
            </p>
          </div>
        </div>

        {campaign.start_date && campaign.end_date && (
          <div className="bg-muted/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm mb-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span className="text-muted-foreground font-medium">Campaign Duration</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                {format(new Date(campaign.start_date), 'MMM d, yyyy')}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground">
                {format(new Date(campaign.end_date), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-2 border-border hover:bg-muted/50 hover:border-blue-500/20 hover:text-blue-400 transition-all group"
              onClick={handleViewCampaign}
              disabled={isUnderReview}
            >
              <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
              {isUnderReview ? 'Under Review' : 'View Details'}
            </Button>
            
            {deal?.status === 'invited' && !isUnderReview && (
              <Button 
                size="sm" 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/20 transition-all"
              >
                Accept Invite
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
