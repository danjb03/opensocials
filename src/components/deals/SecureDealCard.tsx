
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, ChevronUp, Eye, Calendar, DollarSign, Target, Users } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface SecureDealCardProps {
  deal: {
    id: string;
    project_id: string;
    creator_id: string;
    deal_value: number;
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
  };
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to safely access JSON properties
  const getJsonProperty = (obj: Json, key: string): any => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return (obj as Record<string, any>)[key];
    }
    return undefined;
  };

  const getJsonArrayProperty = (obj: Json, key: string): any[] => {
    const value = getJsonProperty(obj, key);
    return Array.isArray(value) ? value : [];
  };

  // Parse content requirements safely
  const contentRequirements = deal.project?.content_requirements;
  const platforms = getJsonArrayProperty(contentRequirements, 'platforms');
  const contentTypes = getJsonArrayProperty(contentRequirements, 'content_types');

  // Parse deliverables safely
  const deliverables = deal.project?.deliverables;
  const postsCount = getJsonProperty(deliverables, 'posts_count') || 0;
  const storiesCount = getJsonProperty(deliverables, 'stories_count') || 0;
  const reelsCount = getJsonProperty(deliverables, 'reels_count') || 0;
  const videoLength = getJsonProperty(deliverables, 'video_length_minutes') || 0;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={deal.project?.brand_profile?.logo_url} alt={deal.project?.brand_profile?.company_name} />
              <AvatarFallback>
                {deal.project?.brand_profile?.company_name?.slice(0, 2).toUpperCase() || 'BR'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{deal.project?.name || 'Campaign Offer'}</h3>
              <p className="text-sm text-gray-600">
                from {deal.project?.brand_profile?.company_name || 'Brand'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(deal.status)}>
              {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="p-1"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold text-green-600">{formatCurrency(deal.deal_value)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Invited {formatDate(deal.invited_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="capitalize">{deal.project?.campaign_type || 'Campaign'}</span>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-3 border-t">
            {/* Campaign Description */}
            {deal.project?.description && (
              <div>
                <h4 className="font-medium mb-2">Campaign Description</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {deal.project.description}
                </p>
              </div>
            )}

            {/* Platforms & Content Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Platforms</h4>
                <div className="flex flex-wrap gap-1">
                  {platforms.length > 0 ? (
                    platforms.map((platform, index) => (
                      <Badge key={index} variant="outline" className="text-xs capitalize">
                        {platform}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Not specified</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Content Types</h4>
                <div className="flex flex-wrap gap-1">
                  {contentTypes.length > 0 ? (
                    contentTypes.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs capitalize">
                        {typeof type === 'string' ? type.replace('_', ' ') : type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="font-medium mb-2">Deliverables</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {postsCount > 0 && (
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{postsCount}</div>
                    <div className="text-xs text-gray-600">Posts</div>
                  </div>
                )}
                {storiesCount > 0 && (
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{storiesCount}</div>
                    <div className="text-xs text-gray-600">Stories</div>
                  </div>
                )}
                {reelsCount > 0 && (
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-600">{reelsCount}</div>
                    <div className="text-xs text-gray-600">Reels</div>
                  </div>
                )}
                {videoLength > 0 && (
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="text-lg font-bold text-orange-600">{videoLength}min</div>
                    <div className="text-xs text-gray-600">Video</div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {(deal.project?.start_date || deal.project?.end_date) && (
              <div>
                <h4 className="font-medium mb-2">Timeline</h4>
                <div className="flex gap-4 text-sm">
                  {deal.project.start_date && (
                    <div>
                      <span className="text-gray-600">Start: </span>
                      <span className="font-medium">{formatDate(deal.project.start_date)}</span>
                    </div>
                  )}
                  {deal.project.end_date && (
                    <div>
                      <span className="text-gray-600">End: </span>
                      <span className="font-medium">{formatDate(deal.project.end_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <Button 
                onClick={onViewDetails}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Eye className="h-4 w-4" />
                View Full Details & Respond
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecureDealCard;
