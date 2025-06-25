
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

  console.log('🏠 Index page state:', {
    userId: user?.id,
    role,
    isLoading
  });

  // PROGRESSIVE ENHANCEMENT: Redirect authenticated users after UI is loaded
  useEffect(() => {
    // Only redirect if we have confirmed auth data AND user wants to be redirected
    if (!isLoading && user && role) {
      console.log('🏠 User authenticated, considering redirect for role:', role);
      
      // Super admins stay on index to choose dashboard
      if (role === 'super_admin') {
        return;
      }
      
      // Redirect other roles after a delay to ensure page is usable first
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
      }, 2000); // Give users time to see the page

      return () => clearTimeout(redirectTimer);
    }
  }, [user, role, isLoading, navigate]);

  // ALWAYS render the page immediately - never block on auth state
  console.log('🏠 Index rendering landing page');

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
