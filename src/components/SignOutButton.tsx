
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

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
        navigate('/auth');  // Redirect to authentication page after logout
      }
    } catch (err) {
      console.error('Unexpected error signing out:', err);
      toast.error('Unexpected error signing out.');
    }
  };

  return (
    <Button onClick={handleSignOut} variant="destructive">
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
