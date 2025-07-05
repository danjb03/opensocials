
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
  Zap,
  Eye,
  ArrowRight
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
          <Badge className="bg-emerald-500 text-white border-0 hover:bg-emerald-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge className="bg-red-500 text-white border-0 hover:bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500 text-white border-0 hover:bg-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending Response
          </Badge>
        );
    }
  };

  const isExclusive = invitation.campaign_details.exclusivity;
  const isHighValue = invitation.agreed_amount >= 3000;

  return (
    <Card className="bg-black border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        {/* Header with Brand Info and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={invitation.brand_logo} alt={invitation.brand_name} />
              <AvatarFallback className="bg-gray-800 text-white">
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {invitation.project_name}
              </h3>
              <p className="text-gray-400 text-sm">
                from {invitation.brand_name}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(invitation.status)}
            {isExclusive && (
              <Badge className="bg-purple-600 text-white border-0 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Exclusive
              </Badge>
            )}
            {isHighValue && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Campaign Value */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {invitation.currency} {invitation.agreed_amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Campaign Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-2 border border-gray-800">
            <Video className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {invitation.content_requirements.posts_count} Posts
              </p>
              <p className="text-xs text-gray-400">Required</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-2 border border-gray-800">
            <Users className="h-4 w-4 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {invitation.content_requirements.platforms.join(', ')}
              </p>
              <p className="text-xs text-gray-400">Platforms</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Campaign Objective */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-white mb-1">Campaign Objective</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {invitation.campaign_details.objective}
              </p>
            </div>
          </div>
        </div>

        {/* Brand Message */}
        {invitation.notes && (
          <div className="bg-gray-900 rounded-lg p-4 mb-4 border-l-4 border-blue-500 border border-gray-800">
            <div className="flex items-start gap-2">
              <Eye className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-300 italic">
                "{invitation.notes}"
              </p>
            </div>
          </div>
        )}

        {/* Expandable Details */}
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-700 hover:border-gray-600"
        >
          <span>Campaign Details</span>
          {showDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {showDetails && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <Separator className="bg-gray-700" />
            
            {/* Timeline */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-white">Timeline</span>
              </div>
              <p className="text-sm text-gray-300 ml-6">
                {invitation.campaign_details.timeline}
              </p>
            </div>

            {/* Deliverables */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="font-medium text-white">Deliverables</span>
              </div>
              <ul className="text-sm text-gray-300 ml-6 space-y-1">
                {invitation.campaign_details.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1 text-xs">•</span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Requirements */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-white">Content Requirements</span>
              </div>
              <div className="ml-6 space-y-1 text-sm text-gray-300">
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
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-white">Usage Rights</span>
              </div>
              <div className="ml-6 space-y-1 text-sm text-gray-300">
                <p>Usage rights: {invitation.campaign_details.usage_rights}</p>
                <p>Exclusivity: {invitation.campaign_details.exclusivity ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Invitation Date */}
            <div className="text-xs text-gray-500 text-center pt-2">
              Invited {format(new Date(invitation.invitation_date), 'MMM d, yyyy')}
            </div>
          </div>
        )}
      </CardContent>

      {invitation.status === 'invited' && (
        <CardFooter className="pt-4 gap-3 bg-gray-900/50 border-t border-gray-800">
          <Button
            onClick={() => onDecline(invitation.id)}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Decline'}
          </Button>
          <Button
            onClick={() => onAccept(invitation.id)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (
              <>
                Accept Campaign
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      )}

      {invitation.status === 'accepted' && (
        <CardFooter className="pt-4 bg-gray-900/50 border-t border-gray-800">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300">
            Start Campaign
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
