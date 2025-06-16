
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Calendar, DollarSign, Target, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/project';
import { R4ReviewInterface } from './R4ReviewInterface';

interface CampaignForReview {
  id: string;
  name: string;
  brand_id: string;
  campaign_type: string;
  budget: number;
  currency: string;
  status: string;
  review_status: string;
  created_at: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  content_requirements?: any;
  platforms?: string[];
  brand_profiles?: {
    company_name: string;
  } | null;
}

interface CampaignReviewModalProps {
  campaign: CampaignForReview;
  open: boolean;
  onClose: () => void;
  onReviewComplete: () => void;
}

export function CampaignReviewModal({ campaign, open, onClose, onReviewComplete }: CampaignReviewModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleReviewDecision = async (decision: 'approved' | 'rejected' | 'needs_revision') => {
    // Here you would implement the logic to update the campaign review status
    console.log('Review decision:', decision, 'for campaign:', campaign.id);
    onReviewComplete();
  };

  const formatContentRequirements = () => {
    if (!campaign.content_requirements) return 'No specific requirements';
    
    const requirements = [];
    if (campaign.content_requirements.videos?.quantity) {
      requirements.push(`${campaign.content_requirements.videos.quantity} videos`);
    }
    if (campaign.content_requirements.posts?.quantity) {
      requirements.push(`${campaign.content_requirements.posts.quantity} posts`);
    }
    if (campaign.content_requirements.stories?.quantity) {
      requirements.push(`${campaign.content_requirements.stories.quantity} stories`);
    }
    
    return requirements.length > 0 ? requirements.join(', ') : 'Custom requirements';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Review: {campaign.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Creator View</TabsTrigger>
            <TabsTrigger value="r4-review" className="gap-2">
              <Bot className="h-4 w-4" />
              R4 Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Campaign Overview as Creator Would See It */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{campaign.name}</CardTitle>
                      <CardDescription>
                        by {campaign.brand_profiles?.company_name || 'Unknown Brand'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {campaign.campaign_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {campaign.description || 'No description provided for this campaign.'}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(campaign.budget, campaign.currency)}
                    </div>
                    <p className="text-xs text-muted-foreground">Total campaign budget</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Content Required</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{formatContentRequirements()}</div>
                    <p className="text-xs text-muted-foreground">Deliverables needed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Timeline</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-bold">
                      {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'TBD'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      to {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'TBD'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platforms</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {campaign.platforms && campaign.platforms.length > 0 ? (
                        campaign.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Requirements Detail */}
              {campaign.content_requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Content Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(campaign.content_requirements).map(([type, details]: [string, any]) => (
                        <div key={type} className="flex items-center justify-between p-2 border rounded">
                          <span className="capitalize font-medium">{type}</span>
                          <span className="text-muted-foreground">
                            {details.quantity || 'Custom'} {details.quantity === 1 ? 'piece' : 'pieces'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Manual Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Review Decision</CardTitle>
                <CardDescription>
                  Make your review decision for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleReviewDecision('approved')}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Campaign
                  </Button>
                  <Button 
                    onClick={() => handleReviewDecision('needs_revision')}
                    variant="outline"
                    className="gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Needs Revision
                  </Button>
                  <Button 
                    onClick={() => handleReviewDecision('rejected')}
                    variant="destructive"
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="r4-review">
            <R4ReviewInterface campaign={campaign} onReviewComplete={onReviewComplete} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
