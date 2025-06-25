
import { useEffect, useState } from "react";
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
  const [pageReady, setPageReady] = useState(false);

  console.log('🏠 Index page state:', {
    userId: user?.id,
    role,
    isLoading,
    pageReady
  });

  // Force page to render after short delay regardless of auth state
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only redirect authenticated users with confirmed roles
    if (!isLoading && user && role && pageReady) {
      console.log('🏠 Considering redirect for role:', role);
      
      // Super admins stay on index to choose dashboard
      if (role === 'super_admin') {
        return;
      }
      
      // Redirect other roles after a delay to ensure page is ready
      const redirectTimer = setTimeout(() => {
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
        }
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [user, role, isLoading, pageReady, navigate]);

  // Always render the page - don't let auth state block it
  console.log('🏠 Index rendering full page');

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
