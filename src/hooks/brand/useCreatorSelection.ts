
import { useState } from 'react';

interface Creator {
  id: number;
  name: string;
  platform: string;
  audience: string;
  contentType: string;
  location: string;
  bio?: string;
  skills?: string[];
  industries?: string[];
}

export const useCreatorSelection = () => {
  const [selectedCreators, setSelectedCreators] = useState<Creator[]>([]);

  const handleToggleCreator = (creator: Creator) => {
    setSelectedCreators(prev => {
      const isSelected = prev.some(c => c.id === creator.id);
      if (isSelected) {
        return prev.filter(c => c.id !== creator.id);
      } else {
        return [...prev, creator];
      }
    });
  };

  return {
    selectedCreators,
    setSelectedCreators,
    handleToggleCreator
  };
};
