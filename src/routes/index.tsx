
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

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center p-6">
      <h2 className="text-xl font-semibold mb-2 text-white">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">Please refresh the page or try again</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Refresh Page
      </button>
      <details className="mt-4 text-sm text-left">
        <summary className="cursor-pointer text-muted-foreground">Error details</summary>
        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
          {error.message}
        </pre>
      </details>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user, role, brandProfile, creatorProfile, isLoading } = useUnifiedAuth();

  console.log('🚦 AppRoutes - Current state:', {
    user: user ? { id: user.id, email: user.email } : null,
    role,
    brandProfile: brandProfile ? { company_name: brandProfile.company_name } : null,
    creatorProfile: creatorProfile ? { first_name: creatorProfile.first_name } : null,
    isLoading,
    currentPath: window.location.pathname
  });

  // Add loading timeout to prevent infinite loading
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  
  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.warn('⚠️ Loading timeout reached, forcing render');
        setLoadingTimeout(true);
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Show loading state with timeout
  if (isLoading && !loadingTimeout) {
    console.log('🔄 Still loading authentication state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  // If loading timed out, show a fallback
  if (loadingTimeout && isLoading) {
    console.warn('⚠️ Loading timed out, showing fallback');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">Taking longer than expected</h2>
          <p className="text-muted-foreground mb-4">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Setup routes for users who need to complete their profiles
  const needsBrandSetup = role === 'brand' && !brandProfile?.company_name;
  const needsCreatorSetup = role === 'creator' && !creatorProfile?.first_name;

  console.log('🔍 Setup checks:', { needsBrandSetup, needsCreatorSetup });

  if (needsBrandSetup) {
    console.log('🔄 Redirecting to brand setup...');
    return (
      <Routes>
        <Route path="/setup/brand" element={<BrandSetup />} />
        <Route path="*" element={<Navigate to="/setup/brand" replace />} />
      </Routes>
    );
  }

  if (needsCreatorSetup) {
    console.log('🔄 Redirecting to creator setup...');
    return (
      <Routes>
        <Route path="/setup/creator" element={<CreatorSetup />} />
        <Route path="*" element={<Navigate to="/setup/creator" replace />} />
      </Routes>
    );
  }

  console.log('✅ Rendering main application routes...');

  try {
    // Main application routes - wrapped in error boundary
    return (
      <Routes>
        {/* Public marketing website */}
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

        {/* Fallback to homepage for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } catch (error) {
    console.error('❌ Error in AppRoutes:', error);
    return <ErrorFallback error={error as Error} />;
  }
};

export default AppRoutes;
