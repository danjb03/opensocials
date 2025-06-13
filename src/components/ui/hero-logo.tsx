
import { Link } from 'react-router-dom';

interface HeroLogoProps {
  className?: string;
}

const HeroLogo = ({ className = '' }: HeroLogoProps) => {
  const logoSrc = "/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png";

  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src={logoSrc} 
        alt="OS Logo" 
        className="w-auto h-72 mx-auto"
      />
    </Link>
  );
};

export default HeroLogo;
