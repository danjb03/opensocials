
import { supabase } from "@/integrations/supabase/client";

/**
 * Submits creator profile industry and type selections to Supabase
 * This connects the creator to their selected industries and creator type
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
    // Fetch creator type ID safely
    const { data: typeRow, error: typeError } = await supabase
      .from("creator_types")
      .select("*")
      .eq("type_name", creatorType)
      .maybeSingle();

    if (typeError || !typeRow || !typeRow.id) {
      console.error("Error fetching creator type:", typeError);
      throw new Error("Creator type not found");
    }

    // Update profile with creator_type_id
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        creator_type_id: typeRow.id,
        is_profile_complete: true 
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile with creator type:", profileError);
      throw new Error("Failed to update profile");
    }

    // Fetch industry IDs
    const { data: industryRows, error: industryError } = await supabase
      .from("creator_industries")
      .select("*")
      .in("name", industries);

    if (industryError || !industryRows || industryRows.length === 0) {
      console.error("Error fetching industry IDs:", industryError);
      throw new Error("Industry tags not found");
    }

    // First, remove any existing industry tags for this user to avoid duplicates
    const { error: deleteError } = await supabase
      .from("creator_industry_tags")
      .delete()
      .eq("creator_id", userId);

    if (deleteError) {
      console.error("Error removing existing industry tags:", deleteError);
      throw new Error("Failed to update industry tags");
    }

    const inserts = industryRows
      .filter((row): row is { id: string } => row?.id !== undefined)
      .map(row => ({
        creator_id: userId,
        industry_id: row.id
      }));

    // Insert the new industry connections
    if (inserts.length > 0) {
      const { error: tagError } = await supabase
        .from("creator_industry_tags")
        .insert(inserts);

      if (tagError) {
        console.error("Error inserting industry tags:", tagError);
        throw new Error("Failed to save industry selections");
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in submitCreatorProfile:", error);
    throw error;
  }
}
