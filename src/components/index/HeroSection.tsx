
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
            <div className="flex justify-center mb-12">
              <HeroLogo />
            </div>
            <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-tight">
              Creator partnerships,<br />
              <span className="text-gray-400">the efficient way</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Innovative solutions for brands and agencies connecting with creators across all major platforms. Arriving shortly.
            </p>

            {!user ? (
              <div className="space-y-6">
                <Button 
                  onClick={() => setShowInterestModal(true)}
                  className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-medium rounded-full"
                >
                  Register
                </Button>
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
