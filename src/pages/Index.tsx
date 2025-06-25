
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import SafeIndex from "./SafeIndex";

const Index = () => {
  const [canRenderFull, setCanRenderFull] = useState(false);
  const [authData, setAuthData] = useState({ user: null, role: null, isLoading: true });
  const navigate = useNavigate();

  // Try to load auth data, but don't block rendering
  useEffect(() => {
    let mounted = true;
    
    // Start with safe rendering immediately
    setCanRenderFull(false);
    
    // Try to get auth data with timeout
    const loadAuth = async () => {
      try {
        const { user, role, isLoading } = useUnifiedAuth();
        
        if (mounted) {
          setAuthData({ user, role, isLoading });
          
          // Only enable full rendering if auth loads successfully
          if (!isLoading) {
            setTimeout(() => {
              if (mounted) setCanRenderFull(true);
            }, 100);
          }
        }
      } catch (error) {
        console.warn('Auth loading failed, using safe mode:', error);
        if (mounted) {
          setAuthData({ user: null, role: null, isLoading: false });
        }
      }
    };

    // Emergency timeout - always show something after 1 second
    const emergencyTimer = setTimeout(() => {
      if (mounted) {
        console.log('🏠 Emergency: Forcing safe render mode');
        setAuthData({ user: null, role: null, isLoading: false });
      }
    }, 1000);

    loadAuth();

    return () => {
      mounted = false;
      clearTimeout(emergencyTimer);
    };
  }, []);

  // Handle redirects only after everything is loaded
  useEffect(() => {
    if (!authData.isLoading && authData.user && authData.role && canRenderFull) {
      console.log('🏠 User authenticated, considering redirect for role:', authData.role);
      
      if (authData.role === 'super_admin') {
        return; // Super admins stay on index
      }
      
      // Redirect other roles after a delay
      const redirectTimer = setTimeout(() => {
        switch (authData.role) {
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
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [authData, canRenderFull, navigate]);

  // Try to render full version if possible, otherwise use safe version
  if (canRenderFull) {
    try {
      // Lazy load full components
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
      const isMobile = useIsMobile();

      return (
        <div className="min-h-screen bg-background text-foreground">
          <IndexNavigation user={authData.user} />
          <HeroSection user={authData.user} />
          <TrustedBySection />
          {!isMobile && <FeaturesSection />}
          <WorkflowSection />
          <CreatorSelectionSection />
          <BenefitsSection />
          {!isMobile && <HowItWorksSection />}
          <StatsSection />
          <CTASection user={authData.user} />
          {!isMobile && <FAQSection />}
          <IndexFooter />
        </div>
      );
    } catch (error) {
      console.warn('Full Index rendering failed, using safe mode:', error);
      return <SafeIndex user={authData.user} />;
    }
  }

  // Always return safe version as fallback
  return <SafeIndex user={authData.user} />;
};

export default Index;
