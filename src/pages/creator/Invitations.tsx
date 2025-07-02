
import React from 'react';
import { InvitationsList } from '@/components/creator/invitations/InvitationsList';

const CreatorInvitations = () => {
  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Invitations</h1>
        <p className="text-muted-foreground">
          Manage your campaign invitations and brand collaboration requests.
        </p>
      </div>
      
      <InvitationsList />
    </div>
  );
};

export default CreatorInvitations;
