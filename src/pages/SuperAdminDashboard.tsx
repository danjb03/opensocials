
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/auth');
    } else {
      console.error('Failed to sign out:', error.message);
      toast.error('Failed to sign out');
    }
  };

  const dashboards = [
    { id: 'brands', label: 'Brands Dashboard' },
    { id: 'creators', label: 'Creators Dashboard' },
    { id: 'admins', label: 'Admins Dashboard' },
  ];

  const handleNavigate = (dashboardId: string) => {
    switch (dashboardId) {
      case 'brands':
        navigate('/super-admin/brands');
        break;
      case 'creators':
        navigate('/super-admin/creators');
        break;
      case 'admins':
        navigate('/admin');  // Changed from '/super-admin/admins' to '/admin'
        break;
      default:
        console.error('Unknown dashboard:', dashboardId);
        toast.error('Invalid dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Super Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {dashboards.map((dash) => (
            <Button
              key={dash.id}
              variant="default"
              className="w-full py-4 text-lg"
              onClick={() => handleNavigate(dash.id)}
            >
              {dash.label}
            </Button>
          ))}
          <Button 
            variant="destructive" 
            className="mt-8"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
