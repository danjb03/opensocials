
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('creator');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Handle signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              role: role,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          try {
            // Assign role using RPC
            const { error: roleError } = await supabase.rpc('create_user_role', {
              user_id: data.user.id,
              role_type: role,
            });

            if (roleError) {
              console.error("Error creating role:", roleError);
              toast.error("Failed to assign role. Please contact support.");
            } else {
              toast.success('Account created successfully! Check your email to confirm your account.');
            }
          } catch (roleCreateError) {
            console.error("Exception creating role:", roleCreateError);
            toast.error("Failed to assign role. Please contact support.");
          }
        }
      } else {
        // Handle sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          console.error('Login error:', error);
          toast.error(error?.message || 'Failed to login.');
          setIsLoading(false);
          return;
        }

        console.log('Login success! Fetching role...');

        try {
          // Fetch role information after successful login
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role, status')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (roleError) {
            console.error('Error fetching role:', roleError);
            toast.error('Failed to fetch user role.');
            setIsLoading(false);
            return;
          }

          // Check if role data exists
          if (!roleData) {
            toast.warning('No role assigned. Please contact an administrator.');
            navigate('/');
            setIsLoading(false);
            return;
          }

          // Handle different role statuses
          if (roleData.status === 'approved') {
            switch (roleData.role) {
              case 'admin':
                navigate('/admin');
                break;
              case 'brand':
                navigate('/brand');
                break;
              case 'creator':
                navigate('/creator');
                break;
              default:
                console.error('Unknown role:', roleData.role);
                toast.error('Invalid user role.');
                navigate('/');
            }
          } else {
            navigate('/');
            if (roleData.status === 'pending') {
              toast.info('Your account is pending approval.');
            } else if (roleData.status === 'declined') {
              toast.error('Your account has been declined.');
            } else {
              toast.warning('No role assigned. Please contact an administrator.');
            }
          }
        } catch (roleCheckError) {
          console.error("Exception checking role:", roleCheckError);
          toast.error("Failed to check role. Please try again.");
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || 'Unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Check your email for password reset instructions');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {isSignUp && (
            <>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="creator">Creator</option>
                  <option value="brand">Brand</option>
                </select>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp ? 'Already have an account?' : 'Need an account?'}
            </Button>
            {!isSignUp && (
              <Button
                type="button"
                variant="link"
                onClick={handleForgotPassword}
                className="text-sm"
              >
                Forgot password?
              </Button>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
