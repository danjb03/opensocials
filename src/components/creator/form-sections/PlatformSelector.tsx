
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PlatformSelectorProps {
  platforms: string[];
  setPlatforms: (platforms: string[]) => void;
}

const platformOptions = [
  'TikTok',
  'Instagram', 
  'YouTube',
  'X',
  'Twitch',
  'LinkedIn',
  'Facebook',
  'Snapchat',
  'Pinterest'
];

export function PlatformSelector({ platforms, setPlatforms }: PlatformSelectorProps) {
  const [customPlatform, setCustomPlatform] = React.useState('');
  const [showOtherPlatform, setShowOtherPlatform] = React.useState(false);

  const handlePlatformToggle = (platform: string) => {
    if (platform === 'Other') {
      setShowOtherPlatform(!showOtherPlatform);
      if (showOtherPlatform) {
        setPlatforms(platforms.filter(p => platformOptions.includes(p)));
        setCustomPlatform('');
      }
      return;
    }

    setPlatforms(
      platforms.includes(platform) 
        ? platforms.filter(p => p !== platform)
        : [...platforms, platform]
    );
  };

  const handleCustomPlatformAdd = () => {
    if (customPlatform.trim() && !platforms.includes(customPlatform.trim())) {
      setPlatforms([...platforms, customPlatform.trim()]);
      setCustomPlatform('');
    }
  };

  const removePlatform = (platform: string) => {
    setPlatforms(platforms.filter(p => p !== platform));
  };

  return (
    <div className="space-y-3">
      <Label>Primary Platforms * (select multiple)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {platformOptions.map((platform) => (
          <div 
            key={platform} 
            className={`flex items-center space-x-2 p-3 border border-gray-600 rounded-md transition-all cursor-pointer ${
              platforms.includes(platform) 
                ? 'bg-white/10 border-white/40 text-white' 
                : 'bg-transparent hover:bg-gray-800 hover:border-gray-500 text-foreground'
            }`}
            onClick={() => handlePlatformToggle(platform)}
          >
            <Checkbox 
              id={`platform-${platform}`}
              checked={platforms.includes(platform)}
              onCheckedChange={() => handlePlatformToggle(platform)}
            />
            <Label 
              htmlFor={`platform-${platform}`}
              className="cursor-pointer flex-grow text-sm"
            >
              {platform}
            </Label>
          </div>
        ))}
        
        <div 
          className={`flex items-center space-x-2 p-3 border border-gray-600 rounded-md transition-all cursor-pointer ${
            showOtherPlatform 
              ? 'bg-white/10 border-white/40 text-white' 
              : 'bg-transparent hover:bg-gray-800 hover:border-gray-500 text-foreground'
          }`}
          onClick={() => handlePlatformToggle('Other')}
        >
          <Checkbox 
            id="platform-other"
            checked={showOtherPlatform}
            onCheckedChange={() => handlePlatformToggle('Other')}
          />
          <Label 
            htmlFor="platform-other"
            className="cursor-pointer flex-grow text-sm"
          >
            Other
          </Label>
        </div>
      </div>

      {showOtherPlatform && (
        <div className="flex gap-2">
          <Input
            value={customPlatform}
            onChange={(e) => setCustomPlatform(e.target.value)}
            placeholder="Enter custom platform name..."
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCustomPlatformAdd}
            disabled={!customPlatform.trim()}
          >
            Add
          </Button>
        </div>
      )}

      {platforms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <div 
              key={platform}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-sm border border-white/20"
            >
              {platform}
              <button
                type="button"
                onClick={() => removePlatform(platform)}
                className="ml-1 rounded-full hover:bg-white/20 p-1 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
