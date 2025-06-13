
import { Link } from 'react-router-dom';

interface SidebarLogoProps {
  className?: string;
}

const SidebarLogo = ({ className = '' }: SidebarLogoProps) => {
  const logoSrc = "/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png";

  return (
    <Link to="/" className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="OS Logo" 
        className="w-auto h-16 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 object-contain transition-all duration-200"
      />
    </Link>
  );
};

export default SidebarLogo;
