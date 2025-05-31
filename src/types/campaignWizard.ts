export type CampaignObjective = 
  | 'brand_awareness' 
  | 'product_launch' 
  | 'sales_drive' 
  | 'engagement' 
  | 'conversions';

export type DealStatus = 
  | 'pending' 
  | 'invited' 
  | 'accepted' 
  | 'declined' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'paid' 
  | 'failed';

export type ProjectStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'cancelled';

export type ContentType = 
  | 'post' 
  | 'story' 
  | 'reel' 
  | 'video' 
  | 'live' 
  | 'carousel';

export type Platform = 
  | 'instagram' 
  | 'tiktok' 
  | 'youtube' 
  | 'twitter' 
  | 'linkedin';

export interface ContentRequirements {
  content_types: ContentType[];
  platforms: Platform[];
  messaging_guidelines?: string;
  hashtags?: string[];
  mentions?: string[];
  style_preferences?: string;
  restrictions?: string[];
}

export interface Deliverables {
  posts_count: number;
  stories_count?: number;
  reels_count?: number;
  video_length_minutes?: number;
  live_sessions?: number;
  custom_deliverables?: string[];
}

export interface EnhancedProject {
  id: string;
  brand_id: string;
  
  // Step 1: Campaign Basics
  name: string;
  objective?: CampaignObjective;
  campaign_type: string;
  
  // Step 2: Content Requirements
  description?: string;
  content_requirements: ContentRequirements;
  platforms: Platform[];
  messaging_guidelines?: string;
  
  // Step 3: Budget & Deliverables
  total_budget?: number; // Gross budget (includes OS margin)
  deliverables: Deliverables;
  
  // Timeline
  start_date?: string;
  end_date?: string;
  
  // Campaign Status & Progress
  status: ProjectStatus;
  current_step: number;
  
  // Meta
  created_at: string;
  updated_at: string;
}

export interface CreatorDeal {
  id: string;
  project_id: string;
  creator_id: string;
  
  // Deal-specific data
  gross_value?: number; // Internal only - brands see this
  net_value: number; // Creator sees this (gross_value * 0.75)
  individual_requirements: Record<string, any>;
  
  // Deal workflow
  status: DealStatus;
  invited_at: string;
  responded_at?: string;
  creator_feedback?: string;
  
  // Payment tracking
  payment_status: PaymentStatus;
  paid_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface CreatorDealView {
  id: string;
  project_id: string;
  creator_id: string;
  deal_value: number; // Net value only (renamed from net_value)
  individual_requirements: Record<string, any>;
  status: DealStatus;
  invited_at: string;
  responded_at?: string;
  creator_feedback?: string;
  payment_status: PaymentStatus;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDraft {
  id: string;
  brand_id: string;
  draft_data: Partial<CampaignWizardData>;
  current_step: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignWizardData {
  // Step 1: Campaign Basics
  name: string;
  objective?: CampaignObjective;
  campaign_type: string;
  
  // Step 2: Content Requirements
  description?: string;
  content_requirements: ContentRequirements;
  messaging_guidelines?: string;
  
  // Step 3: Budget & Deliverables  
  total_budget: number; // Gross budget
  deliverables: Deliverables;
  timeline: { 
    start_date?: Date; 
    end_date?: Date; 
  };
  
  // Step 4: Creator Selection
  selected_creators: Array<{
    creator_id: string;
    individual_budget: number; // Per creator gross amount
    custom_requirements?: Record<string, any>;
  }>;
  
  // Step 5: Review data (computed from above)
  total_creators?: number;
  estimated_reach?: number;
  campaign_duration_days?: number;
}

export interface CampaignStep {
  id: number;
  title: string;
  icon: string;
  description: string;
  complete: boolean;
  current: boolean;
}

export const CAMPAIGN_STEPS: CampaignStep[] = [
  {
    id: 1,
    title: "Campaign Basics",
    icon: "🎯",
    description: "Name your campaign and set objectives",
    complete: false,
    current: false
  },
  {
    id: 2,
    title: "Content Requirements",
    icon: "📱",
    description: "Define what content you need",
    complete: false,
    current: false
  },
  {
    id: 3,
    title: "Budget & Deliverables",
    icon: "💰",
    description: "Set budget and timeline",
    complete: false,
    current: false
  },
  {
    id: 4,
    title: "Select Creators",
    icon: "👥",
    description: "Choose your creator partners",
    complete: false,
    current: false
  },
  {
    id: 5,
    title: "Review & Launch",
    icon: "🚀",
    description: "Review and launch your campaign",
    complete: false,
    current: false
  }
];

export interface CampaignWizardState {
  currentStep: number;
  data: Partial<CampaignWizardData>;
  steps: CampaignStep[];
  isDraft: boolean;
  draftId?: string;
  isLoading: boolean;
  error?: string;
}

// Helper types for validation
export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
  requiredFields: string[];
}

export interface CampaignCalculations {
  total_gross_budget: number;
  total_net_budget: number; // What creators receive combined
  os_margin: number; // 25% of gross
  average_creator_payment: number; // Net amount per creator
  estimated_campaign_reach: number;
  campaign_duration_days: number;
}