# Frontend Refactoring Plan for Rolling Payment System

## Current Issues to Fix

### 1. **Remove Mock Data Dependencies**
**Current Problem**: `orderUtils.ts` generates fake creator data
**Fix Required**: Replace with real database queries

### 2. **Add Campaign-Creator Management UI**
**Current Gap**: No interface to assign creators to campaigns
**Required Components**: Creator selection during campaign creation

### 3. **Add Rolling Payment Interface**
**Current Gap**: No per-creator payment tracking
**Required Components**: Individual creator payment management

---

## Required Component Changes

### 1. **Campaign Creation Flow** (MODIFY EXISTING)

#### **src/components/brand/ProjectForm.tsx**
```typescript
// Add creator selection step
interface ProjectFormValues {
  // existing fields...
  invited_creators?: {
    creator_id: string;
    agreed_amount: number;
    content_requirements: object;
  }[];
}

// Add CreatorSelectionStep component
const CreatorSelectionStep = () => {
  // Creator search and selection
  // Individual budget allocation
  // Content requirements per creator
};
```

#### **src/pages/brand/Projects.tsx**
```typescript
// Add creator assignment after project creation
const handleProjectCreation = async (projectData) => {
  // 1. Create project
  const project = await createProject(projectData);
  
  // 2. Invite selected creators
  if (projectData.invited_creators?.length) {
    await inviteCreatorsToProject({
      project_id: project.id,
      creator_invitations: projectData.invited_creators
    });
  }
};
```

### 2. **Creator Management Components** (NEW)

#### **src/components/brand/creator-management/CreatorInvitationPanel.tsx**
```typescript
interface CreatorInvitationPanelProps {
  project_id: string;
  existing_creators: ProjectCreator[];
  onInviteCreators: (creators: CreatorInvitation[]) => void;
}

// Features:
// - Search creators
// - Set individual budgets
// - Set content requirements
// - Send invitations
// - View invitation status
```

#### **src/components/brand/creator-management/CreatorStatusTable.tsx**
```typescript
interface CreatorStatusTableProps {
  project_id: string;
  creators: ProjectCreator[];
}

// Features:
// - Show creator invitation status
// - Display agreed amounts
// - Show payment status
// - Action buttons (pay, remove, etc.)
```

### 3. **Payment Management Components** (NEW)

#### **src/components/brand/payments/RollingPaymentManager.tsx**
```typescript
interface RollingPaymentManagerProps {
  project_id: string;
  creators: ProjectCreator[];
}

// Features:
// - Per-creator payment status
// - Milestone-based payments
// - Payment processing buttons
// - Payment history
// - Total budget tracking
```

#### **src/components/brand/payments/CreatorPaymentCard.tsx**
```typescript
interface CreatorPaymentCardProps {
  project_creator: ProjectCreator;
  payment_history: Payment[];
  onProcessPayment: (milestone: string, amount: number) => void;
}

// Features:
// - Creator details
// - Payment milestones
// - "Pay Now" buttons (only if creator accepted)
// - Payment status indicators
// - Payment history timeline
```

### 4. **Campaign Status Updates** (MODIFY EXISTING)

#### **src/components/brand/orders/CampaignDetail.tsx**
```typescript
// Replace mock creator data with real data
const { data: projectCreators } = useQuery({
  queryKey: ['project-creators', project_id],
  queryFn: () => getProjectCreators(project_id)
});

// Add real payment status
const { data: paymentStatus } = useQuery({
  queryKey: ['project-payment-status', project_id],
  queryFn: () => getProjectPaymentStatus(project_id)
});
```

#### **src/components/brand/orders/CampaignStageNav.tsx**
```typescript
// Update stage progression logic
const canProceedToPayment = paymentStatus?.can_proceed_to_payment;
const hasAcceptedCreators = paymentStatus?.accepted_creators > 0;

// Gate "Contract & Payment" stage
<StageButton 
  disabled={!hasAcceptedCreators}
  stage="contract_payment"
>
  Contract & Payment
</StageButton>
```

### 5. **Creator Dashboard Updates** (MODIFY EXISTING)

#### **src/pages/creator/Campaigns.tsx**
```typescript
// Replace mock campaign data with real project assignments
const { data: projectAssignments } = useQuery({
  queryKey: ['creator-project-assignments', creator_id],
  queryFn: () => getCreatorProjectAssignments(creator_id)
});
```

#### **src/components/creator/invitations/ProjectInvitationCard.tsx** (NEW)
```typescript
interface ProjectInvitationCardProps {
  project_invitation: ProjectCreator;
  onAccept: () => void;
  onDecline: () => void;
}

// Features:
// - Project details
// - Agreed amount
// - Content requirements
// - Accept/Decline buttons
// - Payment milestone preview
```

---

## Required Hook Changes

