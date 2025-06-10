
import { useMemo } from 'react';

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

export const useCampaignFilters = (campaigns: Campaign[]) => {
  const activeCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const today = new Date();
      const startDate = new Date(campaign.start_date);
      const endDate = new Date(campaign.end_date);
      return startDate <= today && endDate >= today && campaign.status === 'active';
    });
  }, [campaigns]);

  const upcomingCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const today = new Date();
      const startDate = new Date(campaign.start_date);
      return startDate > today && campaign.status === 'upcoming';
    });
  }, [campaigns]);

  const completedCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const today = new Date();
      const endDate = new Date(campaign.end_date);
      return endDate < today || campaign.status === 'completed';
    });
  }, [campaigns]);

  return {
    activeCampaigns,
    upcomingCampaigns,
    completedCampaigns
  };
};
