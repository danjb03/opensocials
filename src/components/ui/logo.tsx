
import { Link, useLocation } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  const location = useLocation();
  
  // Check if we're on the home page or auth page
  const isHomeOrAuth = location.pathname === '/' || location.pathname.startsWith('/auth');
  
  // Use Logo2 (black & white) for home/auth pages, Logo1 for others
  const logoSrc = isHomeOrAuth 
    ? "/lovable-uploads/7780980e-8910-4ad1-a0df-28190a7f66bb.png"  // Logo2 (black & white)
    : "/lovable-uploads/870b5584-9a62-4484-a05f-b373c664e839.png"; // Logo1 (original)
    
  // Use larger size for home/auth pages, smaller for others
  const sizeClass = isHomeOrAuth ? "h-32" : "h-10";

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
