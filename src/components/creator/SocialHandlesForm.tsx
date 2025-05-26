
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SocialHandlesFormProps {
  formData: {
    instagramHandle: string;
    tiktokHandle: string;
    youtubeHandle: string;
    followers: string;
    avgViews: string;
    engagementRate: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const SocialHandlesForm = ({ formData, onInputChange }: SocialHandlesFormProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagramHandle">Instagram Handle</Label>
          <Input 
            id="instagramHandle"
            value={formData.instagramHandle}
            onChange={(e) => onInputChange('instagramHandle', e.target.value)}
            placeholder="@username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tiktokHandle">TikTok Handle</Label>
          <Input 
            id="tiktokHandle"
            value={formData.tiktokHandle}
            onChange={(e) => onInputChange('tiktokHandle', e.target.value)}
            placeholder="@username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="youtubeHandle">YouTube Handle</Label>
          <Input 
            id="youtubeHandle"
            value={formData.youtubeHandle}
            onChange={(e) => onInputChange('youtubeHandle', e.target.value)}
            placeholder="@channel"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="followers">Followers Count</Label>
          <Input 
            id="followers"
            type="number"
            value={formData.followers}
            onChange={(e) => onInputChange('followers', e.target.value)}
            placeholder="10000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="avgViews">Average Views</Label>
          <Input 
            id="avgViews"
            type="number"
            value={formData.avgViews}
            onChange={(e) => onInputChange('avgViews', e.target.value)}
            placeholder="5000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="engagementRate">Engagement Rate (%)</Label>
          <Input 
            id="engagementRate"
            type="number"
            step="0.1"
            value={formData.engagementRate}
            onChange={(e) => onInputChange('engagementRate', e.target.value)}
            placeholder="3.5"
          />
        </div>
      </div>
    </>
  );
};
