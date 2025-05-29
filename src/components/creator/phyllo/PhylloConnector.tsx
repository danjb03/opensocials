
import React from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';

interface PhylloConnectorProps {
  onConnect: () => void;
  isLoading: boolean;
}

export const PhylloConnector = ({ onConnect, isLoading }: PhylloConnectorProps) => {
  return (
    <div className="border-t pt-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Connect Your Social Media</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your social media accounts to showcase your reach and get ready for brand collaborations.
            {isLoading && " You'll be redirected to connect your accounts securely."}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onConnect}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <LinkIcon className="h-4 w-4" />
            {isLoading ? 'Redirecting...' : 'Connect Your Social Platforms'}
          </Button>
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
