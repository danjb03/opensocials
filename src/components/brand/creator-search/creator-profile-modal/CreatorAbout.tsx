
import React from 'react';
import { Creator } from '@/types/creator';

interface CreatorAboutProps {
  creator: Creator;
}

export const CreatorAbout = ({ creator }: CreatorAboutProps) => {
  return (
    <div className="space-y-1">
      <h3 className="font-medium text-sm">About Me</h3>
      <p className="text-muted-foreground text-xs">
        {creator.about || "No information provided."}
      </p>
    </div>
  );
};
