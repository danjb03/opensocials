
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out.');
      } else {
        toast.success('Signed out successfully.');
        navigate('/auth');
      }
    } catch (err) {
      console.error('Unexpected error signing out:', err);
      toast.error('Unexpected error signing out.');
    }
  };

  return (
    <Button onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
