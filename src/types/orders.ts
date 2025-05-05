
import { Project } from './projects';

export type OrderStage = 
  | 'campaign_setup'
  | 'creator_selection' 
  | 'contract_payment'
  | 'planning_creation'
  | 'content_performance';

export const orderStageLabels: Record<OrderStage, string> = {
  campaign_setup: 'Campaign Setup',
  creator_selection: 'Creator Selection',
  contract_payment: 'Contract & Payment',
  planning_creation: 'Planning & Creation',
  content_performance: 'Content & Performance'
};

export interface Creator {
  id: string;
  name: string;
  platform: string;
  imageUrl: string;
  status: 'invited' | 'accepted' | 'declined' | 'completed';
}

export interface Order {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  stage: OrderStage;
  progress: number;
  budget: number;
  currency: string;
  dueDate?: string;
  creators: Creator[];
  platformsList: string[];
  contentItems?: ContentItem[];
  platform?: string; // Added platform property to match usage in CampaignSummary
}

export interface ContentItem {
  id: string;
  creatorId: string;
  creatorName: string;
  platform: string;
  type: 'video' | 'post' | 'story';
  status: 'draft' | 'submitted' | 'approved' | 'published';
  previewUrl?: string;
  submittedAt?: string;
  publishedAt?: string;
}

// Import the mapProjectStatusToOrderStage and getStageProgress functions from orderUtils
import { mapProjectStatusToOrderStage, getStageProgress, generateMockCreators, generateMockContentItems } from '@/utils/orderUtils';
