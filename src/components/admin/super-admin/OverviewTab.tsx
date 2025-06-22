
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OverviewTab = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Agencies</CardTitle>
          <CardDescription className="text-muted-foreground">Manage all agency accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/super-admin/users/agencies')} 
            className="w-full"
          >
            View All Agencies
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Brands</CardTitle>
          <CardDescription className="text-muted-foreground">Manage brand accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/super-admin/users/brands')} 
            className="w-full"
          >
            View All Brands
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Creators</CardTitle>
          <CardDescription className="text-muted-foreground">Manage creator accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/super-admin/users/creators')} 
            className="w-full"
          >
            View All Creators
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
