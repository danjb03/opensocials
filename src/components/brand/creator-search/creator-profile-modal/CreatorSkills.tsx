
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

interface CreatorSkillsProps {
  skills?: string[];
}

export const CreatorSkills = ({ skills = [] }: CreatorSkillsProps) => {
  // Don't show the section if no skills are available
  if (!skills || skills.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-foreground" />
          Skills & Expertise
        </h3>
        
        <div className="bg-muted/30 border border-border rounded-xl p-4">
          <p className="text-muted-foreground text-center py-4">
            Content skills and specializations will be displayed here once the creator completes their profile.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-foreground" />
        Skills & Expertise
      </h3>
      
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-sm px-3 py-1 bg-secondary text-secondary-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
