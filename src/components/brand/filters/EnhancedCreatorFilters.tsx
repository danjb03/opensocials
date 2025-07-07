
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Filter, ChevronDown, ChevronUp, RotateCcw, Save, Bookmark } from 'lucide-react';

import { SearchFilter } from './SearchFilter';
import { PlatformFilter } from './PlatformFilter';
import { RangeFilter } from './RangeFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { CreatorFilters } from '@/hooks/brand/useUnifiedCreatorFilters';

interface EnhancedCreatorFiltersProps {
  filters: CreatorFilters;
  updateFilter: (key: keyof CreatorFilters, value: any) => void;
  resetFilters: () => void;
  getActiveFilterCount: () => number;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (open: boolean) => void;
  resultCount: number;
  totalCount: number;
  savedFilters: { name: string; filters: CreatorFilters }[];
  saveFilterSet: (name: string) => void;
  loadFilterSet: (filterSet: { name: string; filters: CreatorFilters }) => void;
}

const CONTENT_TYPES = [
  { id: 'video', name: 'Video Content', count: 156 },
  { id: 'photo', name: 'Photo Content', count: 243 },
  { id: 'story', name: 'Stories', count: 189 },
  { id: 'reel', name: 'Reels', count: 134 },
  { id: 'review', name: 'Product Reviews', count: 87 },
  { id: 'unboxing', name: 'Unboxing', count: 76 },
  { id: 'tutorial', name: 'Tutorials', count: 65 },
  { id: 'lifestyle', name: 'Lifestyle', count: 198 }
];

const INDUSTRIES = [
  { id: 'fashion', name: 'Fashion & Style', count: 234 },
  { id: 'beauty', name: 'Beauty & Cosmetics', count: 198 },
  { id: 'fitness', name: 'Fitness & Health', count: 167 },
  { id: 'food', name: 'Food & Beverage', count: 145 },
  { id: 'travel', name: 'Travel & Lifestyle', count: 132 },
  { id: 'tech', name: 'Technology', count: 89 },
  { id: 'home', name: 'Home & Decor', count: 76 },
  { id: 'parenting', name: 'Parenting', count: 54 }
];

const AUDIENCE_LOCATIONS = [
  { id: 'us', name: 'United States' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'ca', name: 'Canada' },
  { id: 'au', name: 'Australia' },
  { id: 'de', name: 'Germany' },
  { id: 'fr', name: 'France' },
  { id: 'es', name: 'Spain' },
  { id: 'it', name: 'Italy' }
];

