# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload at localhost:8080
- `npm run build` - Production build with Vite
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint (expect ~80 TypeScript errors, down from 190)
- `npm run preview` - Preview production build locally
- `npx update-browserslist-db@latest` - Update browser compatibility database

### Supabase Local Development
- `supabase start` - Start local Supabase stack
- `supabase stop` - Stop local Supabase stack
- `supabase db reset` - Reset local database and apply migrations
- `supabase migration new <name>` - Create new migration file
- `supabase functions deploy <function-name>` - Deploy individual Edge Function
- Local services run on ports 54321-54328

### Performance & Bundle Analysis
- Build creates optimized vendor chunks (react-vendor, ui-vendor, etc.)
- Manual chunking configured in vite.config.ts for better loading performance
- Bundle size warnings are expected for feature-rich chunks
- Dynamic imports optimized for better code splitting

## Architecture Overview

### Multi-Tenant Role-Based Platform
This is a creator-brand marketplace platform with four distinct user roles:
- **Creator**: Content creators with social media profiles
- **Brand**: Companies creating campaigns 
- **Admin**: Platform administrators with CRM access
- **Super Admin**: Full system access

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS
- **State**: TanStack React Query for server state
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Auth**: Supabase Auth with role-based access control
- **Forms**: React Hook Form + Zod validation

### Key Architectural Patterns

#### Role-First Organization
All components, pages, and routes are organized by user role:
```
src/
├── components/{auth,admin,brand,creator}/
├── pages/{admin,brand,creator}/
├── routes/{AdminRoutes,BrandRoutes,CreatorRoutes}.tsx
└── hooks/{admin,brand,creator}/
```

#### Multi-Layer Route Protection
1. **ProtectedRoute**: Base authentication check in `src/routes/index.tsx`
2. **Role Guards**: BrandGuard, CreatorGuard with permission checks
3. **Profile Completion**: Redirects to setup if profile incomplete
4. **Super Admin Bypass**: Super admins can access any route

#### Unified Authentication System
The platform uses a consolidated authentication approach:
- **`useUnifiedAuth`**: Primary hook for all authentication data (replaces multiple auth hooks)
- **Parallel data fetching**: Efficiently loads user, role, brand profile, and creator profile
- **Performance optimized**: React.memo and useMemo extensively used for render optimization
- **Persistent state**: Sidebar collapse states and UI preferences preserved in localStorage

#### Custom Hook Pattern
Business logic encapsulated in domain-specific hooks:
- `useUnifiedAuth()` - Consolidated authentication and profile data
- `useProjectData()` - Campaign/project data management
- `useBrandDashboard()` - Derives dashboard data from project data
- `useCreatorInvitations()` - Creator invitation management
- `useProjectCreators()` - Rolling payments and creator relationships
- `useProjectContent()` - Content submission and review workflows
- `useProjectPayments()` - Individual creator payment tracking

#### Edge Function Architecture
Backend logic in Supabase Edge Functions (`/supabase/functions/`):
- Authentication callbacks and user signup flows
- External API integrations (InsightIQ for creator analytics)
- Email sending via Resend API and invite management
- CRM operations and data transformations
- Content submission and review workflows
- Admin validation with shared utilities in `/supabase/functions/shared/`

### Database Architecture

#### Core Tables
- **profiles**: Base user profiles with role fallback
- **user_roles**: Primary role management with approval workflow
- **brand_profiles**: Brand-specific data and settings
- **creator_profiles**: Creator social media profiles and analytics
- **projects**: Campaign/project management
- **deals**: Deal tracking and creator earnings
- **brand_creator_connections**: Brand-creator relationships (invitation system)

#### Rolling Payments Architecture (NEW)
- **project_creators**: Junction table for campaign-creator relationships with status tracking
- **project_creator_payments**: Individual payment tracking with milestone-based payments
- **project_content**: Content submissions with review workflow and performance metrics
- **project_drafts**: Campaign draft system for save/resume functionality

#### Security Features
- **Row Level Security (RLS)**: Database-level access control
- **R4 Rule Engine**: Custom business rule enforcement
- **Audit Logging**: Security and action tracking via `security_audit_log`
- **Feature Flags**: A/B testing capabilities via `secure-update-feature-flags`

### Campaign Wizard & Rolling Payments System
The platform now supports a comprehensive campaign creation and management flow:

#### Campaign Creation Flow
1. **Multi-step Wizard**: CampaignWizard component with 5 steps (basics, content, budget, creators, review)
2. **Draft System**: Real-time saving to `project_drafts` table with localStorage fallback
3. **25% Platform Margin**: Transparent budget breakdown showing gross/net amounts
4. **Creator Selection**: Integration with live creator database for real invitations

#### Rolling Creator Invitations
- **Dynamic Invitations**: Brands can invite additional creators after campaign launch
- **Budget Pool Management**: Remaining budget allocated for rolling invitations
- **Real-time Status**: Track invitation responses and creator onboarding
- **Individual Agreements**: Per-creator budgets and content requirements

#### Payment Architecture
- **Milestone Payments**: Support for contract signing, content submission, completion payments
- **Gross/Net Separation**: Platform takes 25% margin, creators see net amounts only
- **Payment Tracking**: Individual payment status and provider integration ready
- **Creator Transparency**: Creators never see gross amounts, only their net compensation

### Role Resolution Hierarchy
When determining user roles, the system checks:
1. `user_roles` table (primary, includes approval status)
2. `profiles` table (fallback)
3. Auth user metadata (final fallback)

### Profile Completion Flow
New users must complete role-specific profile setup before accessing main features:
- **Brands**: Company info, logo upload, industry selection
- **Creators**: Social handles, content types, audience demographics

### Performance Optimizations
- **React Memoization**: Extensive use of React.memo, useMemo, useCallback on dashboard and table components
- **Bundle Splitting**: Vendor chunking and feature-based code splitting
- **Type Safety**: Systematic replacement of legacy `any` types with proper interfaces
- **Dynamic Imports**: Optimized loading patterns for analytics and mock data

### Supabase Integration
- Local development uses ports 54321-54328
- Edge Functions handle server-side logic
- Real-time subscriptions for live data updates
- Scheduled functions for daily analytics refresh (InsightIQ)
- CORS headers standardized across functions (stored in `admin-utils.ts`)

### UI/UX Conventions
- **Design System**: Monochrome (black/white) with minimal grays
- **Layout**: Role-specific layouts with collapsible sidebars
- **Forms**: Multi-step forms for complex workflows (see `components/brand/project-form/`)
- **Loading States**: Consistent skeleton and loading patterns with async imports
- **Performance**: Extensive use of React.memo, useMemo, and useCallback

### Content Management System
- **Submission Workflow**: Creators upload content through structured forms
- **Review Process**: Brand approval workflow with feedback capabilities
- **Performance Tracking**: Post-publication metrics collection
- **File Management**: Secure upload handling with thumbnail generation

### Security Considerations
- Multiple authentication layers with role-based permissions
- Profile completion checks before feature access
- Secure file upload handling for user assets
- RLS policies enforce data access boundaries
- Rate limiting and input sanitization in Edge Functions
- Creator financial data protection (gross amounts never exposed)