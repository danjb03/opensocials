
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useAgencyDeals } from '@/hooks/agency/useAgencyDeals';
import AgencyOrderStats from '@/components/agency/orders/AgencyOrderStats';
import AgencyAttentionCampaigns from '@/components/agency/orders/AgencyAttentionCampaigns';
import AgencyAllCampaigns from '@/components/agency/orders/AgencyAllCampaigns';
import { groupDealsByCampaign, getCampaignsNeedingAttention } from '@/components/agency/orders/utils';
import { Deal } from '@/components/agency/orders/types';

const AgencyOrderManagement = () => {
  const { data: deals = [], isLoading: dealsLoading } = useAgencyDeals();
  const [activeTab, setActiveTab] = useState('overview');

  if (dealsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Campaign Oversight</h1>
        </div>
        <div className="text-center py-8">Loading campaign data...</div>
      </div>
    );
  }

  // Cast deals to proper type and group by campaign
  const typedDeals = deals as Deal[];
  const campaignsByTitle = groupDealsByCampaign(typedDeals);
  const campaigns = Object.values(campaignsByTitle);
  const campaignsNeedingAttention = getCampaignsNeedingAttention(campaigns);
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalDeals = typedDeals.length;
  const completedDeals = typedDeals.filter(d => d.status === 'completed').length;
  const completionRate = totalDeals > 0 ? Math.round((completedDeals / totalDeals) * 100) : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Eye className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Campaign Oversight</h1>
            <p className="text-muted-foreground">Monitor campaign progress and deal status</p>
          </div>
        </div>
      </div>

      <AgencyOrderStats
        activeCampaigns={activeCampaigns.length}
        campaignsNeedingAttention={campaignsNeedingAttention.length}
        totalDeals={totalDeals}
        completionRate={completionRate}
      />

      <AgencyAttentionCampaigns campaigns={campaignsNeedingAttention} />

      <AgencyAllCampaigns campaigns={campaigns} />
    </div>
  );
};

export default AgencyOrderManagement;
