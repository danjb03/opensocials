import { OrderStage, Order, Creator, ContentItem } from '@/types/orders';

// Map project status to order stage
export const mapProjectStatusToOrderStage = (status: string): OrderStage => {
  switch (status) {
    case 'new':
    case 'draft':
      return 'campaign_setup';
    case 'under_review':
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

// Calculate stage progress percentage
export const getStageProgress = (stage: OrderStage): number => {
  switch (stage) {
    case 'campaign_setup':
      return 20;
    case 'creator_selection':
      return 40;
    case 'contract_payment':
      return 60;
    case 'planning_creation':
      return 80;
    case 'content_performance':
      return 100;
    default:
      return 0;
  }
};

// Generate mock creators for testing
export const generateMockCreators = (count: number = 3): Creator[] => {
  const platforms = ['Instagram', 'TikTok', 'YouTube'];
  const statuses: ('invited' | 'accepted' | 'declined' | 'completed')[] = ['invited', 'accepted', 'declined', 'completed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `creator-${i + 1}`,
    name: `Creator ${i + 1}`,
    platform: platforms[i % platforms.length],
    imageUrl: 'https://i.pravatar.cc/150?img=' + (i + 10),
    status: statuses[i % statuses.length],
  }));
};

// Generate mock content items for testing
export const generateMockContentItems = (creatorCount: number = 3): ContentItem[] => {
  const types: ('video' | 'post' | 'story')[] = ['video', 'post', 'story'];
  const statuses: ('draft' | 'submitted' | 'approved' | 'published')[] = ['draft', 'submitted', 'approved', 'published'];
  const platforms = ['Instagram', 'TikTok', 'YouTube'];
  
  return Array.from({ length: creatorCount * 2 }, (_, i) => {
    const creatorIndex = Math.floor(i / 2);
    return {
      id: `content-${i + 1}`,
      creatorId: `creator-${creatorIndex + 1}`,
      creatorName: `Creator ${creatorIndex + 1}`,
      platform: platforms[creatorIndex % platforms.length],
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      submittedAt: i % 2 === 0 ? new Date().toISOString() : undefined,
      publishedAt: i % 4 === 0 ? new Date().toISOString() : undefined,
    };
  });
};

// Function to convert a project to an order
export const projectToOrder = (project: any): Order => {
  const stage = mapProjectStatusToOrderStage(project.status);
  
  // Generate mock creators for this project
  const creatorCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 creators
  const mockCreators = generateMockCreators(creatorCount);
  
  // Generate mock content items
  const mockContentItems = generateMockContentItems(creatorCount);
  
  // Get platforms from project or use defaults
  const platforms = project.platforms || ['Instagram', 'TikTok'];
  
  return {
    id: project.id,
    title: project.name,
    description: project.description || '',
    createdAt: project.created_at || new Date().toISOString(),
    stage,
    progress: getStageProgress(stage),
    budget: project.budget || 0,
    currency: project.currency || 'USD',
    dueDate: project.submission_deadline || project.end_date,
    creators: mockCreators,
    platformsList: platforms,
    contentItems: mockContentItems,
  };
};
