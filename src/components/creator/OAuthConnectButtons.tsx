
import React from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TikTokIcon, Instagram, Youtube, Linkedin } from '@/components/icons/SocialIcons';
import { initiateOAuth } from '@/lib/oauth';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

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
  const { user } = useAuth();
  const [connectingPlatform, setConnectingPlatform] = React.useState<string | null>(null);

  const handleConnect = async (platform: string) => {
    try {
      setConnectingPlatform(platform);
      
      // Specific flow for Instagram using the exact URL format provided with state parameter
      if (platform === 'instagram') {
        const PROFILE_ID = "01f8abb9-0c22-4adf-affd-d797bb2dd488"; // Replace with dynamic user ID
        
        window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=1022001640046804&redirect_uri=https://functions.opensocials.net/functions/v1/auth-callback&response_type=code&scope=instagram_basic,pages_show_list,pages_read_engagement&state=${PROFILE_ID}`;
      } else {
        await initiateOAuth(platform);
      }
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
          {/* Instagram button styled according to the provided example */}
          <Button
            variant="custom"
            className="flex items-center gap-2 px-6 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all h-auto"
            onClick={() => handleConnect("instagram")}
            disabled={isLoading || connectingPlatform === "instagram"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0120.5 7.75v8.5a4.25 4.25 0 01-4.25 4.25h-8.5A4.25 4.25 0 013.5 16.25v-8.5A4.25 4.25 0 017.75 3.5zm8.25 2a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
            </svg>
            Connect Instagram
            {connectingPlatform === "instagram" && (
              <Loader2 className="animate-spin ml-2" size={20} />
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
