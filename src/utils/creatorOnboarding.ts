
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
    console.log('Starting submitCreatorProfile with:', { userId, industries, creatorType });

    // ---- GET CREATOR TYPE ----
    const { data: rawTypeRow, error: typeError } = await supabase
      .from("creator_types")
      .select("id")
      .eq("type_name", creatorType)
      .maybeSingle();

    if (typeError) {
      console.error("Error fetching creator type:", typeError);
      throw new Error(`Failed to fetch creator type: ${typeError.message}`);
    }

    if (!rawTypeRow || !("id" in rawTypeRow)) {
      console.error("Creator type not found:", creatorType);
      throw new Error("Creator type not found");
    }

    const typeId = rawTypeRow.id!;
    console.log('Found creator type ID:', typeId);

    // ---- UPDATE PROFILE WITH CREATOR TYPE ----
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        creator_type_id: typeId,
        is_profile_complete: true 
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile with creator type:", profileError);
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    console.log('Profile updated with creator type successfully');

    // ---- HANDLE INDUSTRIES ----
    if (industries && industries.length > 0) {
      // First, check which industries exist in the creator_industries table
      const { data: existingIndustries, error: existingError } = await supabase
        .from("creator_industries")
        .select("id, name")
        .in("name", industries);

      if (existingError) {
        console.error("Error fetching existing industries:", existingError);
        // Don't throw here, just log - we'll handle missing industries
      }

      const existingIndustryNames = existingIndustries?.map(ind => ind.name) || [];
      const missingIndustries = industries.filter(name => !existingIndustryNames.includes(name));

      console.log('Existing industries:', existingIndustryNames);
      console.log('Missing industries:', missingIndustries);

      // Create any missing industries
      if (missingIndustries.length > 0) {
        const industriesToCreate = missingIndustries.map(name => ({
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));

        const { error: createError } = await supabase
          .from("creator_industries")
          .insert(industriesToCreate);

        if (createError) {
          console.error("Error creating missing industries:", createError);
          // Continue anyway with existing industries
        } else {
          console.log('Created missing industries:', missingIndustries);
        }
      }

      // Now get all industry IDs (including newly created ones)
      const { data: allIndustries, error: allIndustriesError } = await supabase
        .from("creator_industries")
        .select("id, name")
        .in("name", industries);

      if (allIndustriesError || !allIndustries || allIndustries.length === 0) {
        console.error("Error fetching all industry IDs:", allIndustriesError);
        throw new Error("Failed to get industry IDs");
      }

      // Remove existing industry tags for this user to avoid duplicates
      const { error: deleteError } = await supabase
        .from("creator_industry_tags")
        .delete()
        .eq("creator_id", userId);

      if (deleteError) {
        console.error("Error removing existing industry tags:", deleteError);
        // Continue anyway
      }

      // Insert new industry tags
      const industryTags = allIndustries
        .filter((row): row is { id: string; name: string } => !!row && typeof row.id === "string")
        .map(row => ({
          creator_id: userId,
          industry_id: row.id
        }));

      if (industryTags.length > 0) {
        const { error: tagError } = await supabase
          .from("creator_industry_tags")
          .insert(industryTags);

        if (tagError) {
          console.error("Error inserting industry tags:", tagError);
          throw new Error(`Failed to save industry selections: ${tagError.message}`);
        }

        console.log('Successfully created industry tags:', industryTags.length);
      }
    }

    console.log('submitCreatorProfile completed successfully');
    return { success: true };
  } catch (error) {
    console.error("Error in submitCreatorProfile:", error);
    throw error;
  }
}
