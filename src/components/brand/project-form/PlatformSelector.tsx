
import React from 'react';
import { Button } from '@/components/ui/button';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onChange: (platforms: string[]) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  selectedPlatforms, 
  onChange 
}) => {
  const platformOptions = ['TikTok', 'Instagram', 'YouTube', 'Twitter', 'Facebook'];

  const handleTogglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div>
      <p className="font-medium mb-2">Platforms</p>
      <div className="flex flex-wrap gap-2">
        {platformOptions.map(platform => (
          <Button
            type="button"
            key={platform}
            variant={selectedPlatforms.includes(platform) ? 'default' : 'outline'}
            onClick={() => handleTogglePlatform(platform)}
          >
            {platform}
          </Button>
        ))}
      </div>
    </div>
  );
};
