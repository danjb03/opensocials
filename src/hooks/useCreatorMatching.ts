
import { useMemo } from 'react';
import { calculateMatchScore } from '@/utils/creatorMatching';
import { Creator } from '@/types/creator';

type ProjectRequirements = {
  platforms?: string[];
  audience?: string;
  contentTypes?: string[];
  skills?: string[];
};

/**
 * Hook to calculate match scores for creators based on project requirements
 * Note: Currently disabled and returns random scores
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
  }, [creators]);

  return creatorsWithScores;
}
