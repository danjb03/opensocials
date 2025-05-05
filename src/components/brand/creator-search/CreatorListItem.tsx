
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Info, Check, UserPlus } from 'lucide-react';
import { Creator } from '@/types/creator';
import { useCreatorInvitations } from '@/hooks/useCreatorInvitations';
import { useToast } from '@/hooks/use-toast';

type CreatorListItemProps = {
  creator: Creator;
  isSelected: boolean;
  onToggleSelect: (creatorId: number) => void;
  onViewProfile: (creatorId: number) => void;
};

export const CreatorListItem = ({ creator, isSelected, onToggleSelect, onViewProfile }: CreatorListItemProps) => {
  const { handleInviteCreator, isLoading } = useCreatorInvitations();
  const { toast } = useToast();

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleInviteCreator(creator.id.toString(), creator.name);
    toast({
      title: "Creator invited",
      description: `${creator.name} has been invited to collaborate.`,
    });
  };

  return (
    <div 
      className="group rounded-md border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white"
    >
      <div className="flex items-start">
        {/* Creator image - mid-sized */}
        <div className="relative w-24 overflow-hidden">
          <div className="aspect-square w-full">
            <img 
              src={creator.imageUrl} 
              alt={creator.name} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {creator.matchScore && (
            <div className="absolute top-1 right-1 bg-black/80 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold">
              {creator.matchScore}%
            </div>
          )}
        </div>
        
        {/* Creator details - balanced size */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 border-[1px] border-white mr-1.5 shadow-sm">
                  <AvatarImage src={creator.imageUrl} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm">{creator.name}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{creator.platform}</span>
                    <span className="mx-1">•</span>
                    <span>{creator.followers}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-gray-50/80 hover:bg-gray-50 whitespace-nowrap text-xs px-2 py-0.5">
                  {creator.audience}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 flex-wrap my-1.5">
              <div className="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-xs">
                {creator.engagement}
              </div>
              <div className="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-xs">
                {creator.priceRange}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-1.5">
              {creator.skills.slice(0, 2).map(skill => (
                <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                  {skill}
                </span>
              ))}
              {creator.skills.length > 2 && (
                <span className="text-xs px-1 py-0.5 text-muted-foreground">
                  +{creator.skills.length - 2}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2">
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={() => onToggleSelect(creator.id)}
              className="h-8 text-xs px-2.5"
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
            
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewProfile(creator.id)}
                className="h-8 text-xs px-2.5"
              >
                <Info className="h-3.5 w-3.5 mr-1" />
                View
              </Button>
              
              <Button
                size="sm"
                variant="default"
                onClick={handleInvite}
                disabled={isLoading?.[`invite-${creator.id}`]}
                className="h-8 text-xs px-2.5"
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
      </div>
    </div>
  );
};
