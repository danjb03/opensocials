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
            role: role, // saving to metadata
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        console.log('User signed up:', data.user.id);

        const { error: roleError } = await supabase.rpc('create_user_role', {
          user_id: data.user.id,
          role_type: role,
        });

        if (roleError) {
          console.error('Failed to assign role:', roleError);
          toast.error('Failed to assign role. Please contact support.');
          return;
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

      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err.message);
      toast.error(err.message || 'Login failed.');
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
      toast.success('Check your email for password reset instructions.');
    } catch (err: any) {
      toast.error(err.message || 'Password reset failed.');
    }
  };

  return (

