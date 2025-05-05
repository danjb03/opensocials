
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';

type ViewToggleProps = {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
};

export const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center bg-gray-50 p-1 rounded-lg shadow-sm mt-4 md:mt-0">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className="mr-1 px-3"
        onClick={() => onViewChange('grid')}
      >
        <LayoutGrid className="h-4 w-4 mr-1.5" />
        <span className="text-xs">Grid</span>
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        className="px-3"
        onClick={() => onViewChange('list')}
      >
        <LayoutList className="h-4 w-4 mr-1.5" />
        <span className="text-xs">List</span>
      </Button>
    </div>
  );
};
