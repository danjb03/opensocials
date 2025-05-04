
# Brand Profiles Migration TODO

This file lists all components and files that were updated to work with the unified profiles table instead of a separate brand_profiles table.

## Updated Files:
- src/hooks/useSignUp.ts
  - Updated to ensure user metadata contains role
  - Removed separate profile creation for brands

- src/components/auth/SignUpForm.tsx
  - Improved role selection with proper typing

- src/components/AuthProvider.tsx
  - Updated to fetch role from user metadata and profiles table
  - Improved error handling for missing roles

- src/hooks/useEmailConfirmation.ts
  - Updated to handle email confirmations and properly update profile status
  - Removed references to brand_profiles

- src/components/BrandGuard.tsx
  - Updated to check brand profiles in the profiles table
  - Improved routing based on profile completion status

- src/hooks/useBrandProfile.ts
  - Was already using profiles table with role filtering

## Things to Review Later:
- Profile setup screens - ensure they properly save to the unified profiles table
- Dashboard views - confirm they correctly fetch and display brand information
- Admin views - ensure they correctly identify and manage brand accounts
- Future feature implementations - maintain the unified table approach

## Data Migration Notes:
- The `handle_new_user` trigger function now handles brand profile creation directly in the profiles table
- User role information is stored both in user metadata and the user_roles table
- Profile completion status is tracked using the is_complete field in the profiles table
