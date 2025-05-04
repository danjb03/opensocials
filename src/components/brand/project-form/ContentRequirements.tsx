
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContentRequirement {
  type: string;
  quantity: number;
}

interface ContentRequirementsProps {
  requirements: ContentRequirement[];
  onAdd: () => void;
  onChange: (index: number, field: string, value: string | number) => void;
}

export const ContentRequirements: React.FC<ContentRequirementsProps> = ({ 
  requirements, 
  onAdd, 
  onChange 
}) => {
  const contentOptions = ['TikTok Video', 'Instagram Reel', 'YouTube Short', 'Carousel Post', 'Instagram Story', 'Live Stream', 'Blog Post'];

  return (
    <div>
      <p className="font-medium mb-2">Content Requirements</p>
      {requirements.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <select 
            value={item.type} 
            onChange={(e) => onChange(index, 'type', e.target.value)} 
            className="flex-1 border p-2 rounded"
          >
            <option value="">Select Content Type</option>
            {contentOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <Input 
            type="number" 
            value={item.quantity} 
            min={1} 
            onChange={(e) => onChange(index, 'quantity', parseInt(e.target.value))} 
            className="w-24" 
          />
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={onAdd}>
        + Add Content Type
      </Button>
    </div>
  );
};
