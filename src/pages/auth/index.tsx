
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';
import Logo from '@/components/ui/logo';
import { sendEmail } from '@/utils/email';

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
    if (isSignUp) {
      await handleSignUp(e);
    } else {
      await handleSignIn();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        console.log('User signed up:', data.user.id);

        // Update the profile with role directly
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: role.toLowerCase() })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Failed to assign role:', profileError);
          toast.error('Failed to assign role. Please contact support.');
          return;
        }

        // Send welcome email based on role
        try {
          let emailSubject, emailHtml;
          
          if (role === 'brand') {
            emailSubject = 'Welcome to OpenSocials Brand Platform!';
            emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Welcome to OpenSocials!</h1>
                <p>Hello ${firstName},</p>
                <p>Thank you for creating a brand account on our platform. We're excited to have you onboard!</p>
                <p>To complete your profile setup, please login and visit the brand setup page.</p>
                <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
                <p>Best regards,<br>The OpenSocials Team</p>
              </div>
            `;
          } else if (role === 'creator') {
            emailSubject = 'Welcome to OpenSocials Creator Community!';
            emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Welcome to OpenSocials!</h1>
                <p>Hello ${firstName},</p>
                <p>Thank you for joining our creator community. We're thrilled to have you with us!</p>
                <p>To complete your profile setup and start connecting with brands, please login and visit your creator dashboard.</p>
                <p>If you have any questions, our support team is always here to help.</p>
                <p>Best regards,<br>The OpenSocials Team</p>
              </div>
            `;
          }
          
          if (emailSubject && emailHtml) {
            await sendEmail({
              to: email,
              subject: emailSubject,
              html: emailHtml,
            });
            console.log(`Welcome email sent to ${role} user:`, email);
          }
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't block signup process if email fails
        }

        toast.success('Account created successfully! Please check your email to confirm.');
      }
    } catch (err: any) {
      console.error('Signup error:', err.message);
      toast.error(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user role:', profileError);
        toast.error('Failed to fetch user role.');
        return;
      }

      if (profileData?.role) {
        switch (profileData.role) {
          case 'super_admin':
            navigate('/super-admin');
            break;
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
            console.error('Unknown role:', profileData.role);
            toast.error('Invalid user role');
        }
      } else {
        toast.error('No role assigned.');
      }
    } catch (err: any) {
      console.error('Login error:', err.message);
      toast.error(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Check your email for reset instructions.');
    } catch (err: any) {
      toast.error(err.message || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
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
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
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
