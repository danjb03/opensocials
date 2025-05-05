
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
      className="group rounded-xl border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white"
    >
      <div className="flex flex-col md:flex-row items-start">
        {/* Creator image and info - larger on mobile, side by side on desktop */}
        <div className="relative md:w-[280px] overflow-hidden">
          <div className="aspect-video md:aspect-square w-full">
            <img 
              src={creator.imageUrl} 
              alt={creator.name} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {creator.matchScore && (
            <div className="absolute top-3 right-3 bg-black/80 text-white rounded-full px-2 py-1 text-xs font-semibold">
              {creator.matchScore}% Match
            </div>
          )}
        </div>
        
        {/* Creator details */}
        <div className="flex-1 p-5 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border-2 border-white mr-3 shadow-sm">
                  <AvatarImage src={creator.imageUrl} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{creator.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{creator.platform}</span>
                    <span className="mx-1.5">•</span>
                    <span>{creator.followers}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-50/80 hover:bg-gray-50 whitespace-nowrap">
                  {creator.audience}
                </Badge>
                <Badge variant="outline" className="bg-gray-50/80 hover:bg-gray-50 whitespace-nowrap">
                  {creator.contentType}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap my-4">
              <div className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {creator.engagement} engagement
              </div>
              <div className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm">
                {creator.priceRange}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-4">
              {creator.skills.slice(0, 5).map(skill => (
                <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {skill}
                </span>
              ))}
              {creator.skills.length > 5 && (
                <span className="text-xs px-2.5 py-0.5 text-muted-foreground">
                  +{creator.skills.length - 5} more
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={() => onToggleSelect(creator.id)}
              className="min-w-[140px]"
            >
              {isSelected ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Selected
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to Project
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewProfile(creator.id)}
                className="px-3"
              >
                <Info className="h-4 w-4 mr-1.5" />
                View Profile
              </Button>
              
              <Button
                size="sm"
                variant="default"
                onClick={handleInvite}
                disabled={isLoading?.[`invite-${creator.id}`]}
                className="px-3"
              >
                {isLoading?.[`invite-${creator.id}`] ? (
                  "Inviting..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1.5" />
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
