
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Uploads a file to a specified storage bucket
 * @param bucketName The name of the storage bucket
 * @param path The path within the bucket where the file will be stored
 * @param file The file to upload
 * @returns The public URL of the uploaded file or null if upload fails
 */
export const uploadFile = async (bucketName: string, path: string, file: File): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    return urlData?.publicUrl || null;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to upload file: ${errorMessage}`);
    return null;
  }
};

/**
 * Deletes a file from a storage bucket
 * @param bucketName The name of the storage bucket
 * @param path The path to the file within the bucket
 * @returns Boolean indicating success or failure
 */
export const deleteFile = async (bucketName: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to delete file: ${errorMessage}`);
    return false;
  }
};

/**
 * Get a list of files in a bucket path
 * @param bucketName The name of the storage bucket
 * @param path The path within the bucket to list files from
 * @returns Array of file objects or null if operation fails
 */
export const listFiles = async (bucketName: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path);

    if (error) {
      console.error('Error listing files:', error);
      throw error;
    }

    return data || [];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to list files: ${errorMessage}`);
    return [];
  }
};
