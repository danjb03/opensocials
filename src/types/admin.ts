
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

export type AdminUser = {
  id: string;
  email: string | null;
  created_at: string | null;
  phone: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  raw_user_meta_data: Json | null;
  profiles?: {
    full_name: string | null;
    role: string | null;
  } | null;
  user_roles?: {
    role: string | null;
    status: string | null;
    approved_at: string | null;
  }[] | null;
};

export type CampaignDetail = {
  id: string;
  brand_id: string | null;
  name: string | null;
  description: string | null;
  campaign_type: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  brief_data: Json | null;
  platforms: string[] | null;
  deliverables: Json | null;
  status: string | null;
  review_status: string | null;
  current_step: number | null;
  created_at: string | null;
  updated_at: string | null;
  brand_profiles: {
    company_name: any;
    industry: any;
  } | null;
  campaign_reviews: {
    id: string;
    review_type: string | null;
    review_status: string | null;
    review_data: Json | null;
    created_at: string | null;
  }[];
};

export type UserRequest = {
  id: string;
  user_id: string;
  request_type: string;
  request_data: Json;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
};

export type PricingFloor = {
  id: string;
  content_type: string;
  platform: string;
  follower_range_min: number;
  follower_range_max: number | null;
  min_price_cents: number;
  created_at: string;
  updated_at: string;
};

export type SecurityAuditLog = {
  id: string;
  user_id: string | null;
  event_type: string;
  event_data: Json;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
};

export type R4Rule = {
  id: string;
  rule_name: string;
  rule_type: string;
  conditions: Json;
  actions: Json;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type RevenueMetrics = {
  total_revenue: number;
  month_over_month_growth: number;
  avg_deal_size: number;
  active_campaigns: number;
  completed_deals: number;
  revenue_by_month: Array<{
    month: string;
    revenue: number;
  }>;
  top_performers: Array<{
    brand_name: string;
    revenue: number;
  }>;
};
