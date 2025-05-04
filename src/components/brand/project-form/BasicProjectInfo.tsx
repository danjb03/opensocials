
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BasicProjectInfoProps {
  name: string;
  description: string;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicProjectInfo: React.FC<BasicProjectInfoProps> = ({
  name,
  description,
  showAdvanced,
  setShowAdvanced,
  onChange,
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Project Name</label>
        <Input
          placeholder="Project Name"
          name="name"
          value={name}
          onChange={onChange}
          required
          className="border-slate-300 focus-visible:ring-blue-500"
        />
      </div>

      <div>
        <button
          type="button"
          className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 w-full justify-start px-2 py-1 rounded transition-colors"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
          Additional Details
        </button>
      </div>

      {showAdvanced && (
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            placeholder="Add posting times, hashtag guidelines, tone of voice..."
            name="description"
            value={description}
            onChange={onChange}
            className="min-h-[120px] border-slate-300 focus-visible:ring-blue-500"
          />
        </div>
      )}
    </>
  );
};
