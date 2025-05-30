export type IntroType = 'brand' | 'creator';

import { supabase } from '@/integrations/supabase/client';

export async function checkIntro(introType: IntroType): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('check-intro', {
      body: { intro_type: introType },
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) {
      console.error(`Error checking ${introType} intro:`, error);
      return false;
    }

    return data?.showIntro ?? false;
  } catch (err) {
    console.error(`Error checking ${introType} intro:`, err);
    return false;
  }
}
