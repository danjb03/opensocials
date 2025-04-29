
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { campaignTypeOptions } from '@/types/projects';

type CampaignTypeFilterProps = {
  selectedCampaignTypes: string[];
  onFilterChange: (value: string[]) => void;
};

export const CampaignTypeFilter: React.FC<CampaignTypeFilterProps> = ({
  selectedCampaignTypes,
  onFilterChange
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">Filter by Campaign Type:</h2>
      <ToggleGroup 
        type="multiple"
        className="flex flex-wrap gap-2"
        value={selectedCampaignTypes}
        onValueChange={onFilterChange}
      >
        {campaignTypeOptions.map((type) => (
          <ToggleGroupItem 
            key={type} 
            value={type}
            variant="outline"
            className="px-4 py-2 text-sm bg-white data-[state=on]:bg-black data-[state=on]:text-white"
          >
            {type}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
