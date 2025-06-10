
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NavigationLogo />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-muted-foreground hover:text-foreground transition-colors">Features</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">How it works</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">FAQs</button>
            </div>
            <div className="flex items-center space-x-4">
              {!user && (
                <Button 
                  onClick={() => setShowInterestModal(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
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
