
import { useProjectData } from '@/hooks/useProjectData';

export function useCampaigns() {
  const { campaignRows, isLoading, error, refreshProjects } = useProjectData();

  console.log('📋 useCampaigns hook returning:', { 
    data: campaignRows || [], 
    loading: isLoading, 
    error: error?.message || null 
  });

  return {
    data: campaignRows || [],
    loading: isLoading,
    error: error?.message || null,
    fetchData: refreshProjects,
  };
}
