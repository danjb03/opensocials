
import { Link, useLocation } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  const location = useLocation();
  
  // Check if we're on the home page or auth page
  const isHomeOrAuth = location.pathname === '/' || location.pathname.startsWith('/auth');
  
  // Use the new OS logo
  const logoSrc = "/lovable-uploads/1d0809d8-cd41-4f30-9717-c8c13460e048.png";
    
  // Use larger size for home/auth pages, smaller for others - doubled from original sizes
  const sizeClass = isHomeOrAuth ? "h-64" : "h-20";

  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src={logoSrc} 
        alt="OS Logo" 
        className={`w-auto ${sizeClass}`}
      />
    </Link>
  );
};

export default Logo;
