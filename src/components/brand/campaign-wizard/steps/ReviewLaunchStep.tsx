
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, ArrowRight, Users, Calendar, DollarSign, Target, Rocket } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';
import { supabase } from '@/integrations/supabase/client';

interface ReviewLaunchStepProps {
  data: CampaignWizardData;
  onBack: () => void;
  onComplete: () => Promise<void>;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

interface CreatorDetail {
  user_id: string;
  display_name?: string;
  primary_platform?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
}

const ReviewLaunchStep: React.FC<ReviewLaunchStepProps> = ({
  data,
  onBack,
  onComplete,
  isLoading,
  isSubmitting
}) => {
  const [isLaunching, setIsLaunching] = useState(false);

  // Extract creator IDs from selected_creators
  const creatorIds = Array.isArray(data.selected_creators) 
    ? data.selected_creators.map(creator => 
        typeof creator === 'string' ? creator : creator.creator_id
      ).filter(Boolean)
    : [];

  // Fetch creators if any are selected
  const { data: selectedCreators } = useQuery({
    queryKey: ['selected-creators', creatorIds],
    queryFn: async (): Promise<CreatorDetail[]> => {
      if (creatorIds.length === 0) {
        return [];
      }

      const { data: creators, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          avatar_url,
          bio,
          primary_platform
        `)
        .in('id', creatorIds);

      if (error) throw error;
      
      return (creators || []).map(profile => ({
        user_id: profile.id,
        display_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Creator',
        primary_platform: profile.primary_platform || 'Multi-platform',
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        email: profile.email
      }));
    },
    enabled: creatorIds.length > 0
  });

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      await onComplete();
    } finally {
      setIsLaunching(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const campaignName = data.campaign_name || data.name || 'Untitled Campaign';
  const budget = data.total_budget || data.budget || 0;
  const currency = data.currency || 'USD';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Rocket className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Review & Launch Campaign</h2>
        <p className="text-gray-600">
          Review all campaign details before launching. Once launched, invitations will be sent to selected creators.
        </p>
      </div>

      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{campaignName}</h3>
              <p className="text-gray-600">{data.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Campaign Type:</span>
                <Badge variant="outline">{data.campaign_type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Objective:</span>
                <Badge variant="secondary">{data.objective}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">{data.start_date ? formatDate(data.start_date) : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium">{data.end_date ? formatDate(data.end_date) : 'Not set'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Budget:</span>
              <span className="font-medium text-lg">{formatCurrency(budget, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Currency:</span>
              <span className="font-medium">{currency}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Content Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Platforms</h4>
            <div className="flex flex-wrap gap-2">
              {data.content_requirements?.platforms?.map((platform) => (
                <Badge key={platform} variant="outline" className="capitalize">
                  {platform}
                </Badge>
              )) || <span className="text-gray-500">No platforms specified</span>}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Content Types</h4>
            <div className="flex flex-wrap gap-2">
              {data.content_requirements?.content_types?.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type.replace('_', ' ')}
                </Badge>
              )) || <span className="text-gray-500">No content types specified</span>}
            </div>
          </div>

          {data.messaging_guidelines && (
            <div>
              <h4 className="font-medium mb-2">Messaging Guidelines</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                {data.messaging_guidelines}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deliverables */}
      {data.deliverables && (
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.deliverables.posts_count > 0 && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{data.deliverables.posts_count}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
              )}
              {data.deliverables.stories_count && data.deliverables.stories_count > 0 && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{data.deliverables.stories_count}</div>
                  <div className="text-sm text-gray-600">Stories</div>
                </div>
              )}
              {data.deliverables.reels_count && data.deliverables.reels_count > 0 && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{data.deliverables.reels_count}</div>
                  <div className="text-sm text-gray-600">Reels</div>
                </div>
              )}
              {data.deliverables.video_length_minutes && data.deliverables.video_length_minutes > 0 && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{data.deliverables.video_length_minutes}min</div>
                  <div className="text-sm text-gray-600">Video Content</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Creators */}
      {selectedCreators && selectedCreators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selected Creators ({selectedCreators.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedCreators.map((creator) => (
                <div key={creator.user_id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.avatar_url} alt={creator.display_name} />
                    <AvatarFallback>{creator.display_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{creator.display_name}</h4>
                    <p className="text-sm text-gray-600">{creator.primary_platform}</p>
                  </div>
                  <Badge variant="outline">{creator.primary_platform}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLaunching || isSubmitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleLaunch}
          disabled={isLaunching || isLoading || isSubmitting}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLaunching || isSubmitting ? 'Launching...' : 'Launch Campaign'}
          <Rocket className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewLaunchStep;
