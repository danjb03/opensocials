
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ContentTypeSelectorProps {
  contentTypes: string[];
  setContentTypes: (types: string[]) => void;
}

const contentTypeOptions = [
  'Short Form Video',
  'Long Form Video', 
  'Photos',
  'Live Streaming',
  'Audio',
  'Text',
  'Podcasts',
  'Blog Posts',
  'Stories',
  'Reels',
  'IGTV',
  'YouTube Shorts',
  'TikTok Videos',
  'X Threads',
  'LinkedIn Articles',
  'Newsletter',
  'Webinars',
  'Tutorials',
  'Reviews',
  'Unboxing'
];

export function ContentTypeSelector({ contentTypes, setContentTypes }: ContentTypeSelectorProps) {
  const handleContentTypeToggle = (contentType: string) => {
    setContentTypes(
      contentTypes.includes(contentType) 
        ? contentTypes.filter(c => c !== contentType)
        : [...contentTypes, contentType]
    );
  };

  return (
    <div className="space-y-3">
      <Label>Content Formats * (select multiple)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {contentTypeOptions.map((contentType) => (
          <div key={contentType} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
            <Checkbox 
              id={`content-${contentType}`}
              checked={contentTypes.includes(contentType)}
              onCheckedChange={() => handleContentTypeToggle(contentType)}
            />
            <Label 
              htmlFor={`content-${contentType}`}
              className="cursor-pointer flex-grow text-sm"
            >
              {contentType}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
