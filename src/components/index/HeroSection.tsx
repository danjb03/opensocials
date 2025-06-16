
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroLogo from "@/components/ui/hero-logo";
import { InterestRegistrationModal } from "./InterestRegistrationModal";

interface HeroSectionProps {
  user: any;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [showInterestModal, setShowInterestModal] = useState(false);

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-2">
              <HeroLogo />
            </div>
            <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-tight">
              Creator partnerships,<br />
              <span className="text-gray-400">the efficient way</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              The fastest way to close creator deals, without cutting any corners.
            </p>

            {!user ? (
              <div className="space-y-6">
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="connect"
                    size="connect"
                    onClick={() => navigate('/auth')}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline"
                    size="connect"
                    onClick={() => setShowInterestModal(true)}
                    className="border-white text-white hover:bg-white hover:text-black"
                  >
                    Register Interest
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Join thousands of creators and brands already using our platform
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      
      <InterestRegistrationModal 
        open={showInterestModal} 
        onOpenChange={setShowInterestModal} 
      />
    </>
  );
};
