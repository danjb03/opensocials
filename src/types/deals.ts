
export interface Deal {
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

// Legacy interface for backwards compatibility
export interface LegacyDeal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  profiles: {
    company_name: string;
    logo_url?: string;
  };
}

// Transformation function to convert new Deal to legacy format
export const transformDealToLegacy = (deal: Deal): LegacyDeal => ({
  id: deal.id,
  title: deal.project?.name || 'Untitled Deal',
  description: deal.project?.description || null,
  value: deal.deal_value,
  status: deal.status,
  feedback: null,
  creator_id: '', // Not available in new structure
  brand_id: '', // Not available in new structure
  created_at: deal.invited_at,
  updated_at: deal.invited_at,
  profiles: {
    company_name: deal.project?.brand_profile?.company_name || 'Unknown Brand',
    logo_url: deal.project?.brand_profile?.logo_url
  }
});
