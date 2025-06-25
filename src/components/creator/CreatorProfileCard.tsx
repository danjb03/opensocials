
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  Instagram,
  Youtube,
  Linkedin,
  ExternalLink,
  Verified,
  Star
} from 'lucide-react';
import { useInsightIQData } from '@/hooks/useInsightIQData';

interface CreatorProfileCardProps {
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    primaryPlatform?: string;
    platforms?: string[];
    industries?: string[];
    audienceLocation?: {
      primary?: string;
    };
    followerCount?: number;
    engagementRate?: number;
    creatorType?: string;
  };
  onInvite?: (creatorId: string) => void;
  onViewProfile?: (creatorId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const CreatorProfileCard = ({ 
  creator, 
  onInvite, 
  onViewProfile, 
  showActions = true,
  compact = false 
}: CreatorProfileCardProps) => {
  const { data: analyticsData } = useInsightIQData(creator.id);
  
  // Get the best analytics data available
  const getAnalyticsForPlatform = (platform: string) => {
    return analyticsData?.find(data => 
      data.platform.toLowerCase() === platform.toLowerCase()
    );
  };

  const getPrimaryAnalytics = () => {
    if (!analyticsData?.length) return null;
    
    // Try to get analytics for primary platform first
    if (creator.primaryPlatform) {
      const primaryData = getAnalyticsForPlatform(creator.primaryPlatform);
      if (primaryData) return primaryData;
    }
    
    // Fall back to first available analytics
    return analyticsData[0];
  };

  const primaryAnalytics = getPrimaryAnalytics();
  
  const formatNumber = (num: number | null | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      case 'linkedin':
        return Linkedin;
      default:
        return ExternalLink;
    }
  };

  // Use analytics data first, then fallback to creator data
  const followerCount = primaryAnalytics?.follower_count || creator.followerCount || 0;
  const engagementRate = primaryAnalytics?.engagement_rate || creator.engagementRate || 0;
  const avgViews = primaryAnalytics?.average_views;
  const avgLikes = primaryAnalytics?.average_likes;
  const isVerified = primaryAnalytics?.is_verified;
  const credibilityScore = primaryAnalytics?.credibility_score;

  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-card via-card to-card/95 border-border/50 hover:border-white/20 ${compact ? 'max-w-sm' : 'max-w-md'}`}>
      {/* Header with background pattern */}
      <div className="relative bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-indigo-900/20 p-6 pb-4">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
        
        {/* Profile Image and Basic Info */}
        <div className="relative flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center overflow-hidden">
              {creator.avatarUrl ? (
                <img 
                  src={creator.avatarUrl} 
                  alt={`${creator.firstName} ${creator.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {creator.firstName?.charAt(0)}{creator.lastName?.charAt(0)}
                </span>
              )}
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-card">
                <Verified className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-white truncate">
                {creator.firstName} {creator.lastName}
              </h3>
              {credibilityScore && credibilityScore > 80 && (
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-yellow-300">
                    {Math.round(credibilityScore)}
                  </span>
                </div>
              )}
            </div>
            
            {creator.username && (
              <p className="text-sm text-blue-300 mb-2">@{creator.username}</p>
            )}
            
            {creator.audienceLocation?.primary && (
              <div className="flex items-center gap-1 text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{creator.audienceLocation.primary}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Bio */}
        {creator.bio && !compact && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {creator.bio}
          </p>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatNumber(followerCount)}
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Engagement</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {engagementRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Extended Analytics (if available) */}
        {!compact && (avgViews || avgLikes) && (
          <div className="grid grid-cols-2 gap-3">
            {avgViews && (
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-muted-foreground">Avg Views</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatNumber(avgViews)}
                </p>
              </div>
            )}
            
            {avgLikes && (
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-muted-foreground">Avg Likes</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatNumber(avgLikes)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Platforms */}
        {creator.platforms && creator.platforms.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Platforms</span>
            <div className="flex flex-wrap gap-2">
              {creator.platforms.slice(0, 3).map((platform) => {
                const Icon = getPlatformIcon(platform);
                const platformData = getAnalyticsForPlatform(platform);
                
                return (
                  <div 
                    key={platform}
                    className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border border-border/50"
                  >
                    <Icon className="w-3 h-3 text-foreground" />
                    <span className="text-xs font-medium text-foreground capitalize">
                      {platform}
                    </span>
                    {platformData?.follower_count && (
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(platformData.follower_count)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Industries/Categories */}
        {creator.industries && creator.industries.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Industries</span>
            <div className="flex flex-wrap gap-1">
              {creator.industries.slice(0, compact ? 2 : 3).map((industry) => (
                <Badge 
                  key={industry} 
                  variant="secondary" 
                  className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  {industry}
                </Badge>
              ))}
              {creator.industries.length > (compact ? 2 : 3) && (
                <Badge variant="outline" className="text-xs border-border/50">
                  +{creator.industries.length - (compact ? 2 : 3)} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Creator Type */}
        {creator.creatorType && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Creator Type</span>
            <Badge variant="outline" className="text-xs font-medium border-border/50">
              {creator.creatorType}
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onViewProfile && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewProfile(creator.id)}
                className="flex-1 text-xs border-border/50 hover:border-white/50"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Profile
              </Button>
            )}
            {onInvite && (
              <Button 
                size="sm" 
                onClick={() => onInvite(creator.id)}
                className="flex-1 bg-white text-black hover:bg-gray-100 text-xs font-semibold"
              >
                Invite Creator
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatorProfileCard;
