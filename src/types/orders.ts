
import { Project, ProjectStatus } from './projects';

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

export const projectToOrder = (project: Project): Order => {
  // Map project status to order stage
  let stage: OrderStage = 'campaign_setup';
  
  // Example mapping logic based on project status
  switch(project.status) {
    case 'new':
      stage = 'campaign_setup';
      break;
    case 'under_review':
    case 'awaiting_approval':
      stage = 'creator_selection';
      break;
    case 'creators_assigned':
      stage = 'contract_payment';
      break;
    case 'in_progress':
      stage = 'planning_creation';
      break;
    case 'completed':
      stage = 'content_performance';
      break;
    default:
      stage = 'campaign_setup';
  }
  
  // Map project to order
  return {
    id: project.id,
    title: project.name,
    createdAt: new Date().toISOString(), // Use actual project date when available
    stage: stage,
    progress: getStageProgress(stage),
    budget: project.budget,
    currency: project.currency,
    creators: [], // This would be populated from actual creator data
    platformsList: project.platforms || [],
  };
};

// Helper function to calculate progress percentage based on stage
const getStageProgress = (stage: OrderStage): number => {
  const stages: OrderStage[] = ['campaign_setup', 'creator_selection', 'contract_payment', 'planning_creation', 'content_performance'];
  const currentIndex = stages.indexOf(stage);
  return Math.round(((currentIndex + 1) / stages.length) * 100);
};
