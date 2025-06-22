
import React from 'react';

interface CreatorsSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterPlatform: string;
  onPlatformChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const CreatorsSearchFilters = ({
  searchTerm,
  onSearchChange,
  filterPlatform,
  onPlatformChange,
  viewMode,
  onViewModeChange
}: CreatorsSearchFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search creators..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-64 px-3 py-2 border border-border rounded-md bg-background text-foreground"
        />
        <select
          value={filterPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
        </select>
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as 'grid' | 'list')}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="grid">Grid View</option>
          <option value="list">List View</option>
        </select>
      </div>
    </div>
  );
};
