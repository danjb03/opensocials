
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { Creator } from '@/types/creator';
import { CreatorSocialLinks } from './CreatorSocialLinks';

interface CreatorHeaderProps {
  creator: Creator;
}

export const CreatorHeader = ({ creator }: CreatorHeaderProps) => {
  return (
    <>
      <div className="relative">
        {/* Banner image */}
        <div className="h-16 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20">
          {creator.bannerImageUrl && (
            <img 
              src={creator.bannerImageUrl} 
              alt="" 
              className="w-full h-full object-cover opacity-90" 
            />
          )}
        </div>
        
        {/* Avatar */}
        <Avatar className="absolute w-12 h-12 -bottom-6 left-4 border-3 border-background">
          <AvatarImage src={creator.imageUrl} alt={creator.name} />
          <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex justify-between items-start mb-3 pt-8 px-0">
        <div>
          <h2 className="text-base font-bold">{creator.name}</h2>
          <p className="text-muted-foreground text-xs">{creator.platform} Creator</p>
          <CreatorSocialLinks socialLinks={creator.socialLinks} />
        </div>
        
        <div className="flex flex-col gap-1 items-end">
          <Badge variant="secondary" className="text-[10px] py-0.5">
            {creator.audience}
          </Badge>
          <Badge variant="outline" className="text-[10px] py-0.5">
            {creator.contentType}
          </Badge>
          {creator.audienceLocation && (
            <Badge variant="secondary" className="text-[10px] py-0.5 flex items-center gap-1">
              <Globe className="h-2 w-2" />
              {creator.audienceLocation.primary}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};
