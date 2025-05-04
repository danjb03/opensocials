
import React from 'react';
import { Button } from '@/components/ui/button';

interface CampaignTypeSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export const CampaignTypeSelector: React.FC<CampaignTypeSelectorProps> = ({ 
  selectedTypes, 
  onChange 
}) => {
  const campaignOptions = ['single', 'weekly', 'monthly', '12-Month Retainer', 'evergreen'];
  
  const handleToggleType = (option: string) => {
    onChange(
      selectedTypes.includes(option)
        ? selectedTypes.filter(t => t !== option)
        : [option]
    );
  };
  
  return (
    <div>
      <p className="font-medium mb-2">Campaign Type</p>
      <div className="flex flex-wrap gap-2">
        {campaignOptions.map(option => (
          <Button
            type="button"
            key={option}
            variant={selectedTypes.includes(option) ? 'default' : 'outline'}
            onClick={() => handleToggleType(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};
