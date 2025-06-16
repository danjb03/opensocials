
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationLogo from "@/components/ui/navigation-logo";
import { InterestRegistrationModal } from "./InterestRegistrationModal";
import { useIsMobile } from "@/hooks/use-mobile";

interface IndexNavigationProps {
  user: any;
}

export const IndexNavigation = ({
  user
}: IndexNavigationProps) => {
  const navigate = useNavigate();
  const [showInterestModal, setShowInterestModal] = useState(false);
  const isMobile = useIsMobile();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NavigationLogo />
            </div>
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-muted-foreground hover:text-foreground transition-colors">
                  How it works
                </button>
                <button onClick={() => scrollToSection('faqs')} className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </button>
              </div>
            )}
            <div className="flex items-center space-x-4">
              {!user && <Button variant="connect" size="connect" onClick={() => setShowInterestModal(true)}>
                  Get Started
                </Button>}
            </div>
          </div>
        </div>
      </nav>
      
      <InterestRegistrationModal open={showInterestModal} onOpenChange={setShowInterestModal} />
    </>;
};
