
import { Link, useLocation } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  const location = useLocation();
  
  // Check if we're on the home page or auth page
  const isHomeOrAuth = location.pathname === '/' || location.pathname.startsWith('/auth');
  
  // Use the new logo
  const logoSrc = "/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png";
    
  // Use larger size for home/auth pages, smaller for others - made footer size much smaller
  const sizeClass = isHomeOrAuth ? "h-64" : "h-8";

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
