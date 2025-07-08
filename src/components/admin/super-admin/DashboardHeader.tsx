
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const DashboardHeader = () => {
  const { user, role } = useUnifiedAuth();

  return (
    <Card className="bg-gradient-to-r from-card to-muted border border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Super Admin Dashboard
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Welcome back, {user?.email}. Manage platform operations and user access.
        </CardDescription>
        {role && (
          <div className="text-sm text-muted-foreground">
            Role: <span className="font-medium text-foreground">{role}</span>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default DashboardHeader;
