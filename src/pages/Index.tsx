import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import Logo from '@/components/ui/logo';

const Index = () => {
  const { user, role, isLoading } = useUnifiedAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect based on role
  if (user && role === 'brand') {
    return <Navigate to="/brand" replace />;
  }
  
  if (user && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user && role === 'creator') {
    return <Navigate to="/creator" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Platform</h1>
        
        {user && !role && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertTitle>No Role Assigned</AlertTitle>
            <AlertDescription>
              Your account doesn't have a role assigned or your role is pending approval. 
              Please contact an administrator.
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-xl text-gray-600 mb-6">
          {user 
            ? `Welcome, ${user.email}! ${role ? `You are logged in as a ${role}.` : ''}`
            : 'Connect brands with creators for impactful collaborations.'}
        </p>
        
        {!user ? (
          <div className="flex justify-center gap-4 mt-6">
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {role === 'super_admin' && (
              <Button asChild variant="default" className="mr-4">
                <Link to="/super-admin">Super Admin Dashboard</Link>
              </Button>
            )}
            {role === 'admin' && (
              <Button asChild variant="default" className="mr-4">
                <Link to="/admin">Admin Dashboard</Link>
              </Button>
            )}
            {role === 'brand' && (
              <Button asChild variant="default" className="mr-4">
                <Link to="/brand">Brand Dashboard</Link>
              </Button>
            )}
            {role === 'creator' && (
              <Button asChild variant="default" className="mr-4">
                <Link to="/creator">Creator Dashboard</Link>
              </Button>
            )}
            <div>
              <Button 
                onClick={handleSignOut} 
                variant="outline"
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
