
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

        // Update the profile with role directly
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: role.toLowerCase() })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Failed to assign role to profile:', profileError);
          toast.error('Failed to assign role to profile. Please contact support.');
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
        
        // If the role is brand, create a brand profile entry
        if (role === 'brand') {
          // Create an initial brand profile with minimal data
          // Use upsert instead of insert to handle potential duplicates
          const { error: brandProfileError } = await supabase
            .from('brand_profiles')
            .upsert(
              {
                user_id: data.user.id,
                company_name: `${firstName} ${lastName}'s Brand`, // Temporary company name until setup
                is_complete: false
              },
              { onConflict: 'user_id' }
            );

          if (brandProfileError) {
            console.error('Failed to create brand profile:', brandProfileError);
            console.error('Error details:', JSON.stringify(brandProfileError));
            toast.error('Failed to create brand profile. Please contact support.');
          } else {
            console.log('Brand profile created successfully');
          }
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
