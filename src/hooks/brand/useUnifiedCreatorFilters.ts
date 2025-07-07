
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface CreatorFilters {
  // Search & Basic
  search: string;
  platforms: string[];
  
  // Audience Metrics
  followerCountMin: number;
  followerCountMax: number;
  engagementRateMin: number;
  engagementRateMax: number;
  
  // Content & Skills
  contentTypes: string[];
  industries: string[];
  skills: string[];
  
  // Demographics
  audienceLocations: string[];
  ageGroups: string[];
  languages: string[];
  
  // Commercial
  priceRangeMin: number;
  priceRangeMax: number;
  availability: string[];
  
  // Performance
  growthTrend: string;
  lastActiveWithin: string;
}

export interface Creator {
  id: string;
  name: string;
  username?: string;
  platform: string;
  platforms?: string[];
  followerCount: number;
  engagementRate: number;
  contentTypes?: string[];
  industries?: string[];
  skills?: string[];
  audienceLocation?: string;
  ageGroup?: string;
  language?: string;
  priceRange?: { min: number; max: number };
  isAvailable?: boolean;
  lastActive?: string;
  avatar?: string;
  bio?: string;
}

const DEFAULT_FILTERS: CreatorFilters = {
  search: '',
  platforms: [],
  followerCountMin: 0,
  followerCountMax: 10000000,
  engagementRateMin: 0,
  engagementRateMax: 20,
  contentTypes: [],
  industries: [],
  skills: [],
  audienceLocations: [],
  ageGroups: [],
  languages: [],
  priceRangeMin: 0,
  priceRangeMax: 10000,
  availability: [],
  growthTrend: '',
  lastActiveWithin: ''
};

export const useUnifiedCreatorFilters = (creators: Creator[] = []) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<CreatorFilters>(() => {
    // Initialize from URL params if available
    const urlFilters = { ...DEFAULT_FILTERS };
    
    if (searchParams.get('search')) urlFilters.search = searchParams.get('search') || '';
    if (searchParams.get('platforms')) urlFilters.platforms = searchParams.get('platforms')?.split(',') || [];
    
    return urlFilters;
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState<{ name: string; filters: CreatorFilters }[]>([]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.platforms.length) params.set('platforms', filters.platforms.join(','));
    if (filters.contentTypes.length) params.set('contentTypes', filters.contentTypes.join(','));
    if (filters.industries.length) params.set('industries', filters.industries.join(','));
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Filter creators based on current filters
  const filteredCreators = useMemo(() => {
    return creators.filter(creator => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          creator.name.toLowerCase().includes(searchTerm) ||
          creator.username?.toLowerCase().includes(searchTerm) ||
          creator.bio?.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Platform filter
      if (filters.platforms.length > 0) {
        const matchesPlatform = filters.platforms.some(platform =>
          creator.platform === platform || creator.platforms?.includes(platform)
        );
        if (!matchesPlatform) return false;
      }

      // Follower count range
      if (creator.followerCount < filters.followerCountMin || 
          creator.followerCount > filters.followerCountMax) {
        return false;
      }

      // Engagement rate range
      if (creator.engagementRate < filters.engagementRateMin || 
          creator.engagementRate > filters.engagementRateMax) {
        return false;
      }

      // Content types
      if (filters.contentTypes.length > 0) {
        const matchesContentType = filters.contentTypes.some(type =>
          creator.contentTypes?.includes(type)
        );
        if (!matchesContentType) return false;
      }

      // Industries
      if (filters.industries.length > 0) {
        const matchesIndustry = filters.industries.some(industry =>
          creator.industries?.includes(industry)
        );
        if (!matchesIndustry) return false;
      }

      // Skills
      if (filters.skills.length > 0) {
        const matchesSkill = filters.skills.some(skill =>
          creator.skills?.includes(skill)
        );
        if (!matchesSkill) return false;
      }

      return true;
    });
  }, [creators, filters]);

  // Update individual filter
  const updateFilter = useCallback((key: keyof CreatorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams({});
  }, [setSearchParams]);

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    
    if (filters.search) count++;
    if (filters.platforms.length > 0) count++;
    if (filters.contentTypes.length > 0) count++;
    if (filters.industries.length > 0) count++;
    if (filters.skills.length > 0) count++;
    if (filters.audienceLocations.length > 0) count++;
    if (filters.ageGroups.length > 0) count++;
    if (filters.languages.length > 0) count++;
    if (filters.availability.length > 0) count++;
    if (filters.growthTrend) count++;
    if (filters.lastActiveWithin) count++;
    
    // Range filters (only count if not default)
    if (filters.followerCountMin > DEFAULT_FILTERS.followerCountMin || 
        filters.followerCountMax < DEFAULT_FILTERS.followerCountMax) count++;
    if (filters.engagementRateMin > DEFAULT_FILTERS.engagementRateMin || 
        filters.engagementRateMax < DEFAULT_FILTERS.engagementRateMax) count++;
    if (filters.priceRangeMin > DEFAULT_FILTERS.priceRangeMin || 
        filters.priceRangeMax < DEFAULT_FILTERS.priceRangeMax) count++;
    
    return count;
  }, [filters]);

  // Save current filter set
  const saveFilterSet = useCallback((name: string) => {
    const newFilterSet = { name, filters: { ...filters } };
    setSavedFilters(prev => [...prev, newFilterSet]);
  }, [filters]);

  // Load saved filter set
  const loadFilterSet = useCallback((filterSet: { name: string; filters: CreatorFilters }) => {
    setFilters(filterSet.filters);
  }, []);

  return {
    filters,
    filteredCreators,
    updateFilter,
    resetFilters,
    getActiveFilterCount,
    isAdvancedOpen,
    setIsAdvancedOpen,
    savedFilters,
    saveFilterSet,
    loadFilterSet,
    resultCount: filteredCreators.length,
    totalCount: creators.length
  };
};
