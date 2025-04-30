
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

interface CreatorProfileHeaderProps {
  name: string;
  imageUrl?: string;
  bannerUrl?: string;
  bio: string;
  platform?: string;
  followers?: string;
  isEditable?: boolean;
  onEditProfile?: () => void;
  onTogglePreview?: () => void;
  isPreviewMode?: boolean;
}

const CreatorProfileHeader: React.FC<CreatorProfileHeaderProps> = ({
  name,
  imageUrl,
  bannerUrl,
  bio,
  platform,
  followers,
  isEditable = false,
  onEditProfile,
  onTogglePreview,
  isPreviewMode = false
}) => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div 
        className="w-full h-48 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg relative overflow-hidden"
      >
        {bannerUrl && (
          <img 
            src={bannerUrl} 
            alt="Profile banner" 
            className="w-full h-full object-cover"
          />
        )}
        {isEditable && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white"
              onClick={onTogglePreview}
            >
              <Eye className="mr-1" size={16} />
              {isPreviewMode ? "Exit Preview" : "Preview"}
            </Button>
            <Button 
              onClick={onEditProfile}
              size="sm" 
              variant="default"
            >
              <Edit className="mr-1" size={16} />
              Edit Profile
            </Button>
          </div>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6 pt-16 bg-card rounded-b-lg shadow-sm relative">
        <div className="absolute -top-12 left-6">
          <Avatar className="w-24 h-24 border-4 border-background shadow-md">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            {platform && followers && (
              <p className="text-muted-foreground">
                {platform} Creator • {followers} followers
              </p>
            )}
            <p className="mt-2 text-sm text-foreground max-w-2xl">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileHeader;
