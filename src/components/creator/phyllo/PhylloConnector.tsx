
import React from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';

interface PhylloConnectorProps {
  onConnect: (platform: string) => void;
  isLoading: boolean;
}

export const PhylloConnector = ({ onConnect, isLoading }: PhylloConnectorProps) => {
  const platforms = [
    'instagram',
    'tiktok',
    'youtube',
    'twitch',
    'linkedin',
    'twitter',
    'reddit',
    'patreon',
    'spotify',
    'facebook',
    'discord',
    'pinterest',
    'shopify'
  ];

  return (
    <div className="border-t pt-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Connect Your Social Media</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your social media accounts to showcase your reach and get ready for brand collaborations.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {platforms.map((p) => (
              <Button
                key={p}
                type="button"
                variant="outline"
                onClick={() => onConnect(p)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                {p}
              </Button>
            ))}
          </div>
          {isLoading && (
            <p className="text-xs text-muted-foreground mt-2">
              Please wait while we prepare your secure connection...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
