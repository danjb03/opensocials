
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

export const useBrandDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [todoItems, setTodoItems] = useState([]);
  const [creators, setCreators] = useState([]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // 1. Fetch projects for this brand
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('brand_id', user.id);
          
        if (projectsError) throw projectsError;
        
        // Set projects data
        setProjects(projectsData || []);
        
        // 2. Generate todo items based on projects with draft/pending status
        const pendingProjects = projectsData?.filter(p => 
          p.status === 'draft' || p.status === 'pending' || p.status === 'awaiting_approval'
        ) || [];
        
        const todos = pendingProjects.map(project => ({
          id: project.id,
          projectId: project.id,
          title: project.status === 'draft' 
            ? 'Complete project setup' 
            : 'Review pending approval',
          description: project.name,
          type: project.status === 'draft' ? 'complete' : 'review'
        }));
        
        setTodoItems(todos);
        
        // 3. For MVP, we'll use mock creators data
        // In a future version, we could fetch from brand_creator_connections
        setCreators([
          {
            id: '1',
            name: 'Emma Roberts',
            platform: 'Instagram',
            followers: '125K',
            imageUrl: 'https://pcnrnciwgdrukzciwexi.supabase.co/storage/v1/object/sign/public/lovable-uploads/2c8624f4-39bb-424c-bfe5-aa9b8999ebd7.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwdWJsaWMvbG92YWJsZS11cGxvYWRzLzJjODYyNGY0LTM5YmItNDI0Yy1iZmU1LWFhOWI4OTk5ZThkNy5wbmciLCJpYXQiOjE3NDY2MTIyMDcsImV4cCI6MTc3ODIxMDIwN30.tQrq5PJEkygitHYhPVyZO26Tdhax5339nvvk04S9Lk4&t=2025-05-07T07%3A43%3A27.904Z'
          },
          {
            id: '2',
            name: 'Jack Thompson',
            platform: 'TikTok',
            followers: '340K',
            imageUrl: 'https://pcnrnciwgdrukzciwexi.supabase.co/storage/v1/object/sign/public/lovable-uploads/7780980e-8910-4ad1-a0df-28190a7f66bb.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwdWJsaWMvbG92YWJsZS11cGxvYWRzLzc3ODA5ODBlLTg5MTAtNGFkMS1hMGRmLTI4MTkwYTdmNjZiYi5wbmciLCJpYXQiOjE3NDY2MTIyMzgsImV4cCI6MTc3ODIxMDIzOH0.-GfQv-udz1-aQDDUvQvnWV8b0-XuW2UdHem93xy8qe0&t=2025-05-07T07%3A43%3A58.600Z'
          },
          {
            id: '3',
            name: 'Sarah Miller',
            platform: 'YouTube',
            followers: '78K',
            imageUrl: 'https://pcnrnciwgdrukzciwexi.supabase.co/storage/v1/object/sign/public/lovable-uploads/870b5584-9a62-4484-a05f-b373c664e839.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwdWJsaWMvbG92YWJsZS11cGxvYWRzLzg3MGI1NTg0LTlhNjItNDQ4NC1hMDVmLWIzNzNjNjY0ZTgzOS5wbmciLCJpYXQiOjE3NDY2MTIyNTcsImV4cCI6MTc3ODIxMDI1N30.D5Lug5cy8eaZNfZhQhciExztbssh76ESBsMLT_WY0rk&t=2025-05-07T07%3A44%3A18.027Z'
          }
        ]);
        
      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);

  // Calculate project stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => 
    p.status === 'active' || p.status === 'in_progress' || p.status === 'creators_assigned'
  ).length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  return {
    isLoading,
    projects,
    todoItems,
    creators,
    projectStats: {
      totalProjects,
      activeProjects,
      completedProjects
    }
  };
};
