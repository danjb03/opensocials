
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { platformOptions } from '@/components/brand/filters/PlatformFilter';

interface CampaignDetailFormProps {
  updatedData: {
    title: string;
    description: string;
    budget: string;
    platforms: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePlatformToggle: (platform: string) => void;
}

const CampaignDetailForm: React.FC<CampaignDetailFormProps> = ({
  updatedData,
  handleChange,
  handlePlatformToggle
}) => {
  return (
    <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-white">Campaign Name</label>
        <Input
          name="title"
          value={updatedData.title}
          onChange={handleChange}
          className="bg-black border-gray-700 text-white focus-visible:ring-white focus-visible:border-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5 text-white">Description</label>
        <Textarea
          name="description"
          value={updatedData.description}
          onChange={handleChange}
          rows={3}
          className="bg-black border-gray-700 text-white focus-visible:ring-white focus-visible:border-white"
          placeholder="Add campaign description..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5 text-white">Budget</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            $
          </span>
          <Input
            name="budget"
            type="number"
            value={updatedData.budget}
            onChange={handleChange}
            className="pl-7 bg-black border-gray-700 text-white focus-visible:ring-white focus-visible:border-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5 text-white">Platforms</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {platformOptions.map((platform) => (
            <div key={platform} className="flex items-center space-x-2 p-2 border border-gray-700 rounded-md hover:bg-gray-900 bg-black">
              <Checkbox 
                id={`platform-${platform}`}
                checked={updatedData.platforms.includes(platform)}
                onCheckedChange={() => handlePlatformToggle(platform)}
                className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
              />
              <Label 
                htmlFor={`platform-${platform}`}
                className="cursor-pointer flex-grow text-white"
              >
                {platform}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailForm;
