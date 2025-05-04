
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ContentRequirement {
  type: string;
  quantity: number;
}

interface ContentRequirementsProps {
  requirements: {
    videos: { quantity: number };
    stories: { quantity: number };
    posts: { quantity: number };
  };
  onAdd: (type: 'videos' | 'stories' | 'posts') => void;
  onChange: (type: 'videos' | 'stories' | 'posts', quantity: number) => void;
}

export const ContentRequirements: React.FC<ContentRequirementsProps> = ({ 
  requirements, 
  onAdd, 
  onChange 
}) => {
  const contentTypes = ['videos', 'stories', 'posts'] as const;
  const contentOptions = ['TikTok Video', 'Instagram Reel', 'YouTube Short', 'Carousel Post', 'Instagram Story', 'Live Stream', 'Blog Post'];

  return (
    <div>
      <p className="font-medium mb-2">Content Requirements</p>
      {contentTypes.map((type) => (
        requirements[type].quantity > 0 && (
          <div key={type} className="flex gap-2 mb-2">
            <select 
              value={type} 
              className="flex-1 border p-2 rounded"
              disabled
            >
              <option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            </select>
            <Input 
              type="number" 
              value={requirements[type].quantity} 
              min={1} 
              onChange={(e) => onChange(type, parseInt(e.target.value) || 0)} 
              className="w-24" 
            />
          </div>
        )
      ))}
      <div className="flex flex-wrap gap-2">
        {contentTypes.map((type) => (
          requirements[type].quantity === 0 && (
            <Button key={type} type="button" variant="outline" onClick={() => onAdd(type)}>
              + Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          )
        ))}
      </div>
    </div>
  );
};
