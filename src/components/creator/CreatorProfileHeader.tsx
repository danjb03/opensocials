
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Eye, EyeOff, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  onAvatarChange?: (file: File) => void;
  isUploading?: boolean;
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
  isPreviewMode = false,
  onAvatarChange,
  isUploading = false
}) => {
  const handleAvatarClick = () => {
    if (!onAvatarChange) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onAvatarChange(file);
      }
    };
    input.click();
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Banner Section */}
      <div 
        className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4"
        style={bannerUrl ? { 
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {isEditable && (
          <div className="absolute top-4 right-4 flex gap-2">
            {onTogglePreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePreview}
                className="bg-white/90 hover:bg-white"
              >
                {isPreviewMode ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Exit Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </>
                )}
              </Button>
            )}
            {onEditProfile && !isPreviewMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEditProfile}
                className="bg-white/90 hover:bg-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="relative -mt-16 md:-mt-20">
          <div 
            className={`relative ${onAvatarChange && !isPreviewMode ? 'cursor-pointer group' : ''}`}
            onClick={!isPreviewMode ? handleAvatarClick : undefined}
          >
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="text-2xl bg-gray-200">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            
            {onAvatarChange && !isPreviewMode && (
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1 pt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {name || 'Creator Profile'}
              </h1>
              {platform && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <span className="text-sm font-medium">Primary Platform:</span>
                  <span className="text-sm">{platform}</span>
                </div>
              )}
              {followers && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm font-medium">Followers:</span>
                  <span className="text-sm">{followers}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-gray-700 max-w-2xl">
            <p className="leading-relaxed">
              {bio || 'No bio yet. Add one to complete your profile.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileHeader;
