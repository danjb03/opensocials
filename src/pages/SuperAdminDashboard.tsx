
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/auth');
    } else {
      console.error('Failed to sign out:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome, Super Admin 🚀</h1>
      <p className="text-gray-600 mb-8">You have full access to the platform.</p>
      <Button onClick={handleSignOut}>Sign Out</Button>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Management Tools (Coming Soon)</h2>
        <ul className="text-gray-500 space-y-2">
          <li>- Manage Users</li>
          <li>- View System Reports</li>
          <li>- Platform Settings</li>
        </ul>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
