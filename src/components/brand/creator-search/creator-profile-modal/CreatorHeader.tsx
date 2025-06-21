
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Calendar, Users } from 'lucide-react';
import { Creator } from '@/types/creator';
import { CreatorSocialLinks } from './CreatorSocialLinks';

interface CreatorHeaderProps {
  creator: Creator;
}

export const CreatorHeader = ({ creator }: CreatorHeaderProps) => {
  return (
    <>
      <div className="relative">
        {/* Enhanced Banner with black background theme */}
        <div className="h-32 w-full overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-secondary/30 rounded-xl relative">
          {creator.bannerImageUrl && (
            <img 
              src={creator.bannerImageUrl} 
              alt="" 
              className="w-full h-full object-cover" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        
        {/* Enhanced Avatar */}
        <Avatar className="absolute w-20 h-20 -bottom-10 left-6 border-4 border-background shadow-lg">
          <AvatarImage src={creator.imageUrl} alt={creator.name} />
          <AvatarFallback className="text-xl font-bold bg-muted text-foreground">
            {creator.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="pt-12 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Name and Platform */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{creator.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">{creator.platform} Creator</span>
                <span className="text-muted-foreground/50">•</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{creator.followers} followers</span>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            {creator.about && (
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {creator.about}
              </p>
            )}
            
            {/* Location and Join Date */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {creator.audienceLocation && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{creator.audienceLocation.primary}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Creator since 2023</span>
              </div>
            </div>
            
            {/* Social Links */}
            <CreatorSocialLinks socialLinks={creator.socialLinks} />
          </div>
          
          {/* Tags and Badges */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex flex-wrap gap-2 justify-end">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {creator.audience}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {creator.contentType}
              </Badge>
              {creator.audienceLocation && (
                <Badge variant="secondary" className="text-sm px-3 py-1 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {creator.audienceLocation.primary}
                </Badge>
              )}
            </div>
            
            {/* Match Score if available */}
            {creator.matchScore && (
              <div className="bg-muted border border-border rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-foreground">{creator.matchScore}%</div>
                <div className="text-xs text-muted-foreground font-medium">Match Score</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
