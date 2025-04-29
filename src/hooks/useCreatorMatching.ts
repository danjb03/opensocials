
import { useMemo } from 'react';
import { calculateMatchScore } from '@/utils/creatorMatching';

type Creator = {
  id: number;
  name: string;
  platform: string;
  audience: string;
  contentType: string;
  followers: string;
  engagement: string;
  priceRange: string;
  skills: string[];
  imageUrl: string;
  matchScore?: number;
};

type ProjectRequirements = {
  platforms?: string[];
  audience?: string;
  contentTypes?: string[];
  skills?: string[];
};

/**
 * Hook to calculate match scores for creators based on project requirements
 */
export function useCreatorMatching(
  creators: Creator[],
  requirements: ProjectRequirements
) {
  const creatorsWithScores = useMemo(() => {
    return creators.map(creator => ({
      ...creator,
      matchScore: calculateMatchScore(creator, requirements)
    }));
  }, [creators, requirements]);

  return creatorsWithScores;
}
