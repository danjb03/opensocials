
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
  ChevronUp,
  Star,
  Zap
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
          <Badge className="bg-green-600 text-white hover:bg-green-700 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge className="bg-red-600 text-white hover:bg-red-700 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending Response
          </Badge>
        );
    }
  };

  const isExclusive = invitation.campaign_details.exclusivity;
  const isHighValue = invitation.agreed_amount >= 3000;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-gray-800 bg-gradient-to-br from-card to-muted/20 relative overflow-hidden">
      {/* Exclusive Campaign Indicator */}
      {isExclusive && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-purple-600 text-white border-purple-600">
            <Star className="h-3 w-3 mr-1" />
            Exclusive
          </Badge>
        </div>
      )}

      {/* High Value Indicator */}
      {isHighValue && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-orange-600 text-white border-orange-600">
            <Zap className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-border">
              <AvatarImage src={invitation.brand_logo} alt={invitation.brand_name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                {invitation.project_name}
              </h3>
              <p className="text-muted-foreground font-medium">
                by {invitation.brand_name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(invitation.invitation_date), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          {getStatusBadge(invitation.status)}
        </div>

        {/* Campaign Value Highlight */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {invitation.currency} {invitation.agreed_amount.toLocaleString()}
                </p>
                <p className="text-sm text-green-400">Campaign Value</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Payment on</p>
              <p className="text-sm font-medium text-white">Completion</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/50">
            <Video className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {invitation.content_requirements.posts_count} Posts
              </p>
              <p className="text-xs text-muted-foreground">Required</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/50">
            <Users className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {invitation.content_requirements.platforms.length} Platform{invitation.content_requirements.platforms.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                {invitation.content_requirements.platforms.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Objective Preview */}
        <div className="bg-muted/5 p-4 rounded-lg border border-border/30">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-white mb-1">Campaign Objective</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {invitation.campaign_details.objective}
              </p>
            </div>
          </div>
        </div>

        {/* Brand Message */}
        {invitation.notes && (
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg">
            <p className="text-sm text-blue-200 italic leading-relaxed">
              "{invitation.notes}"
            </p>
          </div>
        )}

        {/* Expandable Details */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-between p-3 h-auto text-muted-foreground hover:text-white hover:bg-muted/10 transition-all"
          >
            <span className="font-medium">View Campaign Details</span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showDetails && (
            <div className="space-y-4 animate-fade-in">
              <Separator className="bg-border/50" />
              
              {/* Timeline */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-white">Timeline</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6 leading-relaxed">
                  {invitation.campaign_details.timeline}
                </p>
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-white">Deliverables</span>
                </div>
                <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                  {invitation.campaign_details.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Requirements */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-purple-400" />
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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
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
      </CardContent>

      {invitation.status === 'invited' && (
        <CardFooter className="pt-4 gap-3 bg-muted/5">
          <Button
            onClick={() => onDecline(invitation.id)}
            variant="outline"
            className="flex-1 border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600 transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Decline'}
          </Button>
          <Button
            onClick={() => onAccept(invitation.id)}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Accept Campaign'}
          </Button>
        </CardFooter>
      )}

      {invitation.status === 'accepted' && (
        <CardFooter className="pt-4 bg-muted/5">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all">
            Start Campaign
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
