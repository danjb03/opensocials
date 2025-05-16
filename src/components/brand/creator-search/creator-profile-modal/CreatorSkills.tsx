
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CreatorSkillsProps {
  skills: string[];
  className?: string;
}

export const CreatorSkills = ({ skills, className }: CreatorSkillsProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="font-medium text-sm">Skills</h3>
      <div className="flex flex-wrap gap-1">
        {skills && skills.length > 0 ? (
          skills.map(skill => (
            <Badge key={skill} variant="secondary" className="text-[10px]">
              {skill}
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground text-xs">No skills specified.</p>
        )}
      </div>
    </div>
  );
};
