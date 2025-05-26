
import { supabase } from "@/integrations/supabase/client";

/**
 * Submits creator profile industry and type selections to creator_profiles table
 * This updates the creator profile with their selected industries and creator type
 */
export async function submitCreatorProfile({
  userId,
  industries,
  creatorType
}: {
  userId: string;
  industries: string[];
  creatorType: string;
}) {
  try {
    console.log('Starting submitCreatorProfile with:', { userId, industries, creatorType });

    // Update creator_profiles table with industry and creator type data
    const { error: updateError } = await supabase
      .from('creator_profiles')
      .upsert({
        user_id: userId,
        industries: industries,
        creator_type: creatorType,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating creator profile:', updateError);
      throw new Error(`Failed to update creator profile: ${updateError.message}`);
    }

    console.log('Creator profile updated successfully with industries and creator type');

    console.log('submitCreatorProfile completed successfully');
    return { success: true };
  } catch (error) {
    console.error("Error in submitCreatorProfile:", error);
    throw error;
  }
}
