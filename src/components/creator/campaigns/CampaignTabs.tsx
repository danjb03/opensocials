
import React from 'react';
import { CalendarDays, CheckCircle, Clock } from 'lucide-react';
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
        <div className="flex justify-center p-12">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-t-2 border-b-2 border-foreground rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground font-light">Loading campaigns...</p>
          </div>
        </div>
      );
    }

    if (filteredCampaigns.length > 0) {
      return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign}
            />
          ))}
        </div>
      );
    }

    return <EmptyCampaigns type={tab} />;
  };

  return (
    <Tabs value={activeTab} onValueChange={value => setActiveTab(value as any)} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/20 p-1">
        <TabsTrigger value="active" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
          <Clock className="h-4 w-4" />
          Active ({activeCampaigns.length})
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
          <CalendarDays className="h-4 w-4" />
          Upcoming ({upcomingCampaigns.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
          <CheckCircle className="h-4 w-4" />
          Completed ({completedCampaigns.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        {renderTabContent('active')}
      </TabsContent>

      <TabsContent value="upcoming">
        {renderTabContent('upcoming')}
      </TabsContent>

      <TabsContent value="completed">
        {renderTabContent('completed')}
      </TabsContent>
    </Tabs>
  );
};

export default CampaignTabs;
