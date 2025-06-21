
import React from 'react';
import { Instagram, Youtube, Twitter, Facebook, ExternalLink, Globe } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorSocialLinksProps {
  socialLinks?: Creator['socialLinks'];
}

export const CreatorSocialLinks = ({ socialLinks }: CreatorSocialLinksProps) => {
  if (!socialLinks || Object.keys(socialLinks).length === 0) return null;
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
      case 'youtube':
        return 'bg-red-500 hover:bg-red-600';
      case 'twitter':
        return 'bg-blue-400 hover:bg-blue-500';
      case 'facebook':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-muted hover:bg-muted/80 text-foreground';
    }
  };
  
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-foreground flex items-center gap-2">
        <Globe className="h-4 w-4 text-foreground" />
        Social Profiles
      </h4>
      <div className="flex gap-3">
        {Object.entries(socialLinks).map(([platform, url]) => {
          if (!url) return null;
          return (
            <a 
              key={platform} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`p-3 rounded-xl text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${getPlatformColor(platform)}`}
              title={`Visit ${platform}`}
            >
              {getSocialIcon(platform)}
            </a>
          );
        })}
      </div>
    </div>
  );
};
