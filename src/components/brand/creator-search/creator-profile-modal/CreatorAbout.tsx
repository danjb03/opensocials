
import React from 'react';
import { Creator } from '@/types/creator';
import { FileText, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorAboutProps {
  creator: Creator;
  className?: string;
}

export const CreatorAbout = ({ creator, className }: CreatorAboutProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <FileText className="h-5 w-5 text-foreground" />
        About
      </h3>
      
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <p className="text-foreground leading-relaxed">
          {creator.about || "This creator hasn't added a detailed bio yet, but their content speaks for itself! Check out their social media profiles to see their amazing work."}
        </p>
      </div>
      
      {/* Industries */}
      {creator.industries && creator.industries.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-foreground" />
            Specializes In
          </h4>
          <div className="flex flex-wrap gap-2">
            {creator.industries.map(industry => (
              <span 
                key={industry} 
                className="bg-muted/50 text-foreground border border-border text-sm px-3 py-1 rounded-full font-medium"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
