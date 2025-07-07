import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, ArrowRight } from 'lucide-react';
import { useDraftCampaigns } from '@/hooks/brand/useDraftCampaigns';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded-lg w-80"></div>
              <div className="h-6 bg-muted rounded w-96"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-light text-foreground">Something went wrong</h2>
              <p className="text-muted-foreground max-w-md">
                We encountered an issue loading your draft campaigns. Please try again.
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h1 className="text-4xl font-light text-foreground tracking-tight">
                  Draft Campaigns
                </h1>
                <p className="text-lg text-muted-foreground font-light max-w-2xl">
                  Create and refine your campaigns before they go live. 
                  <span className="text-foreground font-normal"> Published campaigns</span> move to Orders for execution.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSearch(true)}
                  className="border-border hover:bg-muted/50 font-light"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  onClick={() => navigate('/brand/create-campaign')}
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 font-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-8">
          {draftCampaigns.length > 0 ? (
            <div className="py-12 space-y-8">
              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground font-light">
                    {draftCampaigns.length} {draftCampaigns.length === 1 ? 'draft' : 'drafts'}
                  </span>
                </div>
              </div>

              {/* Campaigns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {draftCampaigns.map((campaign) => (
                  <Card 
                    key={campaign.id} 
                    className="group cursor-pointer border-border hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
                    onClick={() => handleContinueDraft(campaign.id)}
                  >
                    <CardContent className="p-8 space-y-6">
                      {/* Header */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Badge 
                            variant="secondary" 
                            className="bg-yellow-100 text-yellow-800 border-yellow-200 font-light"
                          >
                            Draft
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        <h3 className="text-xl font-light text-foreground group-hover:text-foreground line-clamp-2">
                          {campaign.name}
                        </h3>
                        <p className="text-muted-foreground text-sm font-light">
                          {campaign.campaign_type}
                        </p>
                      </div>

                      {/* Progress */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-light">Progress</span>
                          <span className="font-light text-foreground">
                            Step {campaign.current_step}/5
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-foreground h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(campaign.current_step / 5) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground font-light">Budget</span>
                          <span className="font-light text-foreground">
                            {campaign.currency} {campaign.budget.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground font-light">Last updated</span>
                          <span className="text-sm text-muted-foreground font-light">
                            {new Date(campaign.updated_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Info Section */}
              <div className="pt-12 border-t border-border">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-light text-foreground">
                    Ready to publish?
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto font-light">
                    Published campaigns move to the Orders section where they undergo review 
                    and enter the execution phase with your selected creators.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/brand/orders')}
                    className="border-border hover:bg-muted/50 font-light"
                  >
                    View Orders
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24">
              <EmptyState
                icon={Plus}
                title="No draft campaigns yet"
                description="Create your first campaign to start collaborating with creators and growing your brand's reach."
                className="border-0 shadow-none bg-transparent"
                action={{
                  label: "Create Campaign",
                  onClick: () => navigate('/brand/create-campaign'),
                  variant: "default" as const
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Campaign Search Modal */}
      {showSearch && (
        <CampaignSearch onClose={() => setShowSearch(false)} />
      )}
    </>
  );
};

export default BrandCampaigns;
