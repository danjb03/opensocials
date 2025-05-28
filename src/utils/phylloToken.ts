
import { supabase } from '@/integrations/supabase/client';

export const generatePhylloToken = async (userId: string, userEmail?: string) => {
  console.log('Generating Phyllo token for user:', userId);
  
  const { data, error } = await supabase.functions.invoke('generatePhylloToken', {
    body: {
      user_id: userId,
      user_name: userEmail?.split('@')[0] || 'User'
    }
  });

  if (error) {
    console.error('Error generating Phyllo token:', error);
    throw new Error(error.message || 'Failed to generate Phyllo token');
  }

  if (!data?.token) {
    console.error('No token received from generatePhylloToken. Full response:', data);
    throw new Error('No token received from server');
  }

  console.log('Successfully generated Phyllo token');
  return data.token;
};
