
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Logo from '@/components/ui/logo';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      toast.success('Password updated successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-white">
            Reset your password
          </h2>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-8">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-white text-sm font-medium">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 bg-black border-border text-white placeholder:text-muted-foreground focus:border-white"
                placeholder="Enter your new password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200 font-medium py-3" 
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
            
            <div className="text-center pt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-white text-sm p-0"
              >
                Back to sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
