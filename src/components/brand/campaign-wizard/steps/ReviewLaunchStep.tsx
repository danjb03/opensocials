import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Rocket, Calendar, DollarSign, Users, Target, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CampaignWizardData } from '@/types/campaignWizard';

interface ReviewLaunchStepProps {
  data?: Partial<CampaignWizardData>;
  onBack?: () => void;
  onLaunch: () => void;
  isSubmitting?: boolean;
}

// Hook to fetch creator details
const useCreatorDetails = (creatorIds: string[]) => {
  return useQuery({
    queryKey: ['creator-details', creatorIds],
    queryFn: async () => {
      if (creatorIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('creator_profiles')
        .select(`
          id,
          user_id,
          name,
          email,
          instagram_handle,
          tiktok_handle,
          youtube_handle,
          primary_platform,
          profiles!creator_profiles_user_id_fkey (
            avatar_url,
            full_name
          )
        `)
        .in('user_id', creatorIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: creatorIds.length > 0
  });
};

const ReviewLaunchStep: React.FC<ReviewLaunchStepProps> = ({
  data,
  onBack,
  onLaunch,
  isSubmitting
}) => {

  const selectedCreators = data?.selected_creators || [];
  const totalCreatorBudget = selectedCreators.reduce((sum, creator) => sum + creator.individual_budget, 0);
  
  // Fetch creator details
  const creatorIds = selectedCreators.map(c => c.creator_id);
  const { data: creatorDetails, isLoading: creatorsLoading } = useCreatorDetails(creatorIds);
  
  if (!data) return null;
  
  // Calculate budget breakdown with 25% margin system
  const totalGrossBudget = data.total_budget || 0;
  const platformMargin = totalGrossBudget * 0.25;
  const totalNetBudget = totalGrossBudget - platformMargin;
  const estimatedReach = selectedCreators.length * 50000; // Mock calculation
  const campaignDuration = data.timeline?.start_date && data.timeline?.end_date 
    ? Math.ceil((data.timeline.end_date.getTime() - data.timeline.start_date.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const readinessChecks = [
    {
      label: 'Campaign details complete',
      complete: !!(data.name && data.objective && data.description),
      icon: <Target className="h-4 w-4" />
    },
    {
      label: 'Content requirements defined',
      complete: !!(data.content_requirements?.platforms?.length && data.content_requirements?.content_types?.length),
      icon: <Target className="h-4 w-4" />
    },
    {
      label: 'Budget and timeline set',
      complete: !!(data.total_budget && data.timeline?.start_date && data.timeline?.end_date),
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      label: 'Creators selected',
      complete: selectedCreators.length > 0,
      icon: <Users className="h-4 w-4" />
    }
  ];

  const allChecksComplete = readinessChecks.every(check => check.complete);

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />Review & Launch Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Readiness Checklist */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Launch Readiness</h3>
            <div className="space-y-2">
              {readinessChecks.map((check, index) => (
                <div key={index} className="flex items-center gap-3">
                  {check.complete ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className={check.complete ? 'text-gray-900' : 'text-gray-600'}>
                    {check.label}
                  </span>
                  {check.complete && <Badge variant="secondary" className="ml-auto">Complete</Badge>}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Campaign Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Campaign Details</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campaign Name</Label>
                  <p className="font-medium">{data.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Objective</Label>
                  <Badge variant="outline" className="ml-2">
                    {data.objective?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Campaign Type</Label>
                  <p className="font-medium">{data.campaign_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm text-gray-700 line-clamp-3">{data.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Timeline & Budget</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Duration</Label>
                    <p className="font-medium">
                      {data.timeline?.start_date && data.timeline?.end_date ? (
                        <>
                          {format(data.timeline.start_date, 'MMM d')} - {format(data.timeline.end_date, 'MMM d, yyyy')}
                          <span className="text-sm text-gray-500 ml-2">({campaignDuration} days)</span>
                        </>
                      ) : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total Budget</Label>
                    <p className="font-medium">${(data.total_budget || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Estimated Reach</Label>
                    <p className="font-medium">{estimatedReach.toLocaleString()} people</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Content Requirements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Content Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Platforms</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.content_requirements?.platforms?.map(platform => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Content Types</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.content_requirements?.content_types?.map(type => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Deliverables</Label>
              <div className="flex gap-4 mt-1 text-sm">
                <span>{data.deliverables?.posts_count || 0} posts</span>
                {(data.deliverables?.stories_count || 0) > 0 && (
                  <span>{data.deliverables.stories_count} stories</span>
                )}
                {(data.deliverables?.reels_count || 0) > 0 && (
                  <span>{data.deliverables.reels_count} reels</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Selected Creators */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Selected Creators ({selectedCreators.length})</h3>
            {creatorsLoading ? (
              <div className="space-y-3">
                {[...Array(selectedCreators.length)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCreators.map(creatorData => {
                  const creator = creatorDetails?.find(c => c.user_id === creatorData.creator_id);
                  const creatorName = creator?.profiles?.full_name || creator?.name || 'Unknown Creator';
                  const creatorHandle = creator?.instagram_handle 
                    ? `@${creator.instagram_handle}` 
                    : creator?.tiktok_handle 
                    ? `@${creator.tiktok_handle}` 
                    : creator?.youtube_handle 
                    ? `@${creator.youtube_handle}`
                    : '@creator';
                  
                  return (
                    <div key={creatorData.creator_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={creator?.profiles?.avatar_url} alt={creatorName} />
                          <AvatarFallback>{creatorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{creatorName}</p>
                          <p className="text-sm text-gray-600">{creatorHandle}</p>
                          <p className="text-xs text-blue-600 capitalize">{creator?.primary_platform || 'Multi-platform'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${creatorData.individual_budget}</p>
                        <p className="text-sm text-gray-600">creator payout</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Budget Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Budget Breakdown</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Campaign Budget:</span>
                <span className="font-medium">${totalGrossBudget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  Platform Margin (25%):
                  <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">includes fees & support</span>
                </span>
                <span>-${platformMargin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Creator Pool Budget:</span>
                <span className="font-medium text-green-600">${totalNetBudget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Currently Allocated:</span>
                <span>${totalCreatorBudget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining for Rolling Invites:</span>
                <span className="font-medium text-blue-600">${(totalNetBudget - totalCreatorBudget).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total Investment:</span>
                <span>${totalGrossBudget.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span><strong>Rolling Creator System:</strong> You can invite additional creators later if some decline or if you want to expand reach, using your remaining budget pool.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />What Happens Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">1</div>
              <p>Selected creators will receive campaign invitations immediately</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">2</div>
              <p>Creators have 48 hours to accept or decline the collaboration</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">3</div>
              <p>You'll receive notifications as creators respond to your campaign</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">4</div>
              <p>Campaign tracking and analytics become available once creators start posting</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onLaunch}
          disabled={!allChecksComplete || isSubmitting}
          className="flex items-center gap-2"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Launching Campaign...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Launch Campaign
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Helper component for labels
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span className={`text-sm font-medium text-gray-600 ${className}`}>{children}</span>
);

export default ReviewLaunchStep;