
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  Target,
  Users,
  Video,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MockInvitation } from '@/hooks/useInvitationSimulation';

interface MockInvitationCardProps {
  invitation: MockInvitation;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  isLoading?: boolean;
}

export const MockInvitationCard: React.FC<MockInvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
  isLoading = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Response
          </Badge>
        );
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={invitation.brand_logo} alt={invitation.brand_name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-white">{invitation.project_name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                from {invitation.brand_name}
              </p>
            </div>
          </div>
          {getStatusBadge(invitation.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Budget */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-white text-lg">
            {invitation.currency} {invitation.agreed_amount.toLocaleString()}
          </span>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">
              {invitation.content_requirements.posts_count} posts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-muted-foreground">
              {invitation.content_requirements.platforms.join(', ')}
            </span>
          </div>
        </div>

        {/* Campaign Notes */}
        {invitation.notes && (
          <div className="bg-muted/20 p-3 rounded-md">
            <p className="text-sm text-muted-foreground italic">
              "{invitation.notes}"
            </p>
          </div>
        )}

        {/* Expandable Details */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-between p-2 h-auto text-muted-foreground hover:text-white"
          >
            <span>Campaign Details</span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showDetails && (
            <div className="space-y-4 pt-2">
              <Separator />
              
              {/* Objective */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-white">Campaign Objective</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {invitation.campaign_details.objective}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-white">Timeline</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {invitation.campaign_details.timeline}
                </p>
              </div>

              {/* Deliverables */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-white">Deliverables</span>
                </div>
                <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                  {invitation.campaign_details.deliverables.map((deliverable, index) => (
                    <li key={index}>• {deliverable}</li>
                  ))}
                </ul>
              </div>

              {/* Content Requirements */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-white">Content Requirements</span>
                </div>
                <div className="ml-6 space-y-1 text-sm text-muted-foreground">
                  <p>Platforms: {invitation.content_requirements.platforms.join(', ')}</p>
                  {invitation.content_requirements.video_length && (
                    <p>Video length: {invitation.content_requirements.video_length}</p>
                  )}
                  {invitation.content_requirements.hashtags && (
                    <p>Hashtags: {invitation.content_requirements.hashtags.join(', ')}</p>
                  )}
                  {invitation.content_requirements.mentions && (
                    <p>Mentions: {invitation.content_requirements.mentions.join(', ')}</p>
                  )}
                </div>
              </div>

              {/* Usage Rights */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-white">Usage Rights & Terms</span>
                </div>
                <div className="ml-6 space-y-1 text-sm text-muted-foreground">
                  <p>Usage rights: {invitation.campaign_details.usage_rights}</p>
                  <p>Exclusivity: {invitation.campaign_details.exclusivity ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invitation Date */}
        <div className="text-xs text-muted-foreground">
          Invited {format(new Date(invitation.invitation_date), 'MMM d, yyyy at h:mm a')}
          {invitation.response_date && (
            <span>
              {' • '} Responded {format(new Date(invitation.response_date), 'MMM d, yyyy at h:mm a')}
            </span>
          )}
        </div>
      </CardContent>

      {invitation.status === 'invited' && (
        <CardFooter className="pt-4 gap-3">
          <Button
            onClick={() => onDecline(invitation.id)}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Decline'}
          </Button>
          <Button
            onClick={() => onAccept(invitation.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Accept Campaign'}
          </Button>
        </CardFooter>
      )}

      {invitation.status === 'accepted' && (
        <CardFooter className="pt-4">
          <Button className="w-full" variant="default">
            Start Campaign
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
