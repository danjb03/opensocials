
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Auth Components
import AuthPage from '@/pages/auth/index';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Public Components
import Index from '@/pages/Index';

// Setup Components
import BrandSetup from '@/pages/setup/BrandSetup';
import CreatorSetup from '@/pages/setup/CreatorSetup';

// Route Components
import AdminRoutes from './AdminRoutes';
import BrandRoutes from './BrandRoutes';
import { CreatorRoutes } from './CreatorRoutes';
import { SuperAdminRoutes } from './SuperAdminRoutes';
import AgencyRoutes from './AgencyRoutes';

const AppRoutes = () => {
  const { user, role, brandProfile, creatorProfile, isLoading } = useUnifiedAuth();

  console.log('🚦 AppRoutes state:', {
    isLoading,
    hasUser: !!user,
    role,
    path: window.location.pathname
  });

  // AGGRESSIVE: Only show loading for maximum 2 seconds
  const [forceRender, setForceRender] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('⚠️ FORCING render after 2s timeout');
      setForceRender(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Force render after timeout or if loading is complete
  if (isLoading && !forceRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Setup routes - only redirect if we have confirmed data
  const needsBrandSetup = role === 'brand' && brandProfile === null;
  const needsCreatorSetup = role === 'creator' && creatorProfile === null;

  if (needsBrandSetup && !isLoading) {
    return (
      <Routes>
        <Route path="/setup/brand" element={<BrandSetup />} />
        <Route path="*" element={<Navigate to="/setup/brand" replace />} />
      </Routes>
    );
  }

  if (needsCreatorSetup && !isLoading) {
    return (
      <Routes>
        <Route path="/setup/creator" element={<CreatorSetup />} />
        <Route path="*" element={<Navigate to="/setup/creator" replace />} />
      </Routes>
    );
  }

  // Main routes - render regardless of auth state to prevent black screen
  return (
    <Routes>
      {/* Public marketing website - always accessible */}
      <Route path="/" element={<Index />} />
      
      {/* Auth pages */}
      <Route path="/auth/*" element={<AuthPage />} />
      
      {/* Protected role-based routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminRoutes />
        </ProtectedRoute>
      } />
      
      <Route path="/brand/*" element={
        <ProtectedRoute>
          <BrandRoutes />
        </ProtectedRoute>
      } />
      
      <Route path="/creator/*" element={
        <ProtectedRoute>
          <CreatorRoutes />
        </ProtectedRoute>
      } />

      <Route path="/agency/*" element={
        <ProtectedRoute>
          <AgencyRoutes />
        </ProtectedRoute>
      } />

      <Route path="/super_admin/*" element={
        <ProtectedRoute>
          <SuperAdminRoutes />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
