
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface CTASectionProps {
  user: User | null;
}

export const CTASection = ({ user }: CTASectionProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/brand');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-light text-white">
            Ready to transform your creator partnerships?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of brands and creators who trust our platform 
            for their collaboration needs. Start your first campaign today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 h-auto"
          >
            {user ? 'Go to Dashboard' : 'Start Free Trial'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-600 text-white hover:bg-gray-900 text-lg px-8 py-6 h-auto"
          >
            Schedule Demo
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          No credit card required • Setup in minutes • Cancel anytime
        </p>
      </div>
    </section>
  );
};
