
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { SkillsFilter, RelevanceFilter } from '@/components/brand/filters';

type CreatorFiltersProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterPlatform: string;
  onPlatformChange: (value: string) => void;
  filterAudience: string;
  onAudienceChange: (value: string) => void;
  filterContentType: string;
  onContentTypeChange: (value: string) => void;
  filterSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  minimumRelevance: number;
  onRelevanceChange: (value: number) => void;
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
  getActiveFilterCount: () => number;
};

export const CreatorFilters = ({
  searchTerm,
  onSearchChange,
  filterPlatform,
  onPlatformChange,
  filterAudience,
  onAudienceChange,
  filterContentType,
  onContentTypeChange,
  filterSkills,
  onSkillsChange,
  minimumRelevance,
  onRelevanceChange,
  isFilterSheetOpen,
  setIsFilterSheetOpen,
  resetFilters,
  getActiveFilterCount,
}: CreatorFiltersProps) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Input
            placeholder="Search creators..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Select value={filterPlatform} onValueChange={onPlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={filterAudience} onValueChange={onAudienceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Audiences</SelectItem>
              <SelectItem value="gen-z">Gen Z</SelectItem>
              <SelectItem value="millennials">Millennials</SelectItem>
              <SelectItem value="gen-x">Gen X</SelectItem>
              <SelectItem value="boomers">Boomers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <Button variant="outline" className="flex items-center gap-1.5 w-full" onClick={() => setIsFilterSheetOpen(true)}>
              <Filter className="h-4 w-4" />
              <span className="text-sm">Advanced Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-secondary rounded-full px-2 py-0.5 text-xs ml-1">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Refine your creator search with advanced filters
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <Select value={filterContentType} onValueChange={onContentTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
                
                <SkillsFilter 
                  skills={filterSkills}
                  onSkillsChange={onSkillsChange}
                />
                
                <RelevanceFilter
                  value={minimumRelevance}
                  onChange={onRelevanceChange}
                />
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setIsFilterSheetOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};
