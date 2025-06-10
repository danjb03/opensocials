
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InterestRegistrationModal } from "./InterestRegistrationModal";

interface CTASectionProps {
  user: any;
}

export const CTASection = ({ user }: CTASectionProps) => {
  const [showInterestModal, setShowInterestModal] = useState(false);

  return (
    <>
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            Elevate the way you<br />
            <span className="text-gray-400">source partnerships</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get ready to start producing stunning, efficient campaign work without the hassles of hiring. Soon available.
          </p>
          {!user && (
            <Button 
              onClick={() => setShowInterestModal(true)}
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-medium rounded-full"
            >
              Register
            </Button>
          )}
        </div>
      </section>
      
      <InterestRegistrationModal 
        open={showInterestModal} 
        onOpenChange={setShowInterestModal} 
      />
    </>
  );
};
