
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/logo";

const Index = () => {
  const { user, role, isLoading } = useUnifiedAuth();
  const navigate = useNavigate();

  console.log('Index - User:', user?.id);
  console.log('Index - Role:', role);
  console.log('Index - Loading:', isLoading);

  useEffect(() => {
    if (!isLoading && user && role) {
      console.log('Index - User logged in with role:', role);
      
      // Super admins should STAY on index page to choose their dashboard
      if (role === 'super_admin') {
        console.log('Index - Super admin detected, staying on index page for dashboard selection');
        return;
      }
      
      // Redirect based on user role for non-super-admin users
      switch (role) {
        case 'admin':
          console.log('Index - Redirecting admin to /admin');
          navigate('/admin');
          break;
        case 'brand':
          console.log('Index - Redirecting brand to /brand');
          navigate('/brand');
          break;
        case 'creator':
          console.log('Index - Redirecting creator to /creator');
          navigate('/creator');
          break;
        case 'agency':
          console.log('Index - Redirecting agency to /agency');
          navigate('/agency');
          break;
        default:
          console.log('Index - Unknown role, staying on index');
          break;
      }
    }
  }, [user, role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Logo className="mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Welcome to Open Socials
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The premier platform connecting brands with creators
            </p>
          </div>

          {!user ? (
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="px-8 py-3"
              >
                Get Started
              </Button>
              <p className="text-muted-foreground">
                Sign up or log in to access your dashboard
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="max-w-md mx-auto border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Welcome back!</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    You're logged in as: {user.email}
                    <br />
                    Role: {role || 'Loading...'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {role === 'super_admin' && (
                    <>
                      <Button 
                        onClick={() => navigate('/super-admin')}
                        className="w-full mb-4"
                      >
                        Go to Super Admin Dashboard
                      </Button>
                      <div className="border-t border-border pt-3 space-y-2">
                        <p className="text-sm text-muted-foreground mb-2">Or access any dashboard:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            onClick={() => navigate('/admin')}
                            size="sm"
                            variant="outline"
                          >
                            Admin
                          </Button>
                          <Button 
                            onClick={() => navigate('/brand')}
                            size="sm"
                            variant="outline"
                          >
                            Brand
                          </Button>
                          <Button 
                            onClick={() => navigate('/creator')}
                            size="sm"
                            variant="outline"
                          >
                            Creator
                          </Button>
                          <Button 
                            onClick={() => navigate('/agency')}
                            size="sm"
                            variant="outline"
                          >
                            Agency
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  {role === 'admin' && (
                    <Button 
                      onClick={() => navigate('/admin')}
                      className="w-full"
                    >
                      Go to Admin Dashboard
                    </Button>
                  )}
                  {role === 'brand' && (
                    <Button 
                      onClick={() => navigate('/brand')}
                      className="w-full"
                    >
                      Go to Brand Dashboard
                    </Button>
                  )}
                  {role === 'creator' && (
                    <Button 
                      onClick={() => navigate('/creator')}
                      className="w-full"
                    >
                      Go to Creator Dashboard
                    </Button>
                  )}
                  {role === 'agency' && (
                    <Button 
                      onClick={() => navigate('/agency')}
                      className="w-full"
                    >
                      Go to Agency Dashboard
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
