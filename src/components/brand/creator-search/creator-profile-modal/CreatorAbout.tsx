
import React from 'react';
import { Creator } from '@/types/creator';
import { cn } from '@/lib/utils';

interface CreatorAboutProps {
  creator: Creator;
  className?: string;
}

export const CreatorAbout = ({ creator, className }: CreatorAboutProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="font-medium text-sm">About Me</h3>
      <p className="text-muted-foreground text-xs">
        {creator.about || "No information provided."}
      </p>
    </div>
  );
};
