/**
 * Safe Content Review System
 * 
 * This file serves as the main entry point for the safe content review system.
 * It exports all components, hooks, and utilities that implement the loveable.dev
 * pattern for preventing build-time initialization errors with Supabase.
 * 
 * Usage:
 * import { SafeCampaignReviewPanel, useSafeSubmitContent } from '@/safe-content-review-system';
 */

// Safe Supabase Client
export { 
  isSupabaseReady, 
  getSupabaseClient, 
  safeSupabase,
  supabase,
  useSupabaseStatus
} from '@/integrations/supabase/safe-client';

// Safe Hooks
export {
  useSafeCampaignSubmissions,
  useSafeSubmitContent,
  useSafeReviewSubmission,
  useCampaignSubmissions,
  useSubmitContent,
  useReviewSubmission
} from '@/hooks/useSafeCampaignSubmissions';

export {
  createSafeHook,
  createSafeQueryHook,
  createSafeMutationHook,
  useSafeRender,
  withSafeSupabase
} from '@/hooks/safe-hooks';

// Safe Components
export { default as SafeCampaignReviewPanel } from '@/components/brand/campaign-review/SafeCampaignReviewPanel';
export { default as SafeContentUploader } from '@/components/creator/campaigns/SafeContentUploader';
export { default as SafeSubmitProofForm } from '@/components/creator/campaigns/SafeSubmitProofForm';
export { default as SafeContentUpload } from '@/pages/creator/SafeContentUpload';

// Helper Components
export {
  LoadingSpinner,
  LoadingCard,
  ErrorMessage,
  ErrorCard,
  createSafeComponent,
  ClientOnly,
  SupabaseReady,
  SafeCampaignReviewPanel as CampaignReviewPanel,
  SafeContentUploader as ContentUploader,
  SafeSubmitProofForm as SubmitProofForm,
  SafeCampaignUploads as CampaignUploads
} from '@/components/safe-components';

/**
 * How to use this system:
 * 
 * 1. Replace direct Supabase imports with safe imports:
 *    - Instead of: import { supabase } from '@/integrations/supabase/client';
 *    - Use: import { supabase } from '@/safe-content-review-system';
 * 
 * 2. Use safe components instead of regular components:
 *    - Instead of: import CampaignReviewPanel from '@/components/brand/campaign-review/CampaignReviewPanel';
 *    - Use: import { CampaignReviewPanel } from '@/safe-content-review-system';
 * 
 * 3. Use safe hooks instead of regular hooks:
 *    - Instead of: import { useCampaignSubmissions } from '@/hooks/useCampaignSubmissions';
 *    - Use: import { useCampaignSubmissions } from '@/safe-content-review-system';
 * 
 * 4. Wrap components that depend on Supabase with ClientOnly or SupabaseReady:
 *    <ClientOnly>
 *      <SupabaseReady>
 *        <YourComponent />
 *      </SupabaseReady>
 *    </ClientOnly>
 * 
 * This pattern prevents build-time initialization errors and provides graceful
 * degradation when Supabase is not available, avoiding white screen errors.
 */
