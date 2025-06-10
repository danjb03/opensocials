
# OS Platform Style Guide & Development Standards

## 1. Project Overview
OS Platform is a creator partnership marketplace connecting brands and agencies with content creators across all major social media platforms. The platform streamlines the entire creator collaboration process from discovery to payment, featuring a sophisticated black background with white text aesthetic.

### Mission & Vision
To revolutionize how brands and creators collaborate by providing a transparent, efficient marketplace that maximizes value for all parties.

### Key Objectives
- Simplify creator discovery and campaign management
- Standardize collaboration workflows and payment processes
- Provide meaningful analytics and performance tracking
- Create a premium, consistent user experience across all touchpoints

## 2. User Personas

### Brand Managers
- **Demographics**: Marketing professionals, 28-45 years old
- **Goals**: Discover relevant creators, manage campaigns efficiently, track ROI
- **Pain Points**: Finding qualified creators, managing communications, tracking deliverables
- **Technical Proficiency**: Intermediate

### Content Creators
- **Demographics**: Social media professionals, 20-35 years old
- **Goals**: Find paid opportunities, showcase work, build client relationships
- **Pain Points**: Payment security, unclear expectations, communication overhead
- **Technical Proficiency**: Varies widely

### Agency Account Managers
- **Demographics**: Marketing professionals, 25-40 years old
- **Goals**: Manage multiple brand accounts, scale creator relationships
- **Pain Points**: Reporting to clients, managing multiple campaigns simultaneously
- **Technical Proficiency**: Intermediate to advanced

### Platform Administrators
- **Demographics**: Operations professionals, 30-50 years old
- **Goals**: Oversee platform health, manage users, ensure compliance
- **Pain Points**: Troubleshooting issues, maintaining platform integrity
- **Technical Proficiency**: Advanced

## 3. Feature Specifications

### Creator Discovery
- Advanced search with filters for platform, audience demographics, engagement rates
- AI-powered creator matching based on brand requirements
- Favorites and saved searches functionality
- Creator profile viewing with comprehensive analytics

### Campaign Management
- Multi-step campaign creation wizard
- Brief template system with customization options
- Creator invitation and onboarding workflow
- Content approval and feedback system
- Performance tracking and reporting

### Payment System
- Milestone-based payment framework
- Escrow functionality for payment security
- Platform fee structure (25% standard margin)
- Payment history and tax documentation

### Analytics Dashboard
- Campaign performance metrics
- Creator performance tracking
- ROI calculation and reporting
- Audience demographic insights

## 4. Design System - Black Background, White Text

### Color Palette
```css
/* Primary Colors - ALWAYS USE THESE */
--background: #000000 (Pure Black backgrounds)
--foreground: #FFFFFF (Pure White text)
--muted-foreground: #888888 (Gray for secondary text)
--card: #0A0A0A (Slightly lighter black for cards)
--border: #333333 (Subtle borders)
--muted: #1A1A1A (Subtle backgrounds for sections)

/* Interactive Elements */
--accent: #FFFFFF (White buttons/highlights)
--accent-foreground: #000000 (Black text on white buttons)
--secondary: #333333 (Secondary button backgrounds)
--secondary-foreground: #FFFFFF (White text on secondary buttons)
```

### Typography Hierarchy
```css
/* Hero Text - Ultra Large */
font-size: 6xl-8xl (96px-128px)
font-weight: 300-400 (Light to Regular)
line-height: 1.1
letter-spacing: -0.025em
color: #FFFFFF

/* Page Headlines */
font-size: 4xl-5xl (36px-48px)
font-weight: 300-400
line-height: 1.2
color: #FFFFFF

/* Section Titles */
font-size: 2xl-3xl (24px-30px)
font-weight: 400-500
color: #FFFFFF

/* Body Text */
font-size: lg-xl (18px-20px)
font-weight: 400
line-height: 1.6
color: #888888 (muted gray)

/* Navigation & UI Text */
font-size: base (16px)
font-weight: 400
color: #888888 with hover: #FFFFFF
```

