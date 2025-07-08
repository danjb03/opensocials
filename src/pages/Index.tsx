import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const Index: React.FC = () => {
  const { user, role, isLoading } = useUnifiedAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role === 'brand') {
    return <Navigate to="/brand" replace />;
  }

  if (role === 'creator') {
    return <Navigate to="/creator" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (role === 'agency') {
    return <Navigate to="/agency" replace />;
  }

  if (role === 'super_admin') {
    return <Navigate to="/super_admin" replace />;
  }

  return <div>Unknown role</div>;
};

export default Index;
