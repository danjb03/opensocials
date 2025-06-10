
import { Link } from 'react-router-dom';

interface HeroLogoProps {
  className?: string;
}

const HeroLogo = ({ className = '' }: HeroLogoProps) => {
  const logoSrc = "/lovable-uploads/1d0809d8-cd41-4f30-9717-c8c13460e048.png";

  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src={logoSrc} 
        alt="OS Logo" 
        className="w-auto h-48"
      />
    </Link>
  );
};

export default HeroLogo;
