
import { Copyright } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-4 px-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Copyright className="h-4 w-4" />
          <span>{currentYear} OpenSocials. All rights reserved.</span>
        </div>
        <div className="mt-2 sm:mt-0 flex gap-4 text-sm text-muted-foreground">
          <Link to="/data-deletion" className="hover:text-primary hover:underline transition-colors">
            Delete Data
          </Link>
          <Link to="/privacy-policy" className="hover:text-primary hover:underline transition-colors">
            Privacy Policy
          </Link>
          <Link to="/tos" className="hover:text-primary hover:underline transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
