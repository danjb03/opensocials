import React from 'react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SuperAdminDashboard: React.FC = () => {
  const { user, role } = useUnifiedAuth();

  const { data: users, isLoading, error } = useQuery('superAdminUsers', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      {user && <p>Logged in as: {user.email}</p>}
      {role && <p>Role: {role}</p>}

      <h2>User List</h2>
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminDashboard;
