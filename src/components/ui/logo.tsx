
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`block ${className}`}>
      <img 
        src="/lovable-uploads/2c8624f4-39bb-424c-bfe5-aa9b8999ebd7.png" 
        alt="OS Logo" 
        className="h-8 w-auto"
      />
    </Link>
  );
};

export default Logo;
