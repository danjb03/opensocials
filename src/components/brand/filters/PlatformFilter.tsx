
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PlatformFilterProps {
  selectedPlatforms: string[];
  onTogglePlatform: (platform: string) => void;
}

const platformOptions = ['TikTok', 'Instagram', 'YouTube', 'Twitter', 'Facebook'];

export function PlatformFilter({ selectedPlatforms, onTogglePlatform }: PlatformFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Platforms</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {platformOptions.map((platform) => (
          <div key={platform} className="flex items-center space-x-2">
            <Checkbox 
              id={`platform-${platform}`} 
              checked={selectedPlatforms.includes(platform)}
              onCheckedChange={() => onTogglePlatform(platform)}
            />
            <Label htmlFor={`platform-${platform}`} className="text-sm">{platform}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export { platformOptions };
