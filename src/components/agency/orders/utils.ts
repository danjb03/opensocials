
import { Campaign } from './types';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'in_progress':
    case 'completed':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'paused':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const getUrgencyLevel = (campaign: Campaign) => {
  const pendingDeals = campaign.deals.filter((deal: any) => deal.status === 'pending');
  
  if (pendingDeals.length > 0) {
    const oldestPending = new Date(Math.min(...pendingDeals.map((d: any) => new Date(d.created_at).getTime())));
    const daysPending = Math.floor((Date.now() - oldestPending.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysPending > 7) return 'high';
    if (daysPending > 3) return 'medium';
  }
  
  return 'low';
};

export const groupDealsByCampaign = (deals: any[]) => {
  return deals.reduce((acc, deal) => {
    const title = deal.title || 'Untitled Campaign';
    if (!acc[title]) {
      acc[title] = {
        title,
        deals: [],
        brand_name: deal.brand_name,
        created_at: deal.created_at,
        status: 'active' // Default status since deals don't have project status
      };
    }
    acc[title].deals.push(deal);
    return acc;
  }, {} as Record<string, Campaign>);
};

export const getCampaignsNeedingAttention = (campaigns: Campaign[]) => {
  return campaigns.filter(campaign => {
    const hasStuckDeals = campaign.deals.some((deal: any) => 
      deal.status === 'pending' && 
      new Date(deal.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days old
    );
    return hasStuckDeals;
  });
};
