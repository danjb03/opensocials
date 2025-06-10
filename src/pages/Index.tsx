
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
      
      // Super admins should stay on index page to choose their dashboard
      if (role === 'super_admin') {
        console.log('Index - Super admin detected, staying on index page');
        return;
      }
      
      // Redirect based on user role for non-super-admin users
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'brand':
          navigate('/brand');
          break;
        case 'creator':
          navigate('/creator');
          break;
        case 'agency':
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Logo className="mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome to Open Socials
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The premier platform connecting brands with creators
            </p>
          </div>

          {!user ? (
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
              >
                Get Started
              </Button>
              <p className="text-gray-500">
                Sign up or log in to access your dashboard
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Welcome back!</CardTitle>
                  <CardDescription>
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
                        className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
                      >
                        Go to Super Admin Dashboard
                      </Button>
                      <div className="border-t pt-3 space-y-2">
                        <p className="text-sm text-gray-600 mb-2">Or access any dashboard:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            onClick={() => navigate('/admin')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Admin
                          </Button>
                          <Button 
                            onClick={() => navigate('/brand')}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Brand
                          </Button>
                          <Button 
                            onClick={() => navigate('/creator')}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Creator
                          </Button>
                          <Button 
                            onClick={() => navigate('/agency')}
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700"
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
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Go to Admin Dashboard
                    </Button>
                  )}
                  {role === 'brand' && (
                    <Button 
                      onClick={() => navigate('/brand')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Go to Brand Dashboard
                    </Button>
                  )}
                  {role === 'creator' && (
                    <Button 
                      onClick={() => navigate('/creator')}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      Go to Creator Dashboard
                    </Button>
                  )}
                  {role === 'agency' && (
                    <Button 
                      onClick={() => navigate('/agency')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
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
