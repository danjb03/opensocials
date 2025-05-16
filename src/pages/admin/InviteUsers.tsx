
import React from 'react';
import InviteUserForm from '@/components/admin/InviteUserForm';

export default function InviteUsers() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Invite New Users</h1>
      <div className="max-w-md mx-auto">
        <InviteUserForm />
      </div>
    </div>
  );
}
