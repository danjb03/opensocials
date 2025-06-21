
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorSkillsProps {
  skills: string[];
  className?: string;
}

export const CreatorSkills = ({ skills, className }: CreatorSkillsProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-foreground" />
        Skills & Expertise
      </h3>
      
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="text-sm px-3 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No specific skills listed yet.</p>
        )}
      </div>
    </div>
  );
};
