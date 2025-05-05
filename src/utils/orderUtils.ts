
import { OrderStage, Order, projectToOrder } from '@/types/orders';
import { mockCreators, mockContentItems, mockProjects } from '@/data/mockOrdersData';

// Helper function to calculate progress percentage based on stage
export const getStageProgress = (stage: OrderStage): number => {
  const stages: OrderStage[] = ['campaign_setup', 'creator_selection', 'contract_payment', 'planning_creation', 'content_performance'];
  const currentIndex = stages.indexOf(stage);
  return Math.round(((currentIndex + 1) / stages.length) * 100);
};

// Generate mock orders from projects
export const generateMockOrders = (): Order[] => {
  const mappedOrders = mockProjects.map(project => {
    const order = projectToOrder(project);
    
    // Add mock creators and content items to some orders for demo
    if (project.id === 'project2' || project.id === 'project3') {
      order.creators = mockCreators.slice(0, 3);
    } else if (project.id === 'project4') {
      order.creators = mockCreators;
      order.contentItems = mockContentItems;
    } else {
      order.creators = [];
    }
    
    return order;
  });
  
  return mappedOrders;
};
