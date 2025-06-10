
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, Circle, Clock, Upload, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: string | null;
  budget: number | null;
  currency: string | null;
  campaign_type: string;
  brand_id: string | null;
}

const CreatorCampaigns = () => {
  const { user } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');
  const navigate = useNavigate();

  // Fetch campaigns where the creator is assigned
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['creator-campaigns', user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('campaign_type', 'invite')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Format the campaigns to include only necessary data
        const formattedCampaigns = data.map(campaign => ({
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          status: campaign.status,
          budget: campaign.budget,
          currency: campaign.currency,
          campaign_type: campaign.campaign_type,
          brand_id: campaign.brand_id,
        }));
        
        return formattedCampaigns;
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to load campaigns');
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const getCampaignStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'text-emerald-500';
      case 'upcoming':
        return 'text-blue-500';
      case 'completed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const today = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);

    if (activeTab === 'active') {
      return startDate <= today && endDate >= today && campaign.status === 'active';
    } else if (activeTab === 'upcoming') {
      return startDate > today && campaign.status === 'upcoming';
    } else {
      return endDate < today || campaign.status === 'completed';
    }
  });

  const activeCampaigns = campaigns.filter(campaign => {
    const today = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);
    return startDate <= today && endDate >= today && campaign.status === 'active';
  });

  const upcomingCampaigns = campaigns.filter(campaign => {
    const today = new Date();
    const startDate = new Date(campaign.start_date);
    return startDate > today && campaign.status === 'upcoming';
  });

  const completedCampaigns = campaigns.filter(campaign => {
    const today = new Date();
    const endDate = new Date(campaign.end_date);
    return endDate < today || campaign.status === 'completed';
  });

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-foreground">My Campaigns</h1>
          <p className="text-muted-foreground">Manage your active campaigns and track your content delivery.</p>
        </div>

        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-950 border border-gray-800/40">
            <TabsTrigger value="active" className="flex items-center gap-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-400 hover:text-white">
              <Clock className="h-4 w-4" />
              Active ({activeCampaigns.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-400 hover:text-white">
              <CalendarDays className="h-4 w-4" />
              Upcoming ({upcomingCampaigns.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-400 hover:text-white">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedCampaigns.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? (
              <div className="flex justify-center p-8 text-foreground">Loading campaigns...</div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">{campaign.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {campaign.description || 'No description provided.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Circle className={`h-4 w-4 ${getCampaignStatusColor(campaign.status)}`} />
                        <span className="text-muted-foreground">Status: {campaign.status || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Budget: {campaign.currency}{campaign.budget?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
                        className="border-gray-700 text-foreground hover:bg-gray-900"
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/creator/campaigns/${campaign.id}/upload`)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Content
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-900 p-3 mb-3">
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-base mb-1 text-foreground">No active campaigns</h3>
                  <p className="text-sm text-muted-foreground">
                    Check back later for new collaboration opportunities.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="flex justify-center p-8 text-foreground">Loading campaigns...</div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">{campaign.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {campaign.description || 'No description provided.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Circle className={`h-4 w-4 ${getCampaignStatusColor(campaign.status)}`} />
                        <span className="text-muted-foreground">Status: {campaign.status || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Budget: {campaign.currency}{campaign.budget?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
                        className="border-gray-700 text-foreground hover:bg-gray-900"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-900 p-3 mb-3">
                    <CalendarDays className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-base mb-1 text-foreground">No upcoming campaigns</h3>
                  <p className="text-sm text-muted-foreground">
                    Check back later for new collaboration opportunities.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {isLoading ? (
              <div className="flex justify-center p-8 text-foreground">Loading campaigns...</div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">{campaign.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {campaign.description || 'No description provided.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Circle className={`h-4 w-4 ${getCampaignStatusColor(campaign.status)}`} />
                        <span className="text-muted-foreground">Status: {campaign.status || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Budget: {campaign.currency}{campaign.budget?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
                        className="border-gray-700 text-foreground hover:bg-gray-900"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-900 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-base mb-1 text-foreground">No completed campaigns</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed campaigns will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </CreatorLayout>
  );
};

export default CreatorCampaigns;
