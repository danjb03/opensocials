
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
        className="h-32 w-auto"  // Changed from h-8 to h-32 (4x larger)
      />
    </Link>
  );
};

export default Logo;
