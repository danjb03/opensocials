
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Creator {
  id: number;
  name: string;
  platform: string;
  imageUrl: string;
  followers: string;
  engagement: string;
  audience: string;
  contentType: string;
  location: string;
  bio?: string;
  about?: string;
  skills?: string[];
  priceRange: string;
  bannerImageUrl?: string;
  socialLinks?: Record<string, string>;
  audienceLocation?: {
    primary: string;
    secondary?: string[];
    countries?: { name: string; percentage: number }[];
  };
  // External API metrics - to be populated by Modash or similar
  externalMetrics?: {
    followerCount: number;
    engagementRate: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    reachRate: number;
    impressions: number;
    growthRate: number;
    lastUpdated: string;
  };
  industries?: string[];
}

export const useCreatorSearch = () => {
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

  // Fetch external metrics for a creator (placeholder for Modash integration)
  const fetchExternalMetrics = async (creatorId: string, platform: string) => {
    // TODO: Implement Modash or similar API integration
    // This will fetch real-time metrics from external APIs
    console.log(`Fetching external metrics for creator ${creatorId} on ${platform}`);
    
    // Placeholder return - replace with actual API call
    return {
      followerCount: 0,
      engagementRate: 0,
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      reachRate: 0,
      impressions: 0,
      growthRate: 0,
      lastUpdated: new Date().toISOString()
    };
  };

  // Fetch creators from creator_profiles table
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching creators from creator_profiles table');
        
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('*');

        if (error) {
          console.error('Error fetching creators:', error);
          toast.error('Failed to load creators');
          return;
        }

        console.log('Raw creator profiles data:', data);

        // Transform creator_profiles data to Creator interface
        const transformedCreators: Creator[] = (data || []).map((profile, index) => {
          // Safely handle social_links JSON type
          const socialLinks: Record<string, string> = {};
          if (profile.social_links && typeof profile.social_links === 'object' && !Array.isArray(profile.social_links)) {
            Object.entries(profile.social_links).forEach(([key, value]) => {
              if (typeof value === 'string') {
                socialLinks[key] = value;
              }
            });
          }

          return {
            id: index + 1, // Use index as id since creator_profiles doesn't have numeric id
            name: profile.display_name || 'Unknown Creator',
            platform: profile.primary_platform || 'Unknown',
            imageUrl: '/placeholder.svg', // Default image since not stored in creator_profiles
            followers: profile.follower_count?.toString() || '0',
            engagement: profile.engagement_rate ? `${profile.engagement_rate}%` : '0%',
            audience: profile.audience_type || 'Unknown',
            contentType: profile.content_type || 'Unknown',
            location: profile.audience_location || 'Global',
            bio: profile.bio || '',
            about: profile.bio || '',
            skills: profile.categories || [],
            priceRange: '$500 - $2,000', // Default since not in creator_profiles
            bannerImageUrl: undefined,
            socialLinks,
            audienceLocation: {
              primary: profile.audience_location || 'Global',
              secondary: [],
              countries: []
            },
            // External metrics will be populated by API calls
            externalMetrics: undefined,
            industries: profile.industries || []
          };
        });

        console.log('Transformed creators:', transformedCreators);
        setCreators(transformedCreators);

        // TODO: Fetch external metrics for each creator
        // This would be done in batches to avoid rate limiting
        /*
        for (const creator of transformedCreators) {
          if (creator.platform && creator.id) {
            const metrics = await fetchExternalMetrics(creator.id.toString(), creator.platform);
            // Update creator with external metrics
          }
        }
        */
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
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlatform = !filterPlatform || creator.platform === filterPlatform;
      const matchesAudience = !filterAudience || creator.audience === filterAudience;
      const matchesContentType = !filterContentType || creator.contentType === filterContentType;
      const matchesLocation = !filterLocation || creator.location === filterLocation;
      
      const matchesSkills = filterSkills.length === 0 || 
        filterSkills.some(skill => creator.skills?.includes(skill));
      
      const matchesIndustries = filterIndustries.length === 0 ||
        filterIndustries.some(industry => creator.industries?.includes(industry));

      return matchesSearch && matchesPlatform && matchesAudience && 
             matchesContentType && matchesLocation && matchesSkills && matchesIndustries;
    });
  }, [creators, searchTerm, filterPlatform, filterAudience, filterContentType, 
      filterLocation, filterSkills, filterIndustries]);

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
    setSelectedCampaignId,
    fetchExternalMetrics // Expose for future use
  };
};
