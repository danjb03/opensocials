
import React from 'react';
import SecurePendingDeals from './SecurePendingDeals';

interface Deal {
  id: string;
  project_id: string;
  deal_value: number;
  status: string;
  invited_at: string;
  project?: {
    name: string;
    description?: string;
    campaign_type: string;
    start_date?: string;
    end_date?: string;
    brand_profile?: {
      company_name: string;
      logo_url?: string;
    };
  };
}

interface PendingDealsProps {
  deals: Deal[];
}

const PendingDeals = ({ deals }: PendingDealsProps) => {
  return <SecurePendingDeals deals={deals} />;
};

export default PendingDeals;
