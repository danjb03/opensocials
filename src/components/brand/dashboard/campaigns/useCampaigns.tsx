
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';
import { CampaignRow } from './CampaignRow';
import { useScalableQuery } from '@/hooks/useScalableQuery';
import { projectToOrder } from '@/utils/orderUtils';

export function useCampaigns() {
  const { user } = useAuth();

  const { data, isLoading: loading, error, refetch } = useScalableQuery<CampaignRow[]>({
    baseKey: ['campaigns'],
    customQueryFn: async () => {
      try {
        console.log('🔍 Fetching campaigns for user:', user?.id);
        
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        // Use the userDataStore for consistent user-scoped queries
        const projectsData = await import('@/lib/userDataStore').then(({ userDataStore }) => 
          userDataStore.executeUserQuery('projects', '*', {})
        );

        console.log('📊 Raw projects data from database:', projectsData);

        // Transform the data to match the expected format
        const campaignRows: CampaignRow[] = projectsData.map(project => {
          console.log('🔄 Transforming project:', project);
          return {
            project_id: project.id,
            project_name: project.name,
            project_status: project.status || 'draft',
            start_date: project.start_date,
            end_date: project.end_date,
            budget: project.budget || 0,
            currency: project.currency || 'USD',
            deal_id: null,
            deal_status: null,
            deal_value: null,
            creator_name: null,
            avatar_url: null,
            engagement_rate: null,
            primary_platform: null
          };
        });

        console.log("✅ Campaigns transformed successfully:", campaignRows);
        return campaignRows;
      } catch (error) {
        console.error("❌ Error fetching campaign data:", error);
        toast.error("Failed to load campaigns");
        throw error;
      }
    },
    staleTime: 30000,
  });

  const fetchData = () => {
    console.log('🔄 Manual refresh triggered');
    refetch();
  };

  console.log('📋 useCampaigns hook returning:', { 
    data: data || [], 
    loading, 
    error: error?.message || null 
  });

  return {
    data: data || [],
    loading,
    error: error?.message || null,
    fetchData,
  };
}
