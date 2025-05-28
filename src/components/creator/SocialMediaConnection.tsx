
import React from 'react';
import { useAuth } from '@/lib/auth';
import { usePhylloConnect } from '@/hooks/usePhylloConnect';
import { PhylloConnector } from './phyllo/PhylloConnector';

interface SocialMediaConnectionProps {
  onConnectionSuccess?: () => void;
}

export const SocialMediaConnection = ({ onConnectionSuccess }: SocialMediaConnectionProps) => {
  const { user } = useAuth();
  const { isPhylloLoading, initializePhylloConnect } = usePhylloConnect(
    user?.id,
    user?.email,
    onConnectionSuccess
  );

  if (!user) {
    return (
      <div className="border-t pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Connect Your Social Media</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please log in to connect your social media accounts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PhylloConnector 
      onConnect={initializePhylloConnect}
      isLoading={isPhylloLoading}
    />
  );
};
