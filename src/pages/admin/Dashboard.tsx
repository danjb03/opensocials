import { useAuth } from '@/lib/auth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Package, CheckCircle, ArrowLeft } from 'lucide-react';
import SignOutButton from '@/components/SignOutButton';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { role } = useUserRole(user?.id);
  const navigate = useNavigate();

  const handleBackToSuperAdmin = () => {
    navigate('/super-admin');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleBackToSuperAdmin} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Super Admin
        </Button>
      </div>

      {/* Super Admin Switch Buttons */}
      {role === 'super_admin' && (
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => navigate('/admin')}>Admin Dashboard</Button>
          <Button onClick={() => navigate('/brand')}>Brand Dashboard</Button>
          <Button onClick={() => navigate('/creator')}>Creator Dashboard</Button>
        </div>
      )}

      {/* Normal Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Total Creators</CardTitle>
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">25</div>
            <p className="text-sm text-muted-foreground">12 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Active Orders</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-sm text-muted-foreground">4 require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Deals Accepted</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Optional Sign Out button */}
      <div className="mt-8 flex justify-center">
        <SignOutButton />
      </div>
    </div>
  );
};

export default AdminDashboard;
