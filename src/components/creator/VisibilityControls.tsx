
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VisibilityControlsProps {
  visibilitySettings: {
    showInstagram: boolean;
    showTiktok: boolean;
    showYoutube: boolean;
    showLinkedin: boolean;
    showLocation: boolean;
    showAnalytics: boolean;
  };
  onToggleVisibility: (setting: string) => void;
}

const VisibilityControls: React.FC<VisibilityControlsProps> = ({
  visibilitySettings,
  onToggleVisibility
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Privacy Settings</CardTitle>
        <CardDescription>
          Control what information is visible to brands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-instagram" className="flex-1">Instagram Profile</Label>
            <Switch 
              id="show-instagram" 
              checked={visibilitySettings.showInstagram}
              onCheckedChange={() => onToggleVisibility('showInstagram')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-tiktok" className="flex-1">TikTok Profile</Label>
            <Switch 
              id="show-tiktok" 
              checked={visibilitySettings.showTiktok}
              onCheckedChange={() => onToggleVisibility('showTiktok')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-youtube" className="flex-1">YouTube Profile</Label>
            <Switch 
              id="show-youtube" 
              checked={visibilitySettings.showYoutube}
              onCheckedChange={() => onToggleVisibility('showYoutube')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-linkedin" className="flex-1">LinkedIn Profile</Label>
            <Switch 
              id="show-linkedin" 
              checked={visibilitySettings.showLinkedin}
              onCheckedChange={() => onToggleVisibility('showLinkedin')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-location" className="flex-1">Audience Location Data</Label>
            <Switch 
              id="show-location" 
              checked={visibilitySettings.showLocation}
              onCheckedChange={() => onToggleVisibility('showLocation')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-analytics" className="flex-1">Analytics & Growth Trends</Label>
            <Switch 
              id="show-analytics" 
              checked={visibilitySettings.showAnalytics}
              onCheckedChange={() => onToggleVisibility('showAnalytics')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisibilityControls;
