
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
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Awaiting Response
          </Badge>
        );
    }
  };

  const isExclusive = invitation.campaign_details.exclusivity;
  const isHighValue = invitation.agreed_amount >= 3000;

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Exclusive Campaign Glow */}
      {isExclusive && (
        <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
      )}

      {/* Premium Campaign Indicator */}
      {isHighValue && (
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce-in">
            <Zap className="h-3 w-3" />
            Premium Campaign
          </div>
        </div>
      )}

      {/* Exclusive Badge */}
      {isExclusive && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            <Star className="h-3 w-3" />
            Exclusive
          </div>
        </div>
      )}

      <CardHeader className="pb-4 space-y-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-white/20 shadow-xl transition-all duration-300 group-hover:ring-white/40 group-hover:shadow-2xl">
                <AvatarImage src={invitation.brand_logo} alt={invitation.brand_name} />
                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white">
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                {invitation.project_name}
              </h3>
              <p className="text-gray-300 font-medium">
                by {invitation.brand_name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                {format(new Date(invitation.invitation_date), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          {getStatusBadge(invitation.status)}
        </div>

        {/* Enhanced Campaign Value */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/20 p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 animate-shimmer" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {invitation.currency} {invitation.agreed_amount.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-400 font-medium">Total Campaign Value</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Payment Schedule</p>
              <p className="text-sm font-medium text-white">Upon Completion</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="group/stat flex items-center gap-3 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg">
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover/stat:bg-blue-500/30 transition-colors">
              <Video className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {invitation.content_requirements.posts_count} Posts
              </p>
              <p className="text-xs text-blue-300">Content Required</p>
            </div>
          </div>
          <div className="group/stat flex items-center gap-3 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg">
            <div className="p-2 bg-purple-500/20 rounded-lg group-hover/stat:bg-purple-500/30 transition-colors">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {invitation.content_requirements.platforms.length} Platform{invitation.content_requirements.platforms.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-purple-300">
                {invitation.content_requirements.platforms.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Campaign Objective */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4 rounded-xl border border-orange-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
              <Target className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Campaign Objective</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {invitation.campaign_details.objective}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Brand Message */}
        {invitation.notes && (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 p-4 rounded-xl">
            <div className="absolute top-2 right-2">
              <Eye className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="text-sm text-indigo-200 italic leading-relaxed font-medium">
              "{invitation.notes}"
            </p>
          </div>
        )}

        {/* Enhanced Expandable Details */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-between p-4 h-auto text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl group/expand"
          >
            <span className="font-medium">Campaign Details</span>
            <div className={`transition-transform duration-300 ${showDetails ? 'rotate-180' : ''} group-hover/expand:scale-110`}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>

          {showDetails && (
            <div className="space-y-4 animate-fade-in">
              <Separator className="bg-white/10" />
              
              {/* Timeline */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-white">Timeline</span>
                </div>
                <p className="text-sm text-gray-300 ml-6 leading-relaxed">
                  {invitation.campaign_details.timeline}
                </p>
              </div>

              {/* Deliverables */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-white">Deliverables</span>
                </div>
                <ul className="text-sm text-gray-300 ml-6 space-y-1">
                  {invitation.campaign_details.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1 text-xs">●</span>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Requirements */}
              <div className="space-y-2 p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl">
                <div className="flex items-center gap-2">
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
              <div className="space-y-2 p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-white">Usage Rights & Terms</span>
                </div>
                <div className="ml-6 space-y-1 text-sm text-gray-300">
                  <p>Usage rights: {invitation.campaign_details.usage_rights}</p>
                  <p>Exclusivity: {invitation.campaign_details.exclusivity ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {invitation.status === 'invited' && (
        <CardFooter className="pt-4 gap-3 bg-gradient-to-r from-gray-900/20 to-gray-800/20 backdrop-blur-sm border-t border-white/10">
          <Button
            onClick={() => onDecline(invitation.id)}
            variant="outline"
            className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Decline'}
          </Button>
          <Button
            onClick={() => onAccept(invitation.id)}
            className="flex-1 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 group/accept"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (
              <>
                Accept Campaign
                <ArrowRight className="ml-2 h-4 w-4 group-hover/accept:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </CardFooter>
      )}

      {invitation.status === 'accepted' && (
        <CardFooter className="pt-4 bg-gradient-to-r from-gray-900/20 to-gray-800/20 backdrop-blur-sm border-t border-white/10">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 group/start">
            Start Campaign
            <ArrowRight className="ml-2 h-4 w-4 group-hover/start:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
