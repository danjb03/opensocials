
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Creator } from '@/types/creator';

interface CreatorSkillsProps {
  skills: string[];
}

export const CreatorSkills = ({ skills }: CreatorSkillsProps) => {
  return (
    <div className="space-y-1">
      <h3 className="font-medium text-sm">Skills</h3>
      <div className="flex flex-wrap gap-1">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary" className="text-[10px]">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};
