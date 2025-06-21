
import React from 'react';
import { FileText } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorAboutProps {
  creator: Creator;
}

export const CreatorAbout = ({ creator }: CreatorAboutProps) => {
  // Use live bio data, with fallback only if completely empty
  const aboutText = creator.about || creator.bio || 'This creator has not provided a bio yet.';
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <FileText className="h-5 w-5 text-foreground" />
        About
      </h3>
      
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <p className="text-foreground leading-relaxed">
          {aboutText}
        </p>
      </div>
      
      {/* Show audience type if available */}
      {creator.audience && (
        <div className="bg-muted/30 border border-border rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-2">Target Audience</h4>
          <p className="text-muted-foreground">
            Primarily creates content for: <span className="font-medium text-foreground">{creator.audience}</span>
          </p>
        </div>
      )}
    </div>
  );
};
