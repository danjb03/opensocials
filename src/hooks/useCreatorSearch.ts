
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Creator } from '@/types/creator';
import { mockCreatorsBase } from '@/data/mockCreators';
import { calculateMatchScore } from '@/utils/creatorMatching';
import { supabase } from '@/integrations/supabase/client';

export const useCreatorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState(searchParams.get('platform') || 'all');
  const [filterAudience, setFilterAudience] = useState(searchParams.get('audience') || 'all');
  const [filterContentType, setFilterContentType] = useState(searchParams.get('contentType') || 'all');
  const [filterLocation, setFilterLocation] = useState(searchParams.get('location') || 'all');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [availableCampaigns, setAvailableCampaigns] = useState<{id: string, title: string}[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch available campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('brand_id', user.user.id)
          .in('status', ['active', 'draft'])
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAvailableCampaigns(data.map(project => ({
          id: project.id,
          title: project.name
        })));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  // Apply filtering to the mock creators
  const filteredCreators: Creator[] = mockCreatorsBase.filter(creator => {
    // Text search filter
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Platform filter
    const matchesPlatform = filterPlatform === 'all' || creator.platform === filterPlatform;
    
    // Audience filter
    const matchesAudience = filterAudience === 'all' || creator.audience === filterAudience;
    
    // Content type filter
    const matchesContentType = filterContentType === 'all' || creator.contentType === filterContentType;
    
    // Location filter
    const matchesLocation = filterLocation === 'all' || 
      (creator.audienceLocation && 
        (creator.audienceLocation.primary.toLowerCase().includes(filterLocation.toLowerCase()) ||
         (creator.audienceLocation.secondary && 
          creator.audienceLocation.secondary.some(loc => 
            loc.toLowerCase().includes(filterLocation.toLowerCase())
          ))
        )
      );
    
    // Skills filter
    const matchesSkills = filterSkills.length === 0 || creator.skills.some(skill => 
      filterSkills.includes(skill)
    );
    
    return matchesSearch && matchesPlatform && matchesAudience && matchesContentType && matchesLocation && matchesSkills;
  }).map(creator => {
    // Calculate match score if we have filters applied
    if (filterPlatform !== 'all' || filterAudience !== 'all' || filterContentType !== 'all' || 
        filterLocation !== 'all' || filterSkills.length > 0) {
      const requirements = {
        platforms: filterPlatform !== 'all' ? [filterPlatform] : undefined,
        audience: filterAudience !== 'all' ? filterAudience : undefined,
        contentTypes: filterContentType !== 'all' ? [filterContentType] : undefined,
        location: filterLocation !== 'all' ? filterLocation : undefined,
        skills: filterSkills.length > 0 ? filterSkills : undefined
      };
      return {
        ...creator,
        matchScore: calculateMatchScore(creator, requirements)
      };
    }
    return creator;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterPlatform && filterPlatform !== 'all') params.set('platform', filterPlatform);
    if (filterAudience && filterAudience !== 'all') params.set('audience', filterAudience);
    if (filterContentType && filterContentType !== 'all') params.set('contentType', filterContentType);
    if (filterLocation && filterLocation !== 'all') params.set('location', filterLocation);
    if (filterSkills.length > 0) params.set('skills', filterSkills.join(','));
    setSearchParams(params);
  }, [filterPlatform, filterAudience, filterContentType, filterLocation, filterSkills, setSearchParams]);

  const handleToggleCreator = (creatorId: number) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const addCreatorsToProject = async () => {
    if (selectedCreators.length === 0) {
      toast({
        title: "No creators selected",
        description: "Please select at least one creator to add to your project.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCampaignId) {
      toast({
        title: "No campaign selected",
        description: "Please select a campaign to add the creators to.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here we would normally add creators to the campaign in the database
      // This is a mock implementation
      toast({
        title: "Creators added to campaign",
        description: `${selectedCreators.length} creators added to your campaign.`
      });

      console.log("Selected creators:", selectedCreators);
      console.log("Added to campaign:", selectedCampaignId);
      setSelectedCreators([]);
    } catch (error) {
      console.error("Error adding creators to campaign:", error);
      toast({
        title: "Error",
        description: "Failed to add creators to campaign. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetFilters = () => {
    setFilterPlatform('all');
    setFilterAudience('all');
    setFilterContentType('all');
    setFilterLocation('all');
    setFilterSkills([]);
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterPlatform !== 'all') count++;
    if (filterAudience !== 'all') count++;
    if (filterContentType !== 'all') count++;
    if (filterLocation !== 'all') count++;
    if (filterSkills.length > 0) count++;
    return count;
  };

  return {
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
