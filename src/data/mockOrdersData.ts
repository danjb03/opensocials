
import { Creator, ContentItem, Project } from '@/types/orders';

// Mock creators for demo data
export const mockCreators: Creator[] = [
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
export const mockContentItems: ContentItem[] = [
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
export const mockProjects: Project[] = [
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
