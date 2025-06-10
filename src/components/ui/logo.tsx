
import { Link, useLocation } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  const location = useLocation();
  
  // Check if we're on the home page or auth page
  const isHomeOrAuth = location.pathname === '/' || location.pathname.startsWith('/auth');
  
  // Use the new OS logo for all pages
  const logoSrc = "/lovable-uploads/7e63b7a0-e62c-4a35-9cb1-700719430688.png";
    
  // Use larger size for home/auth pages, smaller for others
  const sizeClass = isHomeOrAuth ? "h-32" : "h-10";

  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src={logoSrc} 
        alt="OS Logo" 
        className={`w-auto ${sizeClass} mix-blend-screen brightness-0 invert`}
        style={{ 
          filter: 'brightness(0) invert(1)',
          mixBlendMode: 'screen'
        }}
      />
    </Link>
  );
};

export default Logo;
