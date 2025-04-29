
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  CampaignTypeFilter, 
  PlatformFilter, 
  CampaignNameFilter,
  MonthYearFilter,
  FilterButton,
  platformOptions,
  monthOptions,
  getYearOptions 
} from './filters';

export type ProjectFilters = {
  campaignTypes: string[];
  platforms: string[];
  campaignName: string;
  startMonth: string | null;
};

type ProjectFiltersProps = {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
};

export function ProjectFilters({ filters, onFiltersChange }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProjectFilters>(filters);
  const [month, setMonth] = useState('all');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  // Set month/year from startMonth when dialog opens
  useEffect(() => {
    if (filters.startMonth) {
      const [yearPart, monthPart] = filters.startMonth.split('-');
      setYear(yearPart);
      setMonth(monthPart);
    } else {
      setMonth('all');
      setYear(new Date().getFullYear().toString());
    }
    
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleTogglePlatform = (platform: string) => {
    setLocalFilters(prev => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  const handleApplyFilters = () => {
    // Only set startMonth if a specific month is selected (not "All Months")
    const startMonth = month !== 'all' ? `${year}-${month}` : null;
    onFiltersChange({ ...localFilters, startMonth });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters: ProjectFilters = {
      campaignTypes: [],
      platforms: [],
      campaignName: '',
      startMonth: null
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setIsOpen(false);
  };

  const activeFilterCount = [
    filters.campaignTypes.length > 0,
    filters.platforms.length > 0,
    filters.campaignName ? true : false,
    filters.startMonth ? true : false
  ].filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FilterButton activeFilterCount={activeFilterCount} />
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter Projects</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Campaign Type Filter */}
          <CampaignTypeFilter
            selectedTypes={localFilters.campaignTypes}
            onChange={(types) => setLocalFilters(prev => ({ ...prev, campaignTypes: types }))}
          />

          {/* Platforms Filter */}
          <PlatformFilter
            selectedPlatforms={localFilters.platforms}
            onTogglePlatform={handleTogglePlatform}
          />

          {/* Campaign Name Filter */}
          <CampaignNameFilter
            value={localFilters.campaignName}
            onChange={(value) => setLocalFilters(prev => ({ ...prev, campaignName: value }))}
          />

          {/* Month Started Filter */}
          <MonthYearFilter
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleClearFilters} className="text-sm">
            Clear Filters
          </Button>
          <Button onClick={handleApplyFilters} className="text-sm">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
