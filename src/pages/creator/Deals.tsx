import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import PendingDeals from '@/components/deals/PendingDeals';
import PastDeals from '@/components/deals/PastDeals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Deal, transformDealToLegacy } from '@/types/deals';

const CreatorDeals = () => {
  const { user, role } = useUnifiedAuth();

  // Fetch deals data using creator_deals table
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['creator-deals', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('creator_deals')
        .select(`
          id,
          project_id,
          deal_value,
          status,
          invited_at,
          projects:project_id(
            name,
            description,
            campaign_type,
            start_date,
            end_date,
            brand_profiles:brand_id(
              company_name,
              logo_url
            )
          )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the Deal interface
      const transformedDeals: Deal[] = (data || []).map(deal => ({
        id: deal.id,
        project_id: deal.project_id,
        deal_value: deal.deal_value,
        status: deal.status,
        invited_at: deal.invited_at,
        project: deal.projects ? {
          name: (deal.projects as any).name || 'Untitled Project',
          description: (deal.projects as any).description,
          campaign_type: (deal.projects as any).campaign_type || 'campaign',
          start_date: (deal.projects as any).start_date,
          end_date: (deal.projects as any).end_date,
          brand_profile: (deal.projects as any).brand_profiles ? {
            company_name: (deal.projects as any).brand_profiles.company_name || 'Unknown Brand',
            logo_url: (deal.projects as any).brand_profiles.logo_url
          } : undefined
        } : undefined
      }));

      return transformedDeals;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading your deals...</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  if (error) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-400 mb-2">Error loading deals</p>
              <p className="text-sm text-muted-foreground">Please refresh the page to try again</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  // Super admin preview mode
  if (role === 'super_admin') {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">My Deals</h1>
            <p className="text-muted-foreground">You are viewing the creator deals page as a super admin.</p>
          </div>
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black border border-white/10">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 hover:text-white">
                Pending Deals (0)
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 hover:text-white">
                Past Deals (0)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-white">No pending deals available</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-white">No past deals available</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CreatorLayout>
    );
  }

  const pendingDeals = deals?.filter(deal => ['pending', 'negotiating'].includes(deal.status || '')) || [];
  const pastDeals = deals?.filter(deal => ['accepted', 'completed', 'rejected', 'cancelled'].includes(deal.status || '')) || [];

  // Transform deals to legacy format for components
  const transformedPendingDeals = pendingDeals.map(transformDealToLegacy);
  const transformedPastDeals = pastDeals.map(transformDealToLegacy);

  return (
    <ErrorBoundary>
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">My Deals</h1>
            <p className="text-muted-foreground">
              Track your brand partnerships and collaborations.
            </p>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black border border-white/10">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 hover:text-white">
                Pending Deals ({transformedPendingDeals.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 hover:text-white">
                Past Deals ({transformedPastDeals.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <ErrorBoundary fallback={() => (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-white">Pending deals temporarily unavailable</p>
                  </CardContent>
                </Card>
              )}>
                <PendingDeals deals={transformedPendingDeals} />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="past">
              <ErrorBoundary fallback={() => (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-white">Past deals temporarily unavailable</p>
                  </CardContent>
                </Card>
              )}>
                <PastDeals deals={transformedPastDeals} />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default CreatorDeals;
