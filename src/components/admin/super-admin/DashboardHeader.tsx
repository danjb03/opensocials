
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const DashboardHeader = () => {
  const { user, role } = useUnifiedAuth();

  return (
    <div>
      <h1 className="text-3xl font-light text-foreground mb-2">Super Admin Dashboard</h1>
      <div className="text-sm text-muted-foreground">
        Logged in as: {user?.email} | Role: {role || 'Unknown'}
      </div>
    </div>
  );
};

export default DashboardHeader;
