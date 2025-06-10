
import { useNavigate } from "react-router-dom";
import Logo from "@/components/ui/logo";

export const IndexFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-12 px-6 border-t border-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Logo className="h-10" />
            <div className="flex items-center space-x-8 text-gray-400 text-sm">
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                Contact
              </button>
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                Privacy & Cookie Policy
              </button>
              <button onClick={() => navigate('/tos')} className="hover:text-white transition-colors">
                Terms & Conditions
              </button>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Made with love by Open Socials
          </div>
        </div>
      </div>
    </footer>
  );
};
