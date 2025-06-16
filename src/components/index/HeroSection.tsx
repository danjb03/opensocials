
import { Button } from "@/components/ui/button";
import { HeroLogo } from "@/components/ui/hero-logo";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface HeroSectionProps {
  user: User | null;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/brand');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <HeroLogo />
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white">
            Creator Partnership
            <br />
            <span className="text-6xl sm:text-7xl lg:text-8xl font-light">Marketplace</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Connect brands with authentic creators. Streamline collaborations, 
            manage campaigns, and drive meaningful results at scale.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 h-auto"
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-600 text-white hover:bg-gray-900 text-lg px-8 py-6 h-auto"
          >
            Watch Demo
          </Button>
        </div>

        <div className="pt-12">
          <p className="text-sm text-gray-500 mb-6">Trusted by leading brands and creators worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Brand logos would go here */}
            <div className="h-8 w-24 bg-gray-800 rounded"></div>
            <div className="h-8 w-24 bg-gray-800 rounded"></div>
            <div className="h-8 w-24 bg-gray-800 rounded"></div>
            <div className="h-8 w-24 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
