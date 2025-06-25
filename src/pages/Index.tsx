
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { user, role } = useUnifiedAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  console.log('🏠 Index page - User state:', { hasUser: !!user, role });

  // Handle authenticated user redirects
  useEffect(() => {
    if (user && role) {
      console.log('🏠 User authenticated, redirecting based on role:', role);
      
      if (role === 'super_admin') {
        return; // Super admins stay on index
      }
      
      // Redirect other roles after a brief delay
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
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [user, role, navigate]);

  // Try to render the full index page
  try {
    // Lazy load components
    const { IndexNavigation } = require("@/components/index/IndexNavigation");
    const { HeroSection } = require("@/components/index/HeroSection");
    const { TrustedBySection } = require("@/components/index/TrustedBySection");
    const { FeaturesSection } = require("@/components/index/FeaturesSection");
    const { WorkflowSection } = require("@/components/index/WorkflowSection");
    const { CreatorSelectionSection } = require("@/components/index/CreatorSelectionSection");
    const { BenefitsSection } = require("@/components/index/BenefitsSection");
    const { HowItWorksSection } = require("@/components/index/HowItWorksSection");
    const { StatsSection } = require("@/components/index/StatsSection");
    const { CTASection } = require("@/components/index/CTASection");
    const { FAQSection } = require("@/components/index/FAQSection");
    const { IndexFooter } = require("@/components/index/IndexFooter");

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
  } catch (error) {
    console.error('Failed to load full Index page:', error);
    
    // Minimal fallback
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-4xl">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png" 
              alt="OS Logo" 
              className="h-32 w-auto mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-tight">
            Creator partnerships,<br />
            <span className="text-gray-400">the efficient way</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed">
            The fastest way to close creator deals, without cutting any corners.
          </p>
          
          {!user && (
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-3 border border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors rounded"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default Index;
