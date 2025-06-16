
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/auth';
import { sanitizeString, validateEmail } from '@/utils/security';

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  setIsLoading: (loading: boolean) => void;
  resetForm: () => void;
}

// Password strength validation
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { isValid: errors.length === 0, errors };
};

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
    console.log(`🆕 Starting signup process for ${role}...`);

    try {
      // Validate inputs
      if (!firstName.trim() || !lastName.trim()) {
        toast.error('First name and last name are required.');
        return false;
      }

      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address.');
        return false;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors[0]);
        return false;
      }

      if (!role) {
        toast.error('Please select your role.');
        return false;
      }

      // Sanitize inputs
      const sanitizedFirstName = sanitizeString(firstName.trim(), 50);
      const sanitizedLastName = sanitizeString(lastName.trim(), 50);

      if (!sanitizedFirstName || !sanitizedLastName) {
        toast.error('Please provide valid first and last names.');
        return false;
      }

      console.log('📧 Attempting to create user account...');

      // Sign up the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: sanitizedFirstName,
            last_name: sanitizedLastName,
            role: role,
            // Include company_name for brands if needed
            ...(role === 'brand' && { company_name: `${sanitizedFirstName} ${sanitizedLastName}'s Brand` })
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmation=true`
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          toast.error('An account with this email already exists. Please try signing in instead.');
          return false;
        } else if (error.message.includes('Password should be')) {
          toast.error('Password must be at least 6 characters long.');
          return false;
        } else if (error.message.includes('Invalid email')) {
          toast.error('Please enter a valid email address.');
          return false;
        } else if (error.message.includes('Signup is disabled')) {
          toast.error('Account registration is currently disabled. Please contact support.');
          return false;
        } else if (error.message.includes('rate limit')) {
          toast.error('Too many signup attempts. Please wait a moment and try again.');
          return false;
        } else {
          toast.error(`Registration failed: ${error.message}`);
          return false;
        }
      }

      if (data.user) {
        console.log('✅ User created successfully:', data.user.id);
        console.log('📧 Email confirmation status:', data.user.email_confirmed_at ? 'confirmed' : 'pending');
        
        // Check if email was confirmed immediately (if email confirmation is disabled in Supabase)
        if (data.user.email_confirmed_at) {
          toast.success('Account created successfully! You can now log in.');
        } else {
          toast.success('Account created! Please check your email to confirm your account before logging in.', {
            duration: 5000
          });
        }
        
        resetForm();
        return true;
      } else {
        console.error('❌ No user returned from signup');
        toast.error('Account creation failed. Please try again.');
        return false;
      }
    } catch (err: any) {
      console.error('❌ Signup failed with exception:', err);
      
      // Handle network and other unexpected errors
      if (err.message?.includes('Failed to fetch') || err.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (err.message?.includes('sending email') || err.message?.includes('confirmation email')) {
        toast.success('Account created but there was an issue sending the confirmation email. Please contact support if needed.');
        resetForm();
        return true; // Account was created successfully
      } else {
        toast.error(`Registration failed: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  return { handleSignUp };
}
