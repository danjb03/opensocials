
import { Copyright } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-4 px-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Copyright className="h-4 w-4" />
          <span>{currentYear} OpenSocials. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
