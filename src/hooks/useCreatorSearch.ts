
import { useCreatorData } from '@/hooks/brand/useCreatorData';
import { useCreatorFilters } from '@/hooks/brand/useCreatorFilters';
import { useCreatorSelection } from '@/hooks/brand/useCreatorSelection';
import { useCreatorActions } from '@/hooks/brand/useCreatorActions';

export const useCreatorSearch = () => {
  const { creators, isLoading, fetchExternalMetrics } = useCreatorData();
  const {
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
  } = useCreatorFilters(creators);

  const { selectedCreators, setSelectedCreators, handleToggleCreator } = useCreatorSelection();
  const { availableCampaigns, selectedCampaignId, setSelectedCampaignId, addCreatorsToProject } = useCreatorActions();

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
    addCreatorsToProject: () => addCreatorsToProject(selectedCreators),
    resetFilters,
    getActiveFilterCount,
    availableCampaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    fetchExternalMetrics
  };
};