export const EnhancedCreatorFilters: React.FC<EnhancedCreatorFiltersProps> = ({
  filters,
  updateFilter,
  resetFilters,
  getActiveFilterCount,
  isAdvancedOpen,
  setIsAdvancedOpen,
  resultCount,
  totalCount,
  savedFilters,
  saveFilterSet,
  loadFilterSet
}) => {
  const activeFilterCount = getActiveFilterCount();
  const [metricsExpanded, setMetricsExpanded] = React.useState(false);
  const [contentExpanded, setContentExpanded] = React.useState(false);
  const [demographicsExpanded, setDemographicsExpanded] = React.useState(false);

  const formatFollowerCount = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const formatPrice = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Quick Filters Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <SearchFilter
          value={filters.search}
          onChange={(value) => updateFilter('search', value)}
          className="flex-1 min-w-[300px]"
        />
        
        <div className="flex items-center gap-2">
          <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="font-light">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 font-light">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[400px] sm:w-[500px]">
              <SheetHeader>
                <SheetTitle className="font-light">Advanced Filters</SheetTitle>
                <div className="text-sm text-muted-foreground font-light">
                  Showing {resultCount.toLocaleString()} of {totalCount.toLocaleString()} creators
                </div>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Saved Filters */}
                {savedFilters.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground">Saved Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {savedFilters.map((filterSet, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => loadFilterSet(filterSet)}
                          className="font-light"
                        >
                          <Bookmark className="h-3 w-3 mr-1" />
                          {filterSet.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platform Filter */}
                <PlatformFilter
                  selectedPlatforms={filters.platforms}
                  onChange={(platforms) => updateFilter('platforms', platforms)}
                />

                {/* Audience Metrics */}
                <Collapsible open={metricsExpanded} onOpenChange={setMetricsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 font-medium">
                      Audience Metrics
                      {metricsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-3">
                    <RangeFilter
                      label="Follower Count"
                      min={0}
                      max={10000000}
                      value={[filters.followerCountMin, filters.followerCountMax]}
                      onChange={(value) => {
                        updateFilter('followerCountMin', value[0]);
                        updateFilter('followerCountMax', value[1]);
                      }}
                      step={1000}
                      formatValue={formatFollowerCount}
                    />
                    
                    <RangeFilter
                      label="Engagement Rate (%)"
                      min={0}
                      max={20}
                      value={[filters.engagementRateMin, filters.engagementRateMax]}
                      onChange={(value) => {
                        updateFilter('engagementRateMin', value[0]);
                        updateFilter('engagementRateMax', value[1]);
                      }}
                      step={0.1}
                      formatValue={(v) => `${v}%`}
                    />
                  </CollapsibleContent>
                </Collapsible>

                {/* Content & Skills */}
                <Collapsible open={contentExpanded} onOpenChange={setContentExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 font-medium">
                      Content & Skills
                      {contentExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-3">
                    <MultiSelectFilter
                      label="Content Types"
                      options={CONTENT_TYPES}
                      selectedValues={filters.contentTypes}
                      onChange={(values) => updateFilter('contentTypes', values)}
                      placeholder="Select content types..."
                    />
                    
                    <MultiSelectFilter
                      label="Industries"
                      options={INDUSTRIES}
                      selectedValues={filters.industries}
                      onChange={(values) => updateFilter('industries', values)}
                      placeholder="Select industries..."
                    />
                  </CollapsibleContent>
                </Collapsible>

                {/* Demographics */}
                <Collapsible open={demographicsExpanded} onOpenChange={setDemographicsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 font-medium">
                      Demographics
                      {demographicsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-3">
                    <MultiSelectFilter
                      label="Audience Location"
                      options={AUDIENCE_LOCATIONS}
                      selectedValues={filters.audienceLocations}
                      onChange={(values) => updateFilter('audienceLocations', values)}
                      placeholder="Select locations..."
                    />
                    
                    <RangeFilter
                      label="Price Range"
                      min={0}
                      max={10000}
                      value={[filters.priceRangeMin, filters.priceRangeMax]}
                      onChange={(value) => {
                        updateFilter('priceRangeMin', value[0]);
                        updateFilter('priceRangeMax', value[1]);
                      }}
                      step={50}
                      formatValue={formatPrice}
                    />
                  </CollapsibleContent>
                </Collapsible>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="flex-1 font-light"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const name = prompt('Enter name for this filter set:');
                      if (name) saveFilterSet(name);
                    }}
                    className="font-light"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              onClick={resetFilters}
              className="font-light"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="font-light">
              Search: "{filters.search}"
              <button 
                onClick={() => updateFilter('search', '')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filters.platforms.map(platform => (
            <Badge key={platform} variant="secondary" className="font-light">
              Platform: {platform}
              <button 
                onClick={() => updateFilter('platforms', filters.platforms.filter(p => p !== platform))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          
          {filters.contentTypes.map(type => (
            <Badge key={type} variant="secondary" className="font-light">
              Content: {CONTENT_TYPES.find(ct => ct.id === type)?.name || type}
              <button 
                onClick={() => updateFilter('contentTypes', filters.contentTypes.filter(ct => ct !== type))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          
          {filters.industries.map(industry => (
            <Badge key={industry} variant="secondary" className="font-light">
              Industry: {INDUSTRIES.find(ind => ind.id === industry)?.name || industry}
              <button 
                onClick={() => updateFilter('industries', filters.industries.filter(ind => ind !== industry))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground font-light">
        <span>
          Showing {resultCount.toLocaleString()} of {totalCount.toLocaleString()} creators
          {activeFilterCount > 0 && ` with ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'} applied`}
        </span>
      </div>
    </div>
  );
};
