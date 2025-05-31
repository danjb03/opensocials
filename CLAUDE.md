
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload at localhost:8080
- `npm run build` - Production build with Vite
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint (expect ~190 TypeScript errors due to legacy `any` types)
- `npm run preview` - Preview production build locally
- `npx update-browserslist-db@latest` - Update browser compatibility database

### Supabase Local Development
- `supabase start` - Start local Supabase stack
- `supabase stop` - Stop local Supabase stack
- `supabase db reset` - Reset local database
- Local services run on ports 54321-54328

### Performance & Bundle Analysis
- Build warnings about 500KB+ chunks are expected
- Dynamic imports in `mock-data.ts` and `userDataStore.ts` are intentional optimizations
- Run builds to verify TypeScript compilation after major changes

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

#### Edge Function Architecture
Backend logic in Supabase Edge Functions (`/supabase/functions/`):
- Authentication callbacks and user signup flows
- External API integrations (InsightIQ for creator analytics)
- Email sending via Resend API and invite management
- CRM operations and data transformations
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

#### Security Features
- **Row Level Security (RLS)**: Database-level access control
- **R4 Rule Engine**: Custom business rule enforcement
- **Audit Logging**: Security and action tracking via `security_audit_log`
- **Feature Flags**: A/B testing capabilities via `secure-update-feature-flags`

### Campaign-Creator Relationship Model (ARCHITECTURAL GAP)
**Current Limitation**: The platform lacks direct campaign-creator relationships:
- Projects and creators are managed separately
- No campaign-specific creator assignments
- Payment system disconnected from campaigns
- Mock creator data generated in `orderUtils.ts`

**Known Issue**: To support rolling creator acceptance and individual payments, the system requires:
- New `project_creators` junction table
- Campaign-specific invitation system
- Per-creator payment tracking
- See `/database-migration-rolling-payments.sql` for required schema changes

### Role Resolution Hierarchy
When determining user roles, the system checks:
1. `user_roles` table (primary, includes approval status)
2. `profiles` table (fallback)
3. Auth user metadata (final fallback)

### Profile Completion Flow
New users must complete role-specific profile setup before accessing main features:
- **Brands**: Company info, logo upload, industry selection
- **Creators**: Social handles, content types, audience demographics

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

### Security Considerations
- Multiple authentication layers with role-based permissions
- Profile completion checks before feature access
- Secure file upload handling for user assets
- RLS policies enforce data access boundaries
- Rate limiting and input sanitization in Edge Functions