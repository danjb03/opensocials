
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
    // First, get the creator type ID based on the selected type name
    const { data: typeRow, error: typeError } = await supabase
      .from("creator_types" as any)
      .select("id")
      .eq("type_name", creatorType)
      .single();

    if (typeError) {
      console.error("Error fetching creator type:", typeError);
      throw new Error("Failed to fetch creator type");
    }

    // Safely check and extract the creator type ID
    if (!typeRow || typeof typeRow !== 'object') {
      throw new Error(`Creator type "${creatorType}" not found`);
    }

    const creatorTypeId = typeRow.id;
    if (!creatorTypeId) {
      throw new Error(`Creator type "${creatorType}" has no ID`);
    }

    // Update the profile with the creator type ID
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        creator_type_id: creatorTypeId,
        is_profile_complete: true
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile with creator type:", profileError);
      throw new Error("Failed to update profile");
    }

    // Get the industry IDs based on the selected industry names
    const { data: industryRows, error: industryError } = await supabase
      .from("creator_industries" as any)
      .select("id, name")
      .in("name", industries);

    if (industryError) {
      console.error("Error fetching industry IDs:", industryError);
      throw new Error("Failed to fetch industries");
    }

    if (!industryRows || !Array.isArray(industryRows) || industryRows.length === 0) {
      console.warn("No matching industries found for:", industries);
      // Continue without adding industries, but don't throw error
    }

    // First, remove any existing industry tags for this user to avoid duplicates
    const { error: deleteError } = await supabase
      .from("creator_industry_tags" as any)
      .delete()
      .eq("creator_id", userId);

    if (deleteError) {
      console.error("Error removing existing industry tags:", deleteError);
      throw new Error("Failed to update industry tags");
    }

    // Only proceed with inserts if we have valid industry rows
    if (industryRows && Array.isArray(industryRows) && industryRows.length > 0) {
      // Prepare the insert data for creator-industry connections
      const inserts = industryRows.map(row => {
        if (!row || typeof row !== 'object' || !row.id) {
          console.warn("Skipping industry row with missing ID:", row);
          return null;
        }
        return {
          creator_id: userId,
          industry_id: row.id
        };
      }).filter(item => item !== null);

      // Insert the new industry connections
      if (inserts && inserts.length > 0) {
        const { error: tagError } = await supabase
          .from("creator_industry_tags" as any)
          .insert(inserts as any);

        if (tagError) {
          console.error("Error inserting industry tags:", tagError);
          throw new Error("Failed to save industry selections");
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in submitCreatorProfile:", error);
    throw error;
  }
}
