
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
      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Skills & Expertise
      </h3>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="text-sm px-3 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No specific skills listed yet.</p>
        )}
      </div>
    </div>
  );
};
