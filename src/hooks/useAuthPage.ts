
import { useState } from 'react';

export function useAuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };
  
  return {
    isSignUp,
    toggleAuthMode
  };
}
