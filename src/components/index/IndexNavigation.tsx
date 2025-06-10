
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationLogo from "@/components/ui/navigation-logo";
import { InterestRegistrationModal } from "./InterestRegistrationModal";

interface IndexNavigationProps {
  user: any;
}

export const IndexNavigation = ({ user }: IndexNavigationProps) => {
  const navigate = useNavigate();
  const [showInterestModal, setShowInterestModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NavigationLogo />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-400 hover:text-white transition-colors">Features</button>
              <button className="text-gray-400 hover:text-white transition-colors">How it works</button>
              <button className="text-gray-400 hover:text-white transition-colors">Testimonials</button>
              <button className="text-gray-400 hover:text-white transition-colors">FAQs</button>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowInterestModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Register your interest today
              </Button>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-black hover:bg-gray-200 px-6"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <InterestRegistrationModal 
        open={showInterestModal} 
        onOpenChange={setShowInterestModal} 
      />
    </>
  );
};
