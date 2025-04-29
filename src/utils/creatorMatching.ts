// This file is currently not in use as the creator matching functionality has been temporarily disabled
import { Creator } from '@/types/creator';

type ProjectRequirements = {
  platforms?: string[];
  audience?: string;
  contentTypes?: string[];
  skills?: string[];
};

/**
 * Calculate a match score for a creator based on project requirements
 * NOTE: This function is currently disabled and not in use
 */
export const calculateMatchScore = (creator: Creator, requirements: ProjectRequirements): number => {
  // Implementation temporarily removed
  return 0;
};
