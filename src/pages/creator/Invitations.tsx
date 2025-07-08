
import React from 'react';
import { InvitationsList } from '@/components/creator/invitations/InvitationsList';

const CreatorInvitations = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
            Campaign Invitations
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Manage your campaign invitations and brand collaboration requests.
          </p>
        </div>
        
        <InvitationsList />
      </div>
    </div>
  );
};

export default CreatorInvitations;
