
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
};

type ProjectRequirements = {
  platforms?: string[];
  audience?: string;
  contentTypes?: string[];
  skills?: string[];
};

/**
 * Calculate a match score for a creator based on project requirements
 * @param creator The creator to evaluate
 * @param requirements The project requirements to match against
 * @returns A score between 0 and 100
 */
export const calculateMatchScore = (creator: Creator, requirements: ProjectRequirements): number => {
  let totalScore = 0;
  let totalWeight = 0;
  
  // Platform match (weight: 30)
  if (requirements.platforms && requirements.platforms.length > 0) {
    const weight = 30;
    totalWeight += weight;
    
    if (requirements.platforms.includes(creator.platform)) {
      totalScore += weight;
    }
  }
  
  // Audience match (weight: 25)
  if (requirements.audience) {
    const weight = 25;
    totalWeight += weight;
    
    if (creator.audience === requirements.audience) {
      totalScore += weight;
    }
  }
  
  // Content type match (weight: 20)
  if (requirements.contentTypes && requirements.contentTypes.length > 0) {
    const weight = 20;
    totalWeight += weight;
    
    if (requirements.contentTypes.includes(creator.contentType)) {
      totalScore += weight;
    }
  }
  
  // Skills match (weight: 25)
  if (requirements.skills && requirements.skills.length > 0) {
    const weight = 25;
    totalWeight += weight;
    
    // Calculate how many required skills the creator has
    const matchedSkills = creator.skills.filter(skill => 
      requirements.skills?.some(reqSkill => 
        skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
    
    // Calculate percentage of matched skills
    const skillScore = requirements.skills.length > 0 
      ? (matchedSkills / requirements.skills.length) * weight
      : 0;
      
    totalScore += skillScore;
  }
  
  // If no specific requirements, return a default score
  if (totalWeight === 0) return 70 + Math.floor(Math.random() * 30);
  
  // Calculate final score (0-100)
  const finalScore = Math.round((totalScore / totalWeight) * 100);
  
  return finalScore;
};
