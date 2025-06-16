import { useState } from "react";
import { Button } from "@/components/ui/button";
import NavigationLogo from "@/components/ui/navigation-logo";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface IndexNavigationProps {
  user: User | null;
}

export const IndexNavigation = ({ user }: IndexNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, redirect based on their role or to dashboard
      navigate('/brand'); // Default to brand for now
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="border-b border-border/10 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavigationLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#workflow" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button onClick={() => navigate('/brand')} className="bg-white text-black hover:bg-gray-200">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={handleGetStarted} className="bg-white text-black hover:bg-gray-200">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/10 py-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#workflow" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              {user ? (
                <Button onClick={() => navigate('/brand')} className="bg-white text-black hover:bg-gray-200 w-full">
                  Go to Dashboard
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button variant="ghost" onClick={() => navigate('/auth')} className="w-full">
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted} className="bg-white text-black hover:bg-gray-200 w-full">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
