# Required Edge Functions for Rolling Payment System

## 1. **invite-creators-to-project** (NEW)
**Purpose**: Invite specific creators to a specific campaign/project

```typescript
// Input
{
  project_id: string,
  creator_ids: string[],
  individual_budgets: { creator_id: string, amount: number }[],
  content_requirements: { creator_id: string, requirements: object }[]
}

// Logic
- Validate admin/brand owns the project
- Check project allows rolling invitations
- Create project_creators entries with status 'invited'
- Send invitation emails via existing send-email function
- Return invitation results
```

## 2. **accept-project-invitation** (NEW)
**Purpose**: Creator accepts invitation to specific campaign

```typescript
// Input
{
  project_id: string,
  creator_id: string,
  negotiated_amount?: number,
  notes?: string
}

// Logic
- Validate creator owns the profile
- Update project_creators status to 'accepted'
- Set response_date
- Update project allocated_budget
- Trigger payment eligibility check
- Send notification to brand
```

## 3. **process-creator-payment** (NEW)
**Purpose**: Process payment for individual creator milestone

```typescript
// Input
{
  project_creator_id: string,
  milestone: string,
  amount: number,
  payment_method: string
}

// Logic
- Validate brand owns the project
- Check creator has accepted invitation
- Validate payment amount against agreed amount
- Create project_creator_payments entry
- Integrate with payment provider (Stripe/PayPal)
- Update payment status
- Send payment confirmation
```

## 4. **get-project-payment-status** (NEW)
**Purpose**: Get comprehensive payment status for a project

```typescript
// Output
{
  project_id: string,
  total_creators: number,
  accepted_creators: number,
  total_budget_allocated: number,
  payments_completed: number,
  payments_pending: number,
  can_proceed_to_payment: boolean,
  creators: [
    {
      creator_id: string,
      name: string,
      status: string,
      agreed_amount: number,
      payments: [
        { milestone: string, amount: number, status: string }
      ]
    }
  ]
}
```

## 5. **update-project-creator-status** (NEW)
**Purpose**: Update creator progress within campaign

```typescript
// Input
{
  project_creator_id: string,
  new_status: 'contracted' | 'in_progress' | 'submitted' | 'completed',
  notes?: string
}

// Logic
- Validate permissions (brand or creator)
- Update status with timestamp
- Trigger milestone-based payments if applicable
- Send status update notifications
```

## 6. **add-creators-to-existing-project** (NEW)
**Purpose**: Add new creators to ongoing campaign

```typescript
// Input
{
  project_id: string,
  creator_ids: string[],
  individual_budgets: { creator_id: string, amount: number }[]
}

// Logic
- Validate project allows rolling invitations
- Check remaining budget
- Create new project_creators entries
- Send invitations
- Update project allocated_budget
```

## 7. **get-creator-project-details** (NEW)
**Purpose**: Creator views their project assignment details

```typescript
// Input
{
  project_id: string,
  creator_id: string
}

// Output
{
  project: { name, description, brand, deadlines },
  assignment: { status, agreed_amount, content_requirements },
  payments: [{ milestone, amount, status, date }],
  content_submissions: [{ type, status, submission_date }]
}
```

## 8. **submit-project-content** (NEW)
**Purpose**: Creator submits content for review

```typescript
// Input
{
  project_creator_id: string,
  content_type: string,
  platform: string,
  file_url: string,
  title: string,
  description?: string
}

// Logic
- Validate creator assignment
- Create project_content entry
- Update submitted_content_count
- Trigger review notification to brand
- Check if milestone payments should be triggered
```

## 9. **review-project-content** (NEW)
**Purpose**: Brand reviews and approves/rejects content

```typescript
// Input
{
  content_id: string,
  action: 'approve' | 'reject',
  notes?: string
}

// Logic
- Validate brand owns project
- Update content status
- Update approved_content_count if approved
- Trigger completion payments if all content approved
- Send notification to creator
```

## 10. **get-project-dashboard** (MODIFY EXISTING)
**Purpose**: Enhanced project dashboard with creator status

```typescript
// Add to existing get-brand-projects response
{
  projects: [
    {
      // existing project fields
      creator_summary: {
        total_invited: number,
        total_accepted: number,
        total_completed: number,
        payment_status: 'not_started' | 'partial' | 'completed'
      }
    }
  ]
}
```

## Functions to Modify

### **invite-and-create-profile** (MODIFY)
- Add project_id parameter
- Create project_creators entry when inviting to specific project

### **get-brand-projects** (MODIFY) 
- Include creator summary for each project
- Add payment status indicators

### **get-creator-dashboard** (NEW or modify existing)
- Show project invitations and assignments
- Show payment status per project
- Show content submission requirements

## Security Considerations

1. **RLS Policies**: Already defined in migration
2. **Input Validation**: Validate UUIDs, amounts, statuses
3. **Permission Checks**: Ensure users can only access their own data
4. **Rate Limiting**: Prevent spam invitations
5. **Payment Security**: Validate payment amounts and methods
6. **Audit Logging**: Log all payment and status changes

## Integration Points

1. **Email System**: Use existing send-email function
2. **Payment Providers**: Integrate with Stripe/PayPal
3. **File Storage**: Use existing storage for content uploads
4. **Notifications**: Real-time updates for status changes
5. **Analytics**: Track acceptance rates, payment timelines