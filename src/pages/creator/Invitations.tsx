
import React from 'react';
import { InvitationsList } from '@/components/creator/invitations/InvitationsList';

const CreatorInvitations = () => {
  return (
    <div className="container mx-auto p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
          Campaign Invitations
        </h1>
        <p className="text-lg text-muted-foreground font-light">
          Manage your campaign invitations and brand collaboration requests.
        </p>
      </div>
      
      <InvitationsList />
    </div>
  );
};

export default CreatorInvitations;
