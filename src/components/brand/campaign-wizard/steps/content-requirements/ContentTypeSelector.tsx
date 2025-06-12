
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const contentTypeOptions = [
  { value: 'post', label: 'Feed Posts', description: 'Standard social media posts' },
  { value: 'story', label: 'Stories', description: '24-hour temporary content' },
  { value: 'reel', label: 'Reels/Short Videos', description: 'Short-form vertical videos' },
  { value: 'video', label: 'Long-form Videos', description: 'YouTube videos, IGTV' },
  { value: 'live', label: 'Live Streams', description: 'Real-time streaming content' },
  { value: 'carousel', label: 'Carousel Posts', description: 'Multi-image/video posts' },
];

interface ContentTypeSelectorProps {
  selectedContentTypes: string[];
  onContentTypeChange: (contentType: string, checked: boolean) => void;
  error?: string;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedContentTypes,
  onContentTypeChange,
  error
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        Content Types *
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contentTypeOptions.map((contentType) => (
          <Label
            key={contentType.value}
            className={`
              flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all
              ${selectedContentTypes?.includes(contentType.value)
                ? 'border-muted-foreground bg-muted text-foreground'
                : 'border-border hover:border-muted-foreground bg-card text-foreground'
              }
            `}
          >
            <Checkbox
              checked={selectedContentTypes?.includes(contentType.value) || false}
              onCheckedChange={(checked) => 
                onContentTypeChange(contentType.value, checked as boolean)
              }
              className="mt-1"
            />
            <div className="space-y-1">
              <span className="font-medium text-foreground">{contentType.label}</span>
              <p className="text-sm text-muted-foreground">{contentType.description}</p>
            </div>
          </Label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
