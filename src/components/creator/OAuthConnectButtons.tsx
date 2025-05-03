
import React from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TikTokIcon, Instagram, Youtube, Linkedin } from '@/components/icons/SocialIcons';
import { initiateOAuth } from '@/lib/oauth';
import { Loader2 } from 'lucide-react';

interface OAuthConnectButtonsProps {
  platforms: {
    instagram?: boolean;
    tiktok?: boolean;
    youtube?: boolean;
    linkedin?: boolean;
  };
  isLoading: boolean;
}

const OAuthConnectButtons: React.FC<OAuthConnectButtonsProps> = ({ 
  platforms,
  isLoading 
}) => {
  const [connectingPlatform, setConnectingPlatform] = React.useState<string | null>(null);

  const handleConnect = async (platform: string) => {
    try {
      setConnectingPlatform(platform);
      await initiateOAuth(platform);
      // The page will redirect to the OAuth provider, so we don't need to handle success here
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast.error(`Failed to connect ${platform}`, {
        description: "Please try again or contact support if the issue persists."
      });
      setConnectingPlatform(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Social Platforms</CardTitle>
        <CardDescription>
          Link your social media accounts to showcase your reach and analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant={platforms.instagram ? "outline" : "secondary"}
            className="flex justify-between items-center w-full p-6 h-auto"
            onClick={() => handleConnect("instagram")}
            disabled={isLoading || connectingPlatform === "instagram"}
          >
            <div className="flex items-center gap-3">
              <Instagram size={24} />
              <div className="text-left">
                <p className="font-medium">Instagram</p>
                <p className="text-sm text-muted-foreground">
                  {platforms.instagram ? "Connected" : "Connect with Facebook Login"}
                </p>
              </div>
            </div>
            {connectingPlatform === "instagram" && (
              <Loader2 className="animate-spin" size={20} />
            )}
          </Button>
          
          <Button
            variant={platforms.tiktok ? "outline" : "secondary"}
            className="flex justify-between items-center w-full p-6 h-auto"
            onClick={() => handleConnect("tiktok")}
            disabled={isLoading || connectingPlatform === "tiktok"}
          >
            <div className="flex items-center gap-3">
              <TikTokIcon size={24} />
              <div className="text-left">
                <p className="font-medium">TikTok</p>
                <p className="text-sm text-muted-foreground">
                  {platforms.tiktok ? "Connected" : "Connect TikTok account"}
                </p>
              </div>
            </div>
            {connectingPlatform === "tiktok" && (
              <Loader2 className="animate-spin" size={20} />
            )}
          </Button>
          
          <Button
            variant={platforms.youtube ? "outline" : "secondary"}
            className="flex justify-between items-center w-full p-6 h-auto"
            onClick={() => handleConnect("youtube")}
            disabled={isLoading || connectingPlatform === "youtube"}
          >
            <div className="flex items-center gap-3">
              <Youtube size={24} />
              <div className="text-left">
                <p className="font-medium">YouTube</p>
                <p className="text-sm text-muted-foreground">
                  {platforms.youtube ? "Connected" : "Connect with Google"}
                </p>
              </div>
            </div>
            {connectingPlatform === "youtube" && (
              <Loader2 className="animate-spin" size={20} />
            )}
          </Button>
          
          <Button
            variant={platforms.linkedin ? "outline" : "secondary"}
            className="flex justify-between items-center w-full p-6 h-auto"
            onClick={() => handleConnect("linkedin")}
            disabled={isLoading || connectingPlatform === "linkedin"}
          >
            <div className="flex items-center gap-3">
              <Linkedin size={24} />
              <div className="text-left">
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm text-muted-foreground">
                  {platforms.linkedin ? "Connected" : "Connect LinkedIn account"}
                </p>
              </div>
            </div>
            {connectingPlatform === "linkedin" && (
              <Loader2 className="animate-spin" size={20} />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OAuthConnectButtons;
