
import { useState, useEffect } from 'react';
import { Order, OrderStage, projectToOrder, Creator, ContentItem } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/projects';

// Mock creators for demo data
const mockCreators: Creator[] = [
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
  },
  { 
    id: 'creator3', 
    name: 'Jamie Chen', 
    platform: 'YouTube', 
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'declined' 
  },
  { 
    id: 'creator4', 
    name: 'Taylor Singh', 
    platform: 'Instagram', 
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'completed' 
  }
];

// Mock content items
const mockContentItems: ContentItem[] = [
  {
    id: 'content1',
    creatorId: 'creator1',
    creatorName: 'Alex Morgan',
    platform: 'Instagram',
    type: 'post',
    status: 'published',
    submittedAt: '2023-05-15T10:30:00Z',
    publishedAt: '2023-05-17T14:20:00Z'
  },
  {
    id: 'content2',
    creatorId: 'creator4',
    creatorName: 'Taylor Singh',
    platform: 'Instagram',
    type: 'story',
    status: 'approved'
  }
];

// Mock projects
const mockProjects: Project[] = [
  { 
    id: 'project1',
    name: 'Summer Campaign',
    campaign_type: 'Monthly',
    start_date: '2023-06-01',
    end_date: '2023-06-30',
    budget: 5000,
    currency: 'USD',
    platforms: ['Instagram', 'TikTok'],
    status: 'new',
    is_priority: true
  },
  { 
    id: 'project2',
    name: 'Product Launch',
    campaign_type: 'Single',
    start_date: '2023-07-15',
    end_date: '2023-07-25',
    budget: 3500,
    currency: 'USD',
    platforms: ['YouTube'],
    status: 'creators_assigned',
    is_priority: false
  },
  { 
    id: 'project3',
    name: 'Holiday Special',
    campaign_type: 'Weekly',
    start_date: '2023-12-01',
    end_date: '2023-12-31',
    budget: 8000,
    currency: 'USD',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    status: 'in_progress',
    is_priority: true
  },
  { 
    id: 'project4',
    name: 'Brand Awareness',
    campaign_type: 'Single',
    start_date: '2023-08-01',
    end_date: '2023-08-15',
    budget: 2500,
    currency: 'USD',
    platforms: ['Instagram'],
    status: 'completed',
    is_priority: false
  }
];

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get selected order
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) || null
    : null;

  // Initialize orders from mock data
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch from an API here
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
        
        setOrders(mappedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load campaigns',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [toast]);

  // Handle stage change
  const handleStageChange = (stage: OrderStage) => {
    setActiveStage(stage);
    setSelectedOrderId(null); // Clear selected order when changing stages
  };

  // Handle order selection
  const handleOrderSelect = (id: string) => {
    setSelectedOrderId(id);
  };

  // Handle closing order detail
  const handleCloseOrderDetail = () => {
    setSelectedOrderId(null);
  };

  // Handle moving order to a different stage
  const handleMoveStage = (id: string, newStage: OrderStage) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { 
              ...order, 
              stage: newStage,
              progress: getStageProgress(newStage)
            } 
          : order
      )
    );
    
    toast({
      title: 'Campaign updated',
      description: `Campaign moved to ${newStage.replace('_', ' ')}`,
    });
    
    // Update the active stage to match the order's new stage
    setActiveStage(newStage);
  };

  // Helper function to calculate progress percentage based on stage
  const getStageProgress = (stage: OrderStage): number => {
    const stages: OrderStage[] = ['campaign_setup', 'creator_selection', 'contract_payment', 'planning_creation', 'content_performance'];
    const currentIndex = stages.indexOf(stage);
    return Math.round(((currentIndex + 1) / stages.length) * 100);
  };

  return {
    orders,
    activeStage,
    selectedOrder,
    isLoading,
    handleStageChange,
    handleOrderSelect,
    handleCloseOrderDetail,
    handleMoveStage
  };
};
