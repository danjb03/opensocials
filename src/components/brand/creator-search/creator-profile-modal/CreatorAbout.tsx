
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
      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        About
      </h3>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-gray-700 leading-relaxed">
          {creator.about || "This creator hasn't added a detailed bio yet, but their content speaks for itself! Check out their social media profiles to see their amazing work."}
        </p>
      </div>
      
      {/* Industries */}
      {creator.industries && creator.industries.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Specializes In
          </h4>
          <div className="flex flex-wrap gap-2">
            {creator.industries.map(industry => (
              <span 
                key={industry} 
                className="bg-primary/10 text-primary border border-primary/20 text-sm px-3 py-1 rounded-full font-medium"
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
