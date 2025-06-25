
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ArrowRight, Search } from 'lucide-react';
import { useDraftCampaigns } from '@/hooks/brand/useDraftCampaigns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { CampaignSearch } from '@/components/brand/campaigns/CampaignSearch';

const BrandCampaigns = () => {
  const navigate = useNavigate();
  const { draftCampaigns, isLoading, error, refetch } = useDraftCampaigns();
  const [showSearch, setShowSearch] = useState(false);

  const handleContinueDraft = (campaignId: string) => {
    navigate(`/brand/create-campaign?draft=${campaignId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Campaigns</h2>
          <p className="text-muted-foreground mb-4">We encountered an issue loading your draft campaigns.</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Draft Campaigns</h1>
            <p className="text-muted-foreground">Create and manage your campaign drafts. Once published, campaigns move to Orders for review.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSearch(true)}>
              <Search className="h-4 w-4 mr-2" />
              Find Missing Campaigns
            </Button>
            <Button onClick={() => navigate('/brand/create-campaign')} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Campaign Workflow</h3>
                <p className="text-blue-700 text-sm">
                  Draft campaigns are saved here until you're ready to publish. Once published, campaigns move to the 
                  <span className="font-medium"> Orders tab</span> where they undergo review before going live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Draft Campaigns Grid */}
        {draftCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {campaign.campaign_type} • Step {campaign.current_step}/5
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Draft
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{campaign.currency} {campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{new Date(campaign.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleContinueDraft(campaign.id)}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Continue Editing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No draft campaigns"
            description="Get started by creating your first campaign. Draft campaigns are saved here until you're ready to publish them."
            className="animate-fade-in py-12"
            action={{
              label: "Create Campaign",
              onClick: () => navigate('/brand/create-campaign'),
              variant: "default" as const
            }}
          />
        )}

        {/* Additional Info */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Looking for published campaigns?</h3>
              <p className="text-muted-foreground text-sm">
                Published campaigns are managed in the Orders tab where they go through review and execution phases.
              </p>
              <Button variant="outline" onClick={() => navigate('/brand/orders')}>
                View Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Search Modal */}
      {showSearch && (
        <CampaignSearch onClose={() => setShowSearch(false)} />
      )}
    </>
  );
};

export default BrandCampaigns;
