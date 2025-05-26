
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const contentTypes = [
  'Photo Posts',
  'Video Content',
  'Stories',
  'Reels/TikToks',
  'Live Streams',
  'Blog Posts',
  'Tutorials',
  'Reviews'
];

interface ContentTypeSelectionProps {
  selectedTypes: string[];
  onContentTypeToggle: (contentType: string) => void;
}

export const ContentTypeSelection = ({ selectedTypes, onContentTypeToggle }: ContentTypeSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Content Types</Label>
      <div className="grid grid-cols-2 gap-2">
        {contentTypes.map((type) => (
          <Button
            key={type}
            type="button"
            variant={selectedTypes.includes(type) ? "default" : "outline"}
            size="sm"
            onClick={() => onContentTypeToggle(type)}
            className="justify-start"
          >
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
};
