
import React from 'react';
import { CalendarDays, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from "@/components/ui/card";
import CampaignCard from './CampaignCard';
import EmptyCampaigns from './EmptyCampaigns';

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

interface CampaignTabsProps {
  activeTab: 'active' | 'upcoming' | 'completed';
  setActiveTab: (tab: 'active' | 'upcoming' | 'completed') => void;
  activeCampaigns: Campaign[];
  upcomingCampaigns: Campaign[];
  completedCampaigns: Campaign[];
  isLoading: boolean;
}

const CampaignTabs: React.FC<CampaignTabsProps> = ({
  activeTab,
  setActiveTab,
  activeCampaigns,
  upcomingCampaigns,
  completedCampaigns,
  isLoading
}) => {
  const getFilteredCampaigns = (tab: string) => {
    switch (tab) {
      case 'active':
        return activeCampaigns;
      case 'upcoming':
        return upcomingCampaigns;
      case 'completed':
        return completedCampaigns;
      default:
        return [];
    }
  };

  const renderTabContent = (tab: 'active' | 'upcoming' | 'completed') => {
    const filteredCampaigns = getFilteredCampaigns(tab);

    if (isLoading) {
      return (
        <div className="flex justify-center p-16">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-t-foreground border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground font-light text-lg">Loading campaigns...</p>
            <p className="text-muted-foreground text-sm">Please wait while we fetch your campaign data</p>
          </div>
        </div>
      );
    }

    if (filteredCampaigns.length > 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCampaigns.length} {tab} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <EmptyCampaigns type={tab} />;
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/20 backdrop-blur border border-border p-1 h-auto">
          <TabsTrigger 
            value="active" 
            className="flex items-center gap-3 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-4 rounded-lg font-medium transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Active</div>
              <div className="text-xs text-muted-foreground">{activeCampaigns.length} campaigns</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="upcoming" 
            className="flex items-center gap-3 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-4 rounded-lg font-medium transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Upcoming</div>
              <div className="text-xs text-muted-foreground">{upcomingCampaigns.length} campaigns</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="completed" 
            className="flex items-center gap-3 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-4 rounded-lg font-medium transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Completed</div>
              <div className="text-xs text-muted-foreground">{completedCampaigns.length} campaigns</div>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-8">
          {renderTabContent('active')}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-8">
          {renderTabContent('upcoming')}
        </TabsContent>

        <TabsContent value="completed" className="mt-8">
          {renderTabContent('completed')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignTabs;
