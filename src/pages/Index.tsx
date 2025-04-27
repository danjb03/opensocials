
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, role } = useAuth();

  // Redirect brand users to their dashboard
  if (user && role === 'brand') {
    return <Navigate to="/brand" replace />;
  }
  
  // Redirect admin users to their dashboard
  if (user && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Platform</h1>
        <p className="text-xl text-gray-600 mb-6">
          {user 
            ? `Welcome, ${user.email}! You are logged in as a ${role}.` 
            : 'Connect brands with creators for impactful collaborations.'}
        </p>
        
        {!user ? (
          <div className="flex justify-center gap-4 mt-6">
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8">
            {role === 'admin' && (
              <Button asChild variant="default" className="mr-4">
                <Link to="/admin">Admin Dashboard</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
