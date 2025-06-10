
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo className="h-8" />
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-400 hover:text-white transition-colors">Features</button>
              <button className="text-gray-400 hover:text-white transition-colors">How it works</button>
              <button className="text-gray-400 hover:text-white transition-colors">Testimonials</button>
              <button className="text-gray-400 hover:text-white transition-colors">FAQs</button>
            </div>
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-white text-black hover:bg-gray-200 px-6"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-12">
              <Logo className="h-24" />
            </div>
            <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-tight">
              Creator partnerships,<br />
              <span className="text-gray-400">the efficient way</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Innovative solutions for brands and agencies connecting with creators across all major platforms. Arriving shortly.
            </p>

            {!user ? (
              <div className="flex items-center justify-center mb-16">
                <div className="flex items-center bg-gray-900 rounded-full p-2 max-w-md w-full">
                  <input
                    type="email"
                    placeholder="name@email.com"
                    className="bg-transparent text-white placeholder-gray-500 px-4 py-3 flex-1 focus:outline-none"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                    Get notified
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="max-w-lg mx-auto bg-gray-900 border-gray-800">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Welcome back!</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
                      >
                        Go to Super Admin Dashboard
                      </Button>
                      <div className="border-t border-gray-800 pt-4 space-y-3">
                        <p className="text-sm text-gray-400 mb-3">Or access any dashboard:</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            onClick={() => navigate('/admin')}
                            variant="outline"
                            className="py-2 border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Admin
                          </Button>
                          <Button 
                            onClick={() => navigate('/brand')}
                            variant="outline"
                            className="py-2 border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Brand
                          </Button>
                          <Button 
                            onClick={() => navigate('/creator')}
                            variant="outline"
                            className="py-2 border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Creator
                          </Button>
                          <Button 
                            onClick={() => navigate('/agency')}
                            variant="outline"
                            className="py-2 border-gray-700 text-gray-300 hover:bg-gray-800"
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
                    >
                      Go to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Trusted By Section */}
          <div className="text-center mb-20">
            <p className="text-gray-500 text-sm mb-8 uppercase tracking-wider">Already chosen by the leaders</p>
            <div className="flex items-center justify-center space-x-12 opacity-60">
              <div className="text-gray-600 font-semibold">headspace</div>
              <div className="text-gray-600 font-semibold">shopify</div>
              <div className="text-gray-600 font-semibold">volvo</div>
              <div className="text-gray-600 font-semibold">Mobbin</div>
              <div className="text-gray-600 font-semibold">Pinterest</div>
              <div className="text-gray-600 font-semibold">duolingo</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-blue-400 text-sm uppercase tracking-wider">What you'll get</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-8">
              We resolve problems associated with<br />
              <span className="text-gray-400">creative partnerships.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
              <CardContent className="p-0">
                <div className="mb-8">
                  <div className="text-blue-400 text-sm font-medium mb-4">Growth</div>
                  <div className="h-32 bg-gradient-to-t from-blue-600 to-blue-400 opacity-20 rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Tailor-made partnerships</h3>
                <p className="text-gray-400">We've got the expertise to make your vision a reality.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
              <CardContent className="p-0">
                <div className="mb-8">
                  <div className="bg-gray-800 rounded-lg p-6 h-32 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Latest design</h3>
                <p className="text-gray-400">Today, 11:30</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
              <CardContent className="p-0">
                <div className="mb-8">
                  <div className="h-32 flex items-end">
                    <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 rounded-lg"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Scalable as you grow</h3>
                <p className="text-gray-400">We're ready to meet your evolving needs.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Integration Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-light mb-6">Workflow integration</h3>
              <p className="text-gray-400 text-lg mb-8">Seamlessly connect all your existing apps.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-light mb-6">Collaborate real-time</h3>
              <p className="text-gray-400 text-lg">Seamlessly connect all your existing apps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
              <span className="text-white text-sm">Creator matching</span>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
              <span className="text-white text-sm">Campaign management</span>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
              <span className="text-white text-sm">Performance tracking</span>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
              <span className="text-white text-sm">Asset management</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
              <span className="text-white text-sm">Secure payments</span>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
              <span className="text-white text-sm">Brand safety</span>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
              <span className="text-white text-sm">Multi-platform support</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-blue-400 text-sm uppercase tracking-wider">How it works</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-8">
              Top-notch partnerships,<br />
              <span className="text-gray-400">delivered at your doorstep.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 border-2 border-white rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Tell us your vision</h3>
                <p className="text-gray-400">Choose a plan and share your campaign details with us; we're here to listen.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Receive the magic</h3>
                <p className="text-gray-400">Sit back and relax; our expert team will turn your vision into reality.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Get ongoing support</h3>
                <p className="text-gray-400">Your subscription ensures you have continuous access to our team.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
              <CardContent className="p-0">
                <div className="text-gray-600 font-semibold mb-4">loom</div>
                <p className="text-white mb-6">"Creative, innovative and strategic. We have great achievements made together and looking to more"</p>
                <div className="flex text-blue-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="text-white font-medium">Henry Arthur</div>
                  <div className="text-gray-400 text-sm">Head of Engineering, Loom</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
              <CardContent className="p-0">
                <div className="text-gray-600 font-semibold mb-4">INTERCOM</div>
                <p className="text-white mb-6">"Incredible group of people and talented professionals. Focused on the development of flexible ideas"</p>
                <div className="flex text-blue-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="text-white font-medium">Jerome Bell</div>
                  <div className="text-gray-400 text-sm">Product Analyst, Intercom</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
              <CardContent className="p-0">
                <div className="text-gray-600 font-semibold mb-4">Abstract</div>
                <p className="text-white mb-6">"A truly innovative approach to partnerships that sets this platform apart from its peers within the broader industry"</p>
                <div className="flex text-blue-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="text-white font-medium">Eleanor Pena</div>
                  <div className="text-gray-400 text-sm">Head of Product Design, Abstract</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-light text-white mb-2">45+</div>
              <div className="text-gray-400">Happy customers</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-light text-white mb-2">5k+</div>
              <div className="text-gray-400">Hours spent on craft</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-light text-white mb-2">4.8</div>
              <div className="text-gray-400">Review rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            Elevate the way you<br />
            <span className="text-gray-400">source partnerships</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get ready to start producing stunning, efficient campaign work without the hassles of hiring. Soon available.
          </p>
          {!user && (
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-gray-900 rounded-full p-2 max-w-md w-full">
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="bg-transparent text-white placeholder-gray-500 px-4 py-3 flex-1 focus:outline-none"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                  Get notified
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Logo className="h-8" />
            <div className="flex items-center space-x-8 text-gray-400 text-sm">
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                Contact
              </button>
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                Privacy & Cookie Policy
              </button>
              <button onClick={() => navigate('/tos')} className="hover:text-white transition-colors">
                Terms & Conditions
              </button>
            </div>
            <div className="text-gray-500 text-sm">
              Made with love by Open Socials
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