### 1. **useProjectCreators** (NEW)
```typescript
export const useProjectCreators = (project_id: string) => {
  return useQuery({
    queryKey: ['project-creators', project_id],
    queryFn: () => supabase.functions.invoke('get-project-creators', {
      body: { project_id }
    })
  });
};
```

### 2. **useProjectPaymentStatus** (NEW)
```typescript
export const useProjectPaymentStatus = (project_id: string) => {
  return useQuery({
    queryKey: ['project-payment-status', project_id],
    queryFn: () => supabase.functions.invoke('get-project-payment-status', {
      body: { project_id }
    })
  });
};
```

### 3. **useCreatorInvitations** (MODIFY EXISTING)
```typescript
// Change from brand-creator connections to project-specific invitations
export const useCreatorInvitations = (creator_id: string) => {
  return useQuery({
    queryKey: ['creator-project-invitations', creator_id],
    queryFn: () => supabase.functions.invoke('get-creator-project-invitations', {
      body: { creator_id }
    })
  });
};
```

### 4. **usePaymentActions** (NEW)
```typescript
export const usePaymentActions = () => {
  const queryClient = useQueryClient();
  
  const processPayment = useMutation({
    mutationFn: (payment_data) => 
      supabase.functions.invoke('process-creator-payment', {
        body: payment_data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['project-payment-status']);
    }
  });
  
  return { processPayment };
};
```

---

## UI Flow Changes

### 1. **Campaign Creation Flow**
```
Step 1: Campaign Details (existing)
Step 2: Creator Selection (NEW)
  - Search creators
  - Set individual budgets  
  - Set content requirements per creator
Step 3: Review & Create (modified)
  - Show selected creators
  - Show total allocated budget
  - Send invitations on creation
```

### 2. **Campaign Management Flow**
```
Campaign Dashboard → Creator Management Tab (NEW)
  ├─ Invited Creators Table
  │  ├─ Status (invited/accepted/declined)
  │  ├─ Agreed Amount
  │  └─ Actions (pay/remove)
  ├─ Add More Creators Button
  └─ Payment Management Panel
     ├─ Per-Creator Payment Cards
     ├─ Milestone Tracking
     └─ Total Budget Overview
```

### 3. **Creator Dashboard Flow**
```
Creator Dashboard → Project Invitations (NEW)
  ├─ Pending Invitations
  │  ├─ Project Details
  │  ├─ Payment Offer
  │  └─ Accept/Decline Buttons
  ├─ Active Projects
  │  ├─ Progress Tracking
  │  ├─ Content Requirements
  │  └─ Payment Status
  └─ Completed Projects
```

---

## Critical UI Rules to Implement

### 1. **Payment Gating Logic**
```typescript
// Only show "Proceed to Payment" if at least one creator accepted
const PaymentButton = ({ project_id }) => {
  const { data: paymentStatus } = useProjectPaymentStatus(project_id);
  
  return (
    <Button 
      disabled={!paymentStatus?.can_proceed_to_payment}
      onClick={handlePayment}
    >
      {paymentStatus?.accepted_creators > 0 
        ? `Pay ${paymentStatus.accepted_creators} Creator(s)`
        : 'Waiting for Creator Acceptance'
      }
    </Button>
  );
};
```

### 2. **Rolling Payment Interface**
```typescript
// Show individual creator payment cards
const CreatorPaymentCards = ({ creators }) => {
  return creators.map(creator => (
    <CreatorPaymentCard 
      key={creator.id}
      creator={creator}
      canPay={creator.status === 'accepted'}
      paymentHistory={creator.payments}
      onPay={(milestone, amount) => processPayment({
        project_creator_id: creator.id,
        milestone,
        amount
      })}
    />
  ));
};
```

### 3. **Dynamic Creator Addition**
```typescript
// Allow adding creators to existing campaigns
const AddCreatorsButton = ({ project_id }) => {
  const [showCreatorSearch, setShowCreatorSearch] = useState(false);
  
  return (
    <>
      <Button onClick={() => setShowCreatorSearch(true)}>
        Add More Creators
      </Button>
      <CreatorSearchModal 
        isOpen={showCreatorSearch}
        onInvite={(creators) => inviteCreatorsToProject(project_id, creators)}
      />
    </>
  );
};
```

---

## Performance Considerations

1. **Real-time Updates**: Use Supabase real-time subscriptions for payment status
2. **Optimistic Updates**: Update UI immediately for better UX
3. **Caching**: Cache creator lists and payment status
4. **Pagination**: For projects with many creators
5. **Loading States**: Show proper loading indicators during payments

## Testing Strategy

1. **Unit Tests**: Test payment gating logic
2. **Integration Tests**: Test creator invitation flow
3. **E2E Tests**: Test complete campaign creation and payment flow
4. **Payment Testing**: Use payment provider test environments