### Component Styling Standards
See `tailwind.config.ts` for implementation details of these components.

## 5. API Documentation

### Authentication Endpoints
- `POST /auth/login`: User login with email/password
- `POST /auth/register`: User registration
- `POST /auth/forgot-password`: Password reset request
- `GET /auth/user`: Get current user data

### Creator Endpoints
- `GET /creators`: List creators with filtering options
- `GET /creators/:id`: Get creator profile details
- `POST /creators/invite`: Invite creator to platform
- `PUT /creators/:id`: Update creator profile

### Campaign Endpoints
- `GET /campaigns`: List campaigns with filtering
- `POST /campaigns`: Create new campaign
- `GET /campaigns/:id`: Get campaign details
- `PUT /campaigns/:id`: Update campaign
- `DELETE /campaigns/:id`: Delete campaign

### Content Management Endpoints
- `POST /content/upload`: Upload content for review
- `POST /content/approve`: Approve creator content
- `POST /content/reject`: Reject content with feedback

### Payment Endpoints
- `POST /payments/create`: Create payment milestone
- `GET /payments/history`: Get payment history
- `POST /payments/release`: Release escrowed payment

## 6. Database Schema
The application uses a PostgreSQL database via Supabase with the following key tables:

### Core Tables
- `profiles`: Base user profiles with role information
- `user_roles`: Role management and permissions
- `brand_profiles`: Brand-specific information
- `creator_profiles`: Creator information and metrics
- `projects`: Campaign/project details
- `project_creators`: Junction table for campaign-creator relationships
- `project_content`: Content submissions and reviews
- `deals`: Commercial agreements between parties
- `payments`: Payment tracking and processing

### Relationships
- Users can have multiple roles (admin, brand, creator, agency)
- Brands can have multiple campaigns/projects
- Campaigns can have multiple creators
- Creators can submit multiple content pieces per campaign

## 7. Environment Setup

### Development Prerequisites
- Node.js 18+ and npm/yarn
- Supabase local development setup
- TypeScript 4.9+
- React 18+

### Configuration
- Environment variables needed in `.env`:
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
  - `VITE_RESEND_API_KEY`: Email service API key
  - `VITE_INSIGHTIQ_API_KEY`: Analytics API key

### Local Development
- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run lint`: Run ESLint checks

## 8. Testing Guidelines

### Testing Strategy
- Unit tests for utilities and hooks
- Component tests for UI elements
- Integration tests for workflows
- E2E tests for critical paths

### Test Coverage Requirements
- 80% coverage for utility functions
- 70% coverage for components
- 90% coverage for authentication and payment flows

## 9. Deployment Instructions

### Staging Deployment
- Connected to `develop` branch
- Automatically deploys on PR merge
- Environment: https://staging.osplatform.com

### Production Deployment
- Connected to `main` branch
- Requires manual approval
- Environment: https://osplatform.com

## 10. Version Control Practices

### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- Feature branches: `feature/feature-name`
- Bugfix branches: `bugfix/issue-description`
- Release branches: `release/version-number`

### Commit Message Convention
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Formatting changes
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks

### Pull Request Process
1. Create feature branch from `develop`
2. Implement changes and test locally
3. Create PR against `develop`
4. Pass CI checks and code review
5. Merge to `develop`

## 11. Security Practices

### Authentication
- Use Supabase Auth for all authentication flows
- Implement role-based access control (RBAC)
- Session timeouts and refresh token rotation

### Data Protection
- Row-Level Security (RLS) policies in database
- Encrypted sensitive data
- Regular security audits

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration

## 12. Compliance Requirements

### Data Privacy
- GDPR compliance for EU users
- CCPA compliance for California users
- Data deletion mechanism
- Privacy policy and terms of service

### Financial Compliance
- Payment processing regulatory compliance
- Tax reporting documentation
- Invoice generation and record keeping
