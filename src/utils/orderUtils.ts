
import { OrderStage, Order, Creator, ContentItem } from '@/types/orders';
import { Project } from '@/types/projects';

// Helper function to calculate progress percentage based on stage
export const getStageProgress = (stage: OrderStage): number => {
  const stages: OrderStage[] = ['campaign_setup', 'creator_selection', 'contract_payment', 'planning_creation', 'content_performance'];
  const currentIndex = stages.indexOf(stage);
  return Math.round(((currentIndex + 1) / stages.length) * 100);
};

// Map project status to order stage - this function is crucial for database integration
export const mapProjectStatusToOrderStage = (status: string): OrderStage => {
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

// Generate mock creators and content for demo purposes
// In a real implementation, these would come from the database
export const generateMockCreators = (projectId: string): Creator[] => {
  // For demonstration, we'll generate creators based on project ID
  if (projectId.includes('2') || projectId.includes('3')) {
    return [
      { 
        id: 'creator1', 
        name: 'Alex Morgan', 
        platform: 'Instagram', 
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'accepted' 
      },
      { 
        id: 'creator2', 
        name: 'Sam Rivera', 
        platform: 'TikTok', 
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'invited' 
      }
    ];
  } else if (projectId.includes('4')) {
    return [
      { 
        id: 'creator4', 
        name: 'Taylor Singh', 
        platform: 'Instagram', 
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'completed' 
      }
    ];
  }
  
  return [];
};

export const generateMockContentItems = (projectId: string): ContentItem[] => {
  if (projectId.includes('4')) {
    return [
      {
        id: 'content1',
        creatorId: 'creator4',
        creatorName: 'Taylor Singh',
        platform: 'Instagram',
        type: 'post',
        status: 'published',
        submittedAt: '2023-05-15T10:30:00Z',
        publishedAt: '2023-05-17T14:20:00Z'
      }
    ];
  }
  
  return [];
};

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
    description: project.description || '',
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
