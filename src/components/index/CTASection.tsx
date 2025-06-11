
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
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Faded background design */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-br from-white/20 to-transparent rounded-[40px] rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-br from-white/15 to-transparent rounded-[30px] -rotate-6"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-gradient-to-br from-white/10 to-transparent rounded-[20px] rotate-3"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            Partnerships done properly.
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            The best creators are already vetted, briefed, and ready to go. Deals land fast. Campaigns launch faster.
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
