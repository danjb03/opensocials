
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Settings, Briefcase } from 'lucide-react';

const DashboardAccessTab = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Dashboard Access (Super Admin Only)</h2>
        <p className="text-muted-foreground mb-6">
          As a super admin, you can access any dashboard in the system. Use these buttons to navigate to different user dashboards.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Brand Dashboard</CardTitle>
              <Users className="h-5 w-5 text-violet-500" />
            </div>
            <CardDescription className="text-muted-foreground">Access brand dashboard as super admin</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/brand')}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white border-0"
            >
              Access Brand Dashboard
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Creator Dashboard</CardTitle>
              <User className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription className="text-muted-foreground">Access creator dashboard as super admin</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/creator')} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0"
            >
              Access Creator Dashboard
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Agency Dashboard</CardTitle>
              <Settings className="h-5 w-5 text-orange-500" />
            </div>
            <CardDescription className="text-muted-foreground">Access agency dashboard as super admin</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/agency')} 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
            >
              Access Agency Dashboard
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Admin Dashboard</CardTitle>
              <Briefcase className="h-5 w-5 text-green-500" />
            </div>
            <CardDescription className="text-muted-foreground">Access admin dashboard system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/admin')} 
              className="w-full bg-green-500 hover:bg-green-600 text-white border-0"
            >
              Access Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAccessTab;
