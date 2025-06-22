
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Creator {
  id: number;
  name: string;
}

export const useCreatorActions = () => {
  const { user } = useAuth();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [availableCampaigns, setAvailableCampaigns] = useState<Array<{id: string, name: string}>>([]);

  // Fetch available campaigns for the current brand
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('brand_id', user.id)
          .eq('status', 'active');

        if (error) {
          console.error('Error fetching campaigns:', error);
          return;
        }

        setAvailableCampaigns(data || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, [user]);

  const addCreatorsToProject = async (selectedCreators: Creator[]) => {
    if (!selectedCampaignId || selectedCreators.length === 0) {
      toast.error('Please select a campaign and at least one creator');
      return;
    }

    try {
      toast.success(`Added ${selectedCreators.length} creator(s) to campaign`);
      return true;
    } catch (error) {
      console.error('Error adding creators to project:', error);
      toast.error('Failed to add creators to campaign');
      return false;
    }
  };

  return {
    availableCampaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    addCreatorsToProject
  };
};
