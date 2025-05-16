
import React from 'react';
import { Instagram, Youtube, Twitter, Facebook, ExternalLink } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorSocialLinksProps {
  socialLinks?: Creator['socialLinks'];
}

export const CreatorSocialLinks = ({ socialLinks }: CreatorSocialLinksProps) => {
  if (!socialLinks) return null;
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-3 w-3" />;
      case 'youtube':
        return <Youtube className="h-3 w-3" />;
      case 'twitter':
        return <Twitter className="h-3 w-3" />;
      case 'facebook':
        return <Facebook className="h-3 w-3" />;
      default:
        return <ExternalLink className="h-3 w-3" />;
    }
  };
  
  return (
    <div className="flex gap-1.5 mt-2">
      {Object.entries(socialLinks).map(([platform, url]) => {
        if (!url) return null;
        return (
          <a 
            key={platform} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1 bg-secondary rounded-full hover:bg-secondary/80 transition-colors" 
            aria-label={`Visit ${platform}`}
          >
            {getSocialIcon(platform)}
          </a>
        );
      })}
    </div>
  );
};
