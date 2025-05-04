
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { sendEmail } from '@/utils/email';
import type { UserRole } from '@/lib/auth';

export function useAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('creator');

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign up with Supabase, with auto confirm set to false so we can handle our own confirmations
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

        // Create user role entry and set to approved for creators automatically
        // Brands will need to complete profile setup
        const roleStatus = role === 'brand' ? 'pending' : 'approved';
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: role.toLowerCase() as "creator" | "brand" | "admin" | "super_admin",
            status: roleStatus
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

        // Send welcome email based on role using ONLY Resend
        try {
          let emailSubject, emailHtml;
          // Create a custom token that includes the user ID for email confirmation
          const confirmUrl = `${window.location.origin}/auth?confirmation=true&userId=${data.user.id}`;
          
          if (role === 'brand') {
            emailSubject = 'Welcome to OpenSocials Brand Platform!';
            emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Welcome to OpenSocials!</h1>
                <p>Hello ${firstName},</p>
                <p>Thank you for creating a brand account on our platform. We're excited to have you onboard!</p>
                <p>Please confirm your email address by clicking the button below:</p>
                <p style="text-align: center;">
                  <a href="${confirmUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirm Email</a>
                </p>
                <p>After confirming your email, please login and visit the brand setup page.</p>
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
                <p>Please confirm your email address by clicking the button below:</p>
                <p style="text-align: center;">
                  <a href="${confirmUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirm Email</a>
                </p>
                <p>After confirming your email, please login and visit your creator dashboard to complete your profile setup.</p>
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
              from: 'OpenSocials <noreply@opensocials.net>'
            });
            console.log(`Welcome email sent to ${role} user:`, email);
          }
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't block signup process if email fails
        }

        toast.success('Account created successfully! Please check your email to confirm.');
        
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

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        toast.error('Please confirm your email before logging in.');
        setIsLoading(false);
        return;
      }

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

      // Also check the user role status to ensure it's approved
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('status')
        .eq('user_id', data.user.id)
        .maybeSingle();
        
      if (roleError) {
        console.error('Error fetching role status:', roleError);
      }

      // If brand user and status is not approved, redirect to setup page
      if (profileData?.role === 'brand' && roleData?.status !== 'approved') {
        window.location.href = '/brand/setup-profile';
        return;
      }

      // Route based on role
      if (profileData?.role) {
        switch (profileData.role) {
          case 'super_admin':
            window.location.href = '/super-admin';
            break;
          case 'admin':
            window.location.href = '/admin';
            break;
          case 'brand':
            window.location.href = '/brand';
            break;
          case 'creator':
            window.location.href = '/creator';
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

  return {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    role,
    setRole,
    resetForm,
    handleSignUp,
    handleSignIn,
    handleForgotPassword,
  };
}
