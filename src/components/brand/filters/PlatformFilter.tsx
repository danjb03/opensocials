
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-100 text-pink-800' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-purple-100 text-purple-800' },
  { id: 'youtube', name: 'YouTube', color: 'bg-red-100 text-red-800' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-100 text-blue-800' },
  { id: 'twitter', name: 'Twitter', color: 'bg-sky-100 text-sky-800' },
];

interface PlatformFilterProps {
  selectedPlatforms: string[];
  onChange: (platforms: string[]) => void;
  className?: string;
}

export const PlatformFilter: React.FC<PlatformFilterProps> = ({
  selectedPlatforms,
  onChange,
  className = ""
}) => {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onChange(selectedPlatforms.filter(p => p !== platformId));
    } else {
      onChange([...selectedPlatforms, platformId]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Platforms</h3>
        {selectedPlatforms.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(platform => {
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <Badge
              key={platform.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 font-light ${
                isSelected 
                  ? platform.color 
                  : 'hover:bg-muted border-border'
              }`}
              onClick={() => togglePlatform(platform.id)}
            >
              {platform.name}
              {isSelected && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
