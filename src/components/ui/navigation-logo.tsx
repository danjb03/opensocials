
import { Link, useLocation } from 'react-router-dom';

interface NavigationLogoProps {
  className?: string;
}

const NavigationLogo = ({ className = '' }: NavigationLogoProps) => {
  const logoSrc = "/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png";

  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src={logoSrc} 
        alt="OS Logo" 
        className="w-auto h-24"
      />
    </Link>
  );
};

export default NavigationLogo;
