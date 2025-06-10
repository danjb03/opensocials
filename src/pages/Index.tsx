
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { IndexNavigation } from "@/components/index/IndexNavigation";
import { HeroSection } from "@/components/index/HeroSection";
import { TrustedBySection } from "@/components/index/TrustedBySection";
import { FeaturesSection } from "@/components/index/FeaturesSection";
import { WorkflowSection } from "@/components/index/WorkflowSection";
import { FeaturesGrid } from "@/components/index/FeaturesGrid";
import { HowItWorksSection } from "@/components/index/HowItWorksSection";
import { TestimonialsSection } from "@/components/index/TestimonialsSection";
import { StatsSection } from "@/components/index/StatsSection";
import { CTASection } from "@/components/index/CTASection";
import { IndexFooter } from "@/components/index/IndexFooter";

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
      <IndexNavigation user={user} />
      <HeroSection user={user} />
      <TrustedBySection />
      <FeaturesSection />
      <WorkflowSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <TestimonialsSection />
      <StatsSection />
      <CTASection user={user} />
      <IndexFooter />
    </div>
  );
};

export default Index;
