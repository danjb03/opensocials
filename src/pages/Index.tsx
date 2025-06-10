
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/logo";
import { ArrowRight, Users, Briefcase, Star, TrendingUp, Shield, Zap } from "lucide-react";

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
      {/* Hero Section */}
      <div className="relative bg-background border-b border-border">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-12">
              <Logo className="mx-auto mb-8" />
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
                Welcome to Open Socials
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                The premier platform connecting brands with creators for authentic partnerships
              </p>
            </div>

            {!user ? (
              <div className="space-y-6">
                <Button 
                  onClick={() => navigate('/auth')} 
                  size="lg"
                  className="px-12 py-4 text-lg font-semibold"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-muted-foreground text-lg">
                  Join thousands of brands and creators worldwide
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <Card className="max-w-lg mx-auto border border-border bg-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">Welcome back!</CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">
                      {user.email}
                      <br />
                      Role: {role || 'Loading...'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {role === 'super_admin' && (
                      <>
                        <Button 
                          onClick={() => navigate('/super-admin')}
                          className="w-full text-lg py-3"
                        >
                          Go to Super Admin Dashboard
                        </Button>
                        <div className="border-t border-border pt-4 space-y-3">
                          <p className="text-sm text-muted-foreground mb-3">Or access any dashboard:</p>
                          <div className="grid grid-cols-2 gap-3">
                            <Button 
                              onClick={() => navigate('/admin')}
                              variant="outline"
                              className="py-2"
                            >
                              Admin
                            </Button>
                            <Button 
                              onClick={() => navigate('/brand')}
                              variant="outline"
                              className="py-2"
                            >
                              Brand
                            </Button>
                            <Button 
                              onClick={() => navigate('/creator')}
                              variant="outline"
                              className="py-2"
                            >
                              Creator
                            </Button>
                            <Button 
                              onClick={() => navigate('/agency')}
                              variant="outline"
                              className="py-2"
                            >
                              Agency
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                    {role && role !== 'super_admin' && (
                      <Button 
                        onClick={() => navigate(`/${role}`)}
                        className="w-full text-lg py-3"
                      >
                        Go to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why Choose Open Socials?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform provides everything you need for successful creator partnerships
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-background" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Creator Network</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Access thousands of verified creators across all major platforms
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-background" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Campaign Management</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Streamlined tools for managing campaigns from start to finish
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-background" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Analytics & Insights</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Real-time performance tracking and detailed campaign analytics
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-muted border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">10K+</div>
                <div className="text-lg text-muted-foreground">Active Creators</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">500+</div>
                <div className="text-lg text-muted-foreground">Brand Partners</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">1M+</div>
                <div className="text-lg text-muted-foreground">Campaigns Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Built for Success
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform is designed to deliver results for both brands and creators
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Secure Payments</h3>
                  <p className="text-muted-foreground">Protected transactions with escrow and milestone-based payments</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Quick Matching</h3>
                  <p className="text-muted-foreground">AI-powered creator matching based on brand requirements</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Quality Assurance</h3>
                  <p className="text-muted-foreground">Verified creators and content review processes</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">Dedicated support team for all your campaign needs</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Performance Tracking</h3>
                  <p className="text-muted-foreground">Real-time analytics and detailed performance reports</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Easy Management</h3>
                  <p className="text-muted-foreground">Intuitive dashboard for managing all your campaigns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
              Join the platform that's transforming creator partnerships. Start your journey today.
            </p>
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                variant="secondary"
                className="px-12 py-4 text-lg font-semibold"
              >
                Join Open Socials
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <Logo className="mb-4" />
                <p className="text-muted-foreground mb-4 max-w-md">
                  Connecting brands with creators for authentic partnerships that drive results.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Platform</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>For Brands</div>
                  <div>For Creators</div>
                  <div>For Agencies</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <div className="space-y-2 text-muted-foreground">
                  <button onClick={() => navigate('/privacy-policy')} className="block text-left hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                  <button onClick={() => navigate('/tos')} className="block text-left hover:text-foreground transition-colors">
                    Terms of Service
                  </button>
                  <button onClick={() => navigate('/data-deletion')} className="block text-left hover:text-foreground transition-colors">
                    Data Deletion
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 Open Socials. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
