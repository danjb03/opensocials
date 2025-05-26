
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Info, Check, UserPlus } from 'lucide-react';
import { Creator } from '@/types/creator';
import { useCreatorInvitationActions } from '@/hooks/useCreatorInvitationActions';
import { useToast } from '@/hooks/use-toast';

type CreatorListItemProps = {
  creator: Creator;
  isSelected: boolean;
  onToggleSelect: (creatorId: number) => void;
  onViewProfile: (creatorId: number) => void;
};

export const CreatorListItem = ({ creator, isSelected, onToggleSelect, onViewProfile }: CreatorListItemProps) => {
  const { handleInviteCreator, isLoading } = useCreatorInvitationActions();
  const { toast } = useToast();

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Convert number to string for the invitation hook
    handleInviteCreator(creator.id.toString(), creator.name);
    toast({
      title: "Creator invited",
      description: `${creator.name} has been invited to collaborate.`,
    });
  };

  return (
    <div 
      className="group rounded-md border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow transition-all duration-300 overflow-hidden bg-white w-full"
    >
      {/* Creator image */}
      <div className="flex items-center p-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-md mr-4 flex-shrink-0">
          <img 
            src={creator.imageUrl} 
            alt={creator.name} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          
          {creator.matchScore && (
            <div className="absolute top-1 right-1 bg-black/80 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold">
              {creator.matchScore}%
            </div>
          )}
        </div>
        
        {/* Creator details - main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <h3 className="font-bold text-sm truncate">{creator.name}</h3>
              <div className="flex items-center ml-2">
                <span className="text-xs text-muted-foreground">{creator.platform}</span>
                <span className="mx-1 text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{creator.followers}</span>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-gray-50/80 hover:bg-gray-50 whitespace-nowrap text-xs px-2 py-0.5">
              {creator.audience}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1.5 flex-wrap my-1">
            <div className="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-xs">
              {creator.engagement}
            </div>
            <div className="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-xs">
              {creator.priceRange}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {creator.skills.slice(0, 3).map(skill => (
              <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
            {creator.skills.length > 3 && (
              <span className="text-xs px-1 py-0.5 text-muted-foreground">
                +{creator.skills.length - 3}
              </span>
            )}
          </div>
        </div>
        
        {/* Actions section */}
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={() => onToggleSelect(creator.id)}
            className="h-8 text-xs whitespace-nowrap"
          >
            {isSelected ? (
              <>
                <Check className="mr-1 h-3.5 w-3.5" />
                Selected
              </>
            ) : (
              <>
                <PlusCircle className="mr-1 h-3.5 w-3.5" />
                Add
              </>
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProfile(creator.id)}
            className="h-8 text-xs"
          >
            <Info className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          
          <Button
            size="sm"
            variant="default"
            onClick={handleInvite}
            disabled={isLoading?.[`invite-${creator.id}`]}
            className="h-8 text-xs whitespace-nowrap"
          >
            {isLoading?.[`invite-${creator.id}`] ? (
              "..."
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Invite
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
