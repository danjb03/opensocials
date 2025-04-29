
import { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { campaignTypeOptions } from '@/types/projects';

interface CampaignTypeFilterProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export function CampaignTypeFilter({ selectedTypes, onChange }: CampaignTypeFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Campaign Duration</h3>
      <ToggleGroup 
        type="multiple" 
        className="flex flex-wrap gap-2 justify-start"
        value={selectedTypes}
        onValueChange={(values) => onChange(values)}
      >
        {campaignTypeOptions.map((type) => (
          <ToggleGroupItem 
            key={type} 
            value={type} 
            className="rounded-md text-xs px-3 py-1"
          >
            {type}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
