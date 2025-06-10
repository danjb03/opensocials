
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
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center bg-gray-900 rounded-full p-2 max-w-md w-full">
                    <input
                      type="email"
                      placeholder="name@email.com"
                      className="bg-transparent text-white placeholder-gray-500 px-4 py-3 flex-1 focus:outline-none"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                      Get notified
                    </Button>
                  </div>
                </div>
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
