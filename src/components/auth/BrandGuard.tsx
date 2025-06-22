
import React from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Navigate } from 'react-router-dom';

interface BrandGuardProps {
  children: React.ReactNode;
}

const BrandGuard: React.FC<BrandGuardProps> = ({ children }) => {
  const { user, role, isLoading } = useUnifiedAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role !== 'brand' && role !== 'super_admin') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default BrandGuard;
