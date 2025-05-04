
import React from 'react';
import { Button } from '@/components/ui/button';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onChange: (platform: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  selectedPlatforms, 
  onChange 
}) => {
  const platformOptions = ['TikTok', 'Instagram', 'YouTube', 'Twitter', 'Facebook'];

  return (
    <div>
      <p className="font-medium mb-2">Platforms</p>
      <div className="flex flex-wrap gap-2">
        {platformOptions.map(platform => (
          <Button
            type="button"
            key={platform}
            variant={selectedPlatforms.includes(platform) ? 'default' : 'outline'}
            onClick={() => onChange(platform)}
          >
            {platform}
          </Button>
        ))}
      </div>
    </div>
  );
};
