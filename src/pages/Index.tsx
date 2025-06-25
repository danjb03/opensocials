
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { IndexNavigation } from "@/components/index/IndexNavigation";
import { HeroSection } from "@/components/index/HeroSection";
import { TrustedBySection } from "@/components/index/TrustedBySection";
import { FeaturesSection } from "@/components/index/FeaturesSection";
import { WorkflowSection } from "@/components/index/WorkflowSection";
import { CreatorSelectionSection } from "@/components/index/CreatorSelectionSection";
import { BenefitsSection } from "@/components/index/BenefitsSection";
import { HowItWorksSection } from "@/components/index/HowItWorksSection";
import { StatsSection } from "@/components/index/StatsSection";
import { FAQSection } from "@/components/index/FAQSection";
import { CTASection } from "@/components/index/CTASection";
import { IndexFooter } from "@/components/index/IndexFooter";

const Index = () => {
  const { user, role, isLoading } = useUnifiedAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  console.log('🏠 Index page - Auth state:', {
    userId: user?.id,
    role,
    isLoading,
    path: window.location.pathname
  });

  useEffect(() => {
    // Only redirect if we have confirmed auth state (not loading)
    if (!isLoading && user && role) {
      console.log('🏠 Index - User logged in with role:', role);
      
      // Super admins should STAY on index page to choose their dashboard
      if (role === 'super_admin') {
        console.log('🏠 Index - Super admin detected, staying on index page');
        return;
      }
      
      // Redirect based on user role for non-super-admin users
      const redirectTimeout = setTimeout(() => {
        switch (role) {
          case 'admin':
            console.log('🏠 Index - Redirecting admin to /admin');
            navigate('/admin');
            break;
          case 'brand':
            console.log('🏠 Index - Redirecting brand to /brand');
            navigate('/brand');
            break;
          case 'creator':
            console.log('🏠 Index - Redirecting creator to /creator');
            navigate('/creator');
            break;
          case 'agency':
            console.log('🏠 Index - Redirecting agency to /agency');
            navigate('/agency');
            break;
          default:
            console.log('🏠 Index - Unknown role, staying on index');
            break;
        }
      }, 100); // Small delay to prevent navigation conflicts

      return () => clearTimeout(redirectTimeout);
    }
  }, [user, role, isLoading, navigate]);

  // Show loading only if still actually loading
  if (isLoading) {
    console.log('🏠 Index - Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('🏠 Index - Rendering full page');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <IndexNavigation user={user} />
      <HeroSection user={user} />
      <TrustedBySection />
      {!isMobile && <FeaturesSection />}
      <WorkflowSection />
      <CreatorSelectionSection />
      <BenefitsSection />
      {!isMobile && <HowItWorksSection />}
      <StatsSection />
      <CTASection user={user} />
      {!isMobile && <FAQSection />}
      <IndexFooter />
    </div>
  );
};

export default Index;
