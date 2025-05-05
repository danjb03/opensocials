
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

// Map a project from database to Order interface for the UI
export const projectToOrder = (project: Project): Order => {
  // Map project status to order stage
  const stage: OrderStage = mapProjectStatusToOrderStage(project.status || 'new');
  
  // Generate mock creators and content items for demo purposes
  // In a real implementation, these would be fetched from the database
  const creators = generateMockCreators(project.id);
  const contentItems = generateMockContentItems(project.id);
  
  // Map project to order
  return {
    id: project.id,
    title: project.name,
    description: project.description,
    createdAt: project.created_at ? new Date(project.created_at).toISOString() : new Date().toISOString(),
    stage: stage,
    progress: getStageProgress(stage),
    budget: project.budget || 0,
    currency: project.currency || 'USD',
    dueDate: project.end_date,
    creators: creators,
    platformsList: project.platforms || [],
    contentItems: contentItems
  };
};

// Helper function to calculate progress percentage based on stage
const getStageProgress = (stage: OrderStage): number => {
  const stages: OrderStage[] = ['campaign_setup', 'creator_selection', 'contract_payment', 'planning_creation', 'content_performance'];
  const currentIndex = stages.indexOf(stage);
  return Math.round(((currentIndex + 1) / stages.length) * 100);
};

// Map project status to order stage
const mapProjectStatusToOrderStage = (status: string): OrderStage => {
  switch(status) {
    case 'new':
      return 'campaign_setup';
    case 'under_review':
    case 'awaiting_approval':
      return 'creator_selection';
    case 'creators_assigned':
      return 'contract_payment';
    case 'in_progress':
      return 'planning_creation';
    case 'completed':
      return 'content_performance';
    default:
      return 'campaign_setup';
  }
};

// Functions to generate mock data for demonstration purposes
const generateMockCreators = (projectId: string): Creator[] => {
  // Implementation moved to orderUtils.ts
  return [];
};

const generateMockContentItems = (projectId: string): ContentItem[] => {
  // Implementation moved to orderUtils.ts
  return [];
};
