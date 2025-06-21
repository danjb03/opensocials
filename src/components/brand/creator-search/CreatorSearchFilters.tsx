
import { Card, CardContent } from '@/components/ui/card';
import { CreatorFilters } from './CreatorFilters';

interface CreatorSearchFiltersProps {
  searchHookData: any;
}

export const CreatorSearchFilters = ({ searchHookData }: CreatorSearchFiltersProps) => {
  return (
    <Card className="mb-8 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <CreatorFilters 
          searchTerm={searchHookData.searchTerm} 
          onSearchChange={searchHookData.setSearchTerm} 
          filterPlatform={searchHookData.filterPlatform} 
          onPlatformChange={searchHookData.setFilterPlatform} 
          filterAudience={searchHookData.filterAudience} 
          onAudienceChange={searchHookData.setFilterAudience} 
          filterContentType={searchHookData.filterContentType} 
          onContentTypeChange={searchHookData.setFilterContentType} 
          filterLocation={searchHookData.filterLocation} 
          onLocationChange={searchHookData.setFilterLocation} 
          filterSkills={searchHookData.filterSkills} 
          onSkillsChange={searchHookData.setFilterSkills} 
          filterIndustries={searchHookData.filterIndustries} 
          onIndustriesChange={searchHookData.setFilterIndustries} 
          isFilterSheetOpen={searchHookData.isFilterSheetOpen} 
          setIsFilterSheetOpen={searchHookData.setIsFilterSheetOpen} 
          resetFilters={searchHookData.resetFilters} 
          getActiveFilterCount={searchHookData.getActiveFilterCount} 
        />
      </CardContent>
    </Card>
  );
};
