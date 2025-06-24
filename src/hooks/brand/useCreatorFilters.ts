
import { useState, useMemo } from 'react';

interface Creator {
  id: number;
  name: string;
  platform: string;
  audience: string;
  contentType: string;
  location: string;
  bio?: string;
  skills?: string[];
  industries?: string[];
}

export const useCreatorFilters = (creators: Creator[]) => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterAudience, setFilterAudience] = useState('');
  const [filterContentType, setFilterContentType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterIndustries, setFilterIndustries] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter creators based on search criteria
  const filteredCreators = useMemo(() => {
    return creators.filter(creator => {
      const matchesSearch = !searchTerm || 
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlatform = filterPlatform === 'all' || creator.platform === filterPlatform;
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

  const resetFilters = () => {
    setSearchTerm('');
    setFilterPlatform('all');
    setFilterAudience('');
    setFilterContentType('');
    setFilterLocation('');
    setFilterSkills([]);
    setFilterIndustries([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filterPlatform && filterPlatform !== 'all') count++;
    if (filterAudience) count++;
    if (filterContentType) count++;
    if (filterLocation) count++;
    if (filterSkills.length > 0) count++;
    if (filterIndustries.length > 0) count++;
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
    filterIndustries,
    setFilterIndustries,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    filteredCreators,
    resetFilters,
    getActiveFilterCount
  };
};
