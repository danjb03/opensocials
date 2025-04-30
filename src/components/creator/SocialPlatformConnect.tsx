
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TikTok, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SocialPlatformProps {
  platforms: {
    tiktok?: boolean;
    instagram?: boolean;
    youtube?: boolean;
    linkedin?: boolean;
  };
  onConnect: (platform: string) => void;
  isEditable?: boolean;
}

const SocialPlatformConnect: React.FC<SocialPlatformProps> = ({ platforms, onConnect, isEditable = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Social Platforms</CardTitle>
        <CardDescription>
          Connect your social media accounts to showcase your reach
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <TikTok className="w-8 h-8" />
              <div>
                <h3 className="font-medium">TikTok</h3>
                {platforms.tiktok && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                )}
              </div>
            </div>
            {isEditable && (
              <Button 
                variant={platforms.tiktok ? "outline" : "default"} 
                size="sm"
                onClick={() => onConnect('tiktok')}
              >
                {platforms.tiktok ? 'Update' : 'Connect'}
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <Instagram className="w-8 h-8" />
              <div>
                <h3 className="font-medium">Instagram</h3>
                {platforms.instagram && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                )}
              </div>
            </div>
            {isEditable && (
              <Button 
                variant={platforms.instagram ? "outline" : "default"}
                size="sm"
                onClick={() => onConnect('instagram')}
              >
                {platforms.instagram ? 'Update' : 'Connect'}
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <Youtube className="w-8 h-8" />
              <div>
                <h3 className="font-medium">YouTube</h3>
                {platforms.youtube && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                )}
              </div>
            </div>
            {isEditable && (
              <Button 
                variant={platforms.youtube ? "outline" : "default"}
                size="sm"
                onClick={() => onConnect('youtube')}
              >
                {platforms.youtube ? 'Update' : 'Connect'}
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <Linkedin className="w-8 h-8" />
              <div>
                <h3 className="font-medium">LinkedIn</h3>
                {platforms.linkedin && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                )}
              </div>
            </div>
            {isEditable && (
              <Button 
                variant={platforms.linkedin ? "outline" : "default"}
                size="sm"
                onClick={() => onConnect('linkedin')}
              >
                {platforms.linkedin ? 'Update' : 'Connect'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialPlatformConnect;
