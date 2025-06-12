
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Instagram, Video, PlayCircle, Zap, Image } from 'lucide-react';

const platformOptions = [
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" />, color: 'bg-pink-100 text-pink-700' },
  { value: 'tiktok', label: 'TikTok', icon: <Video className="h-4 w-4" />, color: 'bg-black text-white' },
  { value: 'youtube', label: 'YouTube', icon: <PlayCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
  { value: 'twitter', label: 'Twitter/X', icon: <Zap className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
  { value: 'linkedin', label: 'LinkedIn', icon: <Image className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformChange: (platform: string, checked: boolean) => void;
  error?: string;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onPlatformChange,
  error
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        Target Platforms *
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {platformOptions.map((platform) => (
          <Label
            key={platform.value}
            className={`
              flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all
              ${selectedPlatforms?.includes(platform.value)
                ? 'border-muted-foreground bg-muted text-foreground'
                : 'border-border hover:border-muted-foreground bg-card text-foreground'
              }
            `}
          >
            <Checkbox
              checked={selectedPlatforms?.includes(platform.value) || false}
              onCheckedChange={(checked) => 
                onPlatformChange(platform.value, checked as boolean)
              }
            />
            <div className={`p-1 rounded ${platform.color}`}>
              {platform.icon}
            </div>
            <span className="font-medium text-foreground">{platform.label}</span>
          </Label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
