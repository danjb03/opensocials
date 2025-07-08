
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/SocialIcons';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'Enter Instagram handle' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, placeholder: 'Enter TikTok handle' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'Enter YouTube handle' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, placeholder: 'Enter LinkedIn profile URL' },
];

const SocialConnectionModal = ({ isOpen, onClose }: SocialConnectionModalProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [handle, setHandle] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!selectedPlatform || !handle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a platform and enter your handle.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const { data, error } = await supabase.functions.invoke('connect-social-account', {
        body: {
          platform: selectedPlatform,
          handle: handle.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: "Account Connected!",
        description: `Your ${platforms.find(p => p.id === selectedPlatform)?.name} account has been connected successfully.`,
      });

      setSelectedPlatform('');
      setHandle('');
      onClose();
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "There was an error connecting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const resetModal = () => {
    setSelectedPlatform('');
    setHandle('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Social Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Platform</Label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant={selectedPlatform === platform.id ? "default" : "outline"}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className="flex items-center space-x-2 h-12"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {selectedPlatform && (
            <div className="space-y-2">
              <Label htmlFor="handle">
                {platforms.find(p => p.id === selectedPlatform)?.name} Handle
              </Label>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder={platforms.find(p => p.id === selectedPlatform)?.placeholder}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={resetModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={!selectedPlatform || !handle.trim() || isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Account"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialConnectionModal;
