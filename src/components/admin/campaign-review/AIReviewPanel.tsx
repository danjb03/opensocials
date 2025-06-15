
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bot, Check, X, AlertTriangle, Loader, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIReviewPanelProps {
  campaignId: string;
  onReviewComplete: () => void;
}

interface CampaignDetail {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  budget: number;
  currency: string;
  content_requirements: any;
  review_status: string;
  brand_profiles?: {
    company_name: string;
    industry: string;
  } | null;
  campaign_reviews?: {
    id: string;
    ai_analysis: any;
    ai_score: number;
    ai_issues: any[];
    ai_recommendations: any[];
    ai_decision: string;
    human_decision: string;
    review_notes: string;
    reviewed_at: string;
  }[];
}

export function AIReviewPanel({ campaignId, onReviewComplete }: AIReviewPanelProps) {
  const [reviewNotes, setReviewNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-detail', campaignId],
    queryFn: async (): Promise<CampaignDetail | null> => {
      const { data, error } = await supabase
        .from('projects_new')
        .select(`
          *,
          brand_profiles!inner (
            company_name,
            industry
          ),
          campaign_reviews (
            id,
            ai_analysis,
            ai_score,
            ai_issues,
            ai_recommendations,
            ai_decision,
            human_decision,
            review_notes,
            reviewed_at
          )
        `)
        .eq('id', campaignId)
        .single();

      if (error) {
        console.error('Campaign detail query error:', error);
        throw error;
      }
      
      // Safely handle brand_profiles - it could be null, undefined, or an object
      let brandProfiles: { company_name: string; industry: string } | null = null;
      
      if (data?.brand_profiles && 
          typeof data.brand_profiles === 'object' && 
          'company_name' in data.brand_profiles &&
          'industry' in data.brand_profiles &&
          typeof data.brand_profiles.company_name === 'string' &&
          typeof data.brand_profiles.industry === 'string') {
        brandProfiles = {
          company_name: data.brand_profiles.company_name,
          industry: data.brand_profiles.industry
        };
      }
      
      return {
        ...data,
        brand_profiles: brandProfiles
      } as CampaignDetail;
    },
    enabled: !!campaignId,
  });

  const runAIAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('ai-campaign-review', {
        body: {
          campaignId,
          campaignData: {
            name: campaign?.name,
            description: campaign?.description,
            campaign_type: campaign?.campaign_type,
            budget: campaign?.budget,
            content_requirements: campaign?.content_requirements,
            brand: campaign?.brand_profiles,
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to run AI analysis');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-detail', campaignId] });
      toast.success('AI analysis completed successfully');
    },
    onError: (error) => {
      toast.error(`AI analysis failed: ${error.message}`);
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ decision, notes }: { decision: string; notes: string }) => {
      const reviewId = campaign?.campaign_reviews?.[0]?.id;
      
      if (!reviewId) {
        throw new Error('No review found for this campaign');
      }

      const { error } = await supabase
        .from('campaign_reviews')
        .update({
          human_decision: decision,
          review_notes: notes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Update project status
      const { error: projectError } = await supabase
        .from('projects_new')
        .update({
          review_status: decision === 'approved' ? 'approved' : 
                       decision === 'rejected' ? 'rejected' : 'needs_revision',
        })
        .eq('id', campaignId);

      if (projectError) throw projectError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-detail', campaignId] });
      onReviewComplete();
      toast.success('Review decision saved successfully');
      setReviewNotes('');
    },
    onError: (error) => {
      toast.error(`Failed to save review: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!campaign) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Campaign not found</p>
        </CardContent>
      </Card>
    );
  }

  const latestReview = campaign.campaign_reviews?.[0];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Campaign Analysis
          </CardTitle>
          <CardDescription>
            Automated review and compliance checking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!latestReview && (
            <Button 
              onClick={() => runAIAnalysisMutation.mutate()}
              disabled={runAIAnalysisMutation.isPending}
              className="w-full gap-2"
            >
              {runAIAnalysisMutation.isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Run AI Analysis
            </Button>
          )}

          {latestReview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span className="font-medium">AI Decision:</span>
                </div>
                <Badge variant={
                  latestReview.ai_decision === 'approved' ? 'default' :
                  latestReview.ai_decision === 'rejected' ? 'destructive' :
                  'secondary'
                }>
                  {latestReview.ai_decision}
                </Badge>
              </div>

              {latestReview.ai_score && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Confidence Score:</span>
                  <Badge variant="outline">
                    {(latestReview.ai_score * 100).toFixed(1)}%
                  </Badge>
                </div>
              )}

              {latestReview.ai_issues && latestReview.ai_issues.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Issues Found
                  </h4>
                  <div className="space-y-1">
                    {latestReview.ai_issues.map((issue: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground p-2 bg-orange-50 rounded">
                        {typeof issue === 'string' ? issue : issue.description || 'Unknown issue'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {latestReview.ai_recommendations && latestReview.ai_recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                  <div className="space-y-1">
                    {latestReview.ai_recommendations.map((rec: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground p-2 bg-blue-50 rounded">
                        {typeof rec === 'string' ? rec : rec.description || 'Unknown recommendation'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {latestReview && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Review</CardTitle>
            <CardDescription>
              Final human decision and notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add review notes..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
            />

            <Separator />

            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1 gap-2"
                onClick={() => updateReviewMutation.mutate({ decision: 'approved', notes: reviewNotes })}
                disabled={updateReviewMutation.isPending}
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => updateReviewMutation.mutate({ decision: 'rejected', notes: reviewNotes })}
                disabled={updateReviewMutation.isPending}
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => updateReviewMutation.mutate({ decision: 'needs_revision', notes: reviewNotes })}
              disabled={updateReviewMutation.isPending}
            >
              <AlertTriangle className="h-4 w-4" />
              Needs Revision
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
