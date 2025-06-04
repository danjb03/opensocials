
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Creator {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  primary_platform: string | null;
  follower_count: number | null;
  engagement_rate: number | null;
  audience_type: string | null;
  content_type: string | null;
  industries: string[] | null;
  platforms: string[] | null;
  avatar_url: string | null;
  audience_location: any;
  content_types: string[] | null;
}

export const useCreatorSearchNew = () => {
  const { user } = useAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterAudience, setFilterAudience] = useState('');
  const [filterContentType, setFilterContentType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterIndustries, setFilterIndustries] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // Selection states
  const [selectedCreators, setSelectedCreators] = useState<Creator[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [availableCampaigns, setAvailableCampaigns] = useState<Array<{id: string, name: string}>>([]);

  // Fetch creators from creator_profiles table
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching creators from creator_profiles table');
        
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('is_profile_complete', true);

        if (error) {
          console.error('Error fetching creators:', error);
          toast.error('Failed to load creators');
          return;
        }

        console.log('Raw creator profiles data:', data);
        setCreators(data || []);
      } catch (error) {
        console.error('Error in fetchCreators:', error);
        toast.error('Failed to load creators');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, []);

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

  // Filter creators based on search criteria
  const filteredCreators = useMemo(() => {
    return creators.filter(creator => {
      const matchesSearch = !searchTerm || 
        creator.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlatform = !filterPlatform || creator.primary_platform === filterPlatform;
      const matchesAudience = !filterAudience || creator.audience_type === filterAudience;
      const matchesContentType = !filterContentType || 
        creator.content_type === filterContentType ||
        creator.content_types?.includes(filterContentType);
      
      const matchesSkills = filterSkills.length === 0 || 
        filterSkills.some(skill => creator.content_types?.includes(skill));
      
      const matchesIndustries = filterIndustries.length === 0 ||
        filterIndustries.some(industry => creator.industries?.includes(industry));

      return matchesSearch && matchesPlatform && matchesAudience && 
             matchesContentType && matchesSkills && matchesIndustries;
    });
  }, [creators, searchTerm, filterPlatform, filterAudience, filterContentType, 
      filterSkills, filterIndustries]);

  const handleToggleCreator = (creator: Creator) => {
    setSelectedCreators(prev => {
      const isSelected = prev.some(c => c.id === creator.id);
      if (isSelected) {
        return prev.filter(c => c.id !== creator.id);
      } else {
        return [...prev, creator];
      }
    });
  };

  const addCreatorsToProject = async () => {
    if (!selectedCampaignId || selectedCreators.length === 0) {
      toast.error('Please select a campaign and at least one creator');
      return;
    }

    try {
      toast.success(`Added ${selectedCreators.length} creator(s) to campaign`);
      setSelectedCreators([]);
    } catch (error) {
      console.error('Error adding creators to project:', error);
      toast.error('Failed to add creators to campaign');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterPlatform('');
    setFilterAudience('');
    setFilterContentType('');
    setFilterLocation('');
    setFilterSkills([]);
    setFilterIndustries([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filterPlatform) count++;
    if (filterAudience) count++;
    if (filterContentType) count++;
    if (filterLocation) count++;
    if (filterSkills.length > 0) count++;
    if (filterIndustries.length > 0) count++;
    return count;
  };

  return {
    creators: filteredCreators,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterPlatform,
    setFilterPlatform,
    filterAudience,
    setFilterAudience,
    filterContentType,
    setFilterContentType,
    filterLocation,
    setFilterLocation,
    filterSkills,
    setFilterSkills,
    filterIndustries,
    setFilterIndustries,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    selectedCreators,
    filteredCreators,
    handleToggleCreator,
    addCreatorsToProject,
    resetFilters,
    getActiveFilterCount,
    availableCampaigns,
    selectedCampaignId,
    setSelectedCampaignId
  };
};
