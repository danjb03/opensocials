
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

    try {
      // Sign up with Supabase, with auto confirm set to true to use Supabase's email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role.toLowerCase(), // Store role in user metadata
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmation=true`,
        },
      });

      if (error) throw error;

      if (data.user) {
        console.log('User signed up:', data.user.id);

        // Create profile with role
        const profileData = {
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          role: role.toLowerCase(),
          email: email
        };
        
        // If role is brand, add brand-specific fields
        if (role === 'brand') {
          Object.assign(profileData, {
            company_name: `${firstName} ${lastName}'s Brand`, // Temporary company name until setup
            is_complete: false
          });
        }
        
        // Upsert to profiles (will create if doesn't exist)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (profileError) {
          console.error('Failed to create profile:', profileError);
          toast.error('Failed to create profile. Please contact support.');
        }

        // Create user role entry and set to pending until email confirmation
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: role.toLowerCase() as "creator" | "brand" | "admin" | "super_admin",
            status: 'pending'
          });

        if (roleError) {
          console.error('Failed to create user role:', roleError);
          // Continue with signup despite error
        }

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
