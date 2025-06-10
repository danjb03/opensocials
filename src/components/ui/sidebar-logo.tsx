
import { Link } from 'react-router-dom';

interface SidebarLogoProps {
  className?: string;
}

const SidebarLogo = ({ className = '' }: SidebarLogoProps) => {
  const logoSrc = "/lovable-uploads/1d0809d8-cd41-4f30-9717-c8c13460e048.png";

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
