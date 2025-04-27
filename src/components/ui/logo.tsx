
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src="/lovable-uploads/7780980e-8910-4ad1-a0df-28190a7f66bb.png" 
        alt="OS Logo" 
        className="h-8 w-auto"
      />
    </Link>
  );
};

export default Logo;
