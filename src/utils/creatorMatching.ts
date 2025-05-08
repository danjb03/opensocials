
import { Creator } from '@/types/creator';

type ProjectRequirements = {
  platforms?: string[];
  audience?: string;
  contentTypes?: string[];
  skills?: string[];
  location?: string;
  industries?: string[];
};

/**
 * Calculate a match score for a creator based on project requirements
 */
export const calculateMatchScore = (creator: Creator, requirements: ProjectRequirements): number => {
  let score = 0;
  
  // Platform match
  if (requirements.platforms?.includes(creator.platform)) {
    score += 20;
  }
  
  // Audience match
  if (requirements.audience === creator.audience) {
    score += 20;
  }
  
  // Content type match
  if (requirements.contentTypes?.includes(creator.contentType)) {
    score += 15;
  }
  
  // Skills match - award points for each matching skill
  if (requirements.skills && requirements.skills.length > 0) {
    const matchingSkills = creator.skills.filter(skill => 
      requirements.skills?.includes(skill)
    );
    score += matchingSkills.length * 5; // 5 points per matching skill (up to 20 points)
  }
  
  // Industry match - award points for each matching industry (new)
  if (requirements.industries && requirements.industries.length > 0 && creator.industries) {
    const matchingIndustries = creator.industries.filter(industry => 
      requirements.industries?.includes(industry)
    );
    score += matchingIndustries.length * 7; // 7 points per matching industry (up to 21 points)
  }
  
  // Location match
  if (requirements.location && creator.audienceLocation) {
    if (creator.audienceLocation.primary.toLowerCase().includes(requirements.location.toLowerCase())) {
      score += 15; // Primary location is a strong match
    } else if (creator.audienceLocation.secondary?.some(loc => 
      loc.toLowerCase().includes(requirements.location.toLowerCase())
    )) {
      score += 10; // Secondary location is still good
    }
  }
  
  return Math.min(score, 100); // Cap at 100
};
