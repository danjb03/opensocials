
import { Link, useLocation } from 'react-router-dom';

interface NavigationLogoProps {
  className?: string;
}

const NavigationLogo = ({ className = '' }: NavigationLogoProps) => {
  const logoSrc = "/lovable-uploads/1d0809d8-cd41-4f30-9717-c8c13460e048.png";

  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src={logoSrc} 
        alt="OS Logo" 
        className="w-auto h-12"
      />
    </Link>
  );
};

export default NavigationLogo;
