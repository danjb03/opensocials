import React from 'react';
import { CalendarDays, Clock, Target, ListChecks, Users, ChevronDown, ChevronRight, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Json } from '@/integrations/supabase/types';

interface SecureDeal {
  id: string;
  project_id: string;
  creator_id: string;
  deal_value: number; // Net value only (after 25% margin deduction)
  individual_requirements: Json;
  status: 'pending' | 'invited' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  invited_at: string;
  responded_at?: string;
  creator_feedback?: string;
  payment_status: 'pending' | 'processing' | 'paid' | 'failed';
  paid_at?: string;
  created_at: string;
  updated_at: string;
  project?: {
    name: string;
    description?: string;
    campaign_type: string;
    start_date?: string;
    end_date?: string;
    content_requirements: Json;
    deliverables: Json;
    brand_profile?: {
      company_name: string;
      logo_url?: string;
    };
  };
}

interface SecureDealCardProps {
  deal: SecureDeal;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDetails: () => void;
}

const SecureDealCard: React.FC<SecureDealCardProps> = ({ 
  deal, 
  isExpanded,
  onToggleExpand,
  onViewDetails
}) => {
  const endDate = deal.project?.end_date ? new Date(deal.project.end_date) : null;
  const today = new Date();
  const daysLeft = endDate 
    ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const getTimeUrgencyColor = () => {
    if (daysLeft === null) return 'text-muted-foreground';
    if (daysLeft <= 1) return 'text-red-500';
    if (daysLeft <= 3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getBorderColor = () => {
    if (daysLeft === null) return 'border-gray-200';
    if (daysLeft <= 1) return 'border-red-200';
    if (daysLeft <= 3) return 'border-amber-200';
    return 'border-gray-200';
  };

  const formatTimeLeft = () => {
    if (daysLeft === null) return 'No deadline';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    if (daysLeft < 0) return 'Expired';
    return `${daysLeft} days left`;
  };

  const invitedDate = new Date(deal.invited_at);
  const formattedInvitedDate = formatDistanceToNow(invitedDate, { addSuffix: true });

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      invited: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
      pending: 'Pending Review',
      invited: 'Awaiting Response',
      accepted: 'Accepted',
      declined: 'Declined',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };

    return (
      <Badge className={statusColors[deal.status]}>
        {statusLabels[deal.status]}
      </Badge>
    );
  };

  const brandProfile = deal.project?.brand_profile;

  return (
    <Card className={`transition-all duration-300 ${getBorderColor()} hover:shadow-md`}>
      <CardHeader 
        className="py-4 cursor-pointer flex flex-row items-center justify-between"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3 flex-1">
          {brandProfile?.logo_url ? (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              <img 
                src={brandProfile.logo_url} 
                alt={brandProfile.company_name}
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <span className="font-medium text-gray-500">
                {brandProfile?.company_name?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg">{deal.project?.name || 'Campaign Offer'}</CardTitle>
            <p className="text-sm text-muted-foreground">{brandProfile?.company_name || 'Unknown Brand'}</p>
            <div className="mt-1">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="font-bold text-lg flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {deal.deal_value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Your payment</p>
            <p className={`text-sm flex items-center gap-1 ${getTimeUrgencyColor()}`}>
              <Clock className="h-3.5 w-3.5" />
              {formatTimeLeft()}
            </p>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="pt-0 pb-2">
            <div className="space-y-4 border-t border-gray-100 pt-4">
              {deal.project?.description && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <ListChecks className="h-4 w-4" /> Campaign Description
                  </h4>
                  <p className="text-sm text-muted-foreground">{deal.project.description}</p>
                </div>
              )}
              
              {deal.project?.content_requirements && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4" /> Content Requirements
                  </h4>
                  <div className="space-y-2">
                    {deal.project.content_requirements.platforms && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Platforms:</p>
                        <div className="flex flex-wrap gap-1">
                          {deal.project.content_requirements.platforms.map((platform: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">{platform}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {deal.project.content_requirements.content_types && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Content Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {deal.project.content_requirements.content_types.map((type: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {deal.project?.deliverables && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <ListChecks className="h-4 w-4" /> Deliverables
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {deal.project.deliverables.posts_count && (
                      <p>• {deal.project.deliverables.posts_count} feed posts</p>
                    )}
                    {deal.project.deliverables.stories_count && (
                      <p>• {deal.project.deliverables.stories_count} stories</p>
                    )}
                    {deal.project.deliverables.reels_count && (
                      <p>• {deal.project.deliverables.reels_count} reels</p>
                    )}
                    {deal.project.deliverables.video_length_minutes && (
                      <p>• {deal.project.deliverables.video_length_minutes} minutes of video content</p>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 inline mr-1.5" />
                Invited {formattedInvitedDate}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-0 pb-4">
            <button 
              onClick={onViewDetails}
              className="text-sm font-medium text-primary hover:underline"
            >
              View details and respond
            </button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default SecureDealCard;