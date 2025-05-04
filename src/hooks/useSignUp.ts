
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  setIsLoading: (isLoading: boolean) => void;
  resetForm: () => void;
}

export function useSignUp() {
  const handleSignUp = async ({
    email,
    password,
    firstName,
    lastName,
    role,
    setIsLoading,
    resetForm,
  }: SignUpParams): Promise<boolean> => {
    setIsLoading(true);
    console.log(`Signing up user with role: ${role}`); // Debug log

    try {
      // Sign up with Supabase, with auto confirm set to true to use Supabase's email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role // Ensure the role is passed correctly in user metadata
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmation=true`,
        },
      });

      if (error) throw error;
      
      console.log("Signup response:", data); // Debug log

      if (data.user) {
        console.log('User signed up:', data.user.id, 'with role:', role);
        toast.success('Account created! Please check your email to confirm.');
        
        // Reset form fields and switch to login view
        resetForm();
        return true; // Return true to indicate success so the parent component can update UI state
      }
    } catch (err: any) {
      console.error('Signup error:', err.message);
      toast.error(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
    
    return false; // Return false if signup was not successful
  };

  return { handleSignUp };
}
