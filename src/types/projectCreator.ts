
export interface ProjectCreatorInvitation {
  id: string;
  projectId: string;
  creatorId: string;
  status: 'invited' | 'accepted' | 'declined' | 'contracted' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
  agreedAmount?: number;
  currency: string;
  paymentStructure?: any;
  contentRequirements?: any;
  invitationDate: string;
  responseDate?: string;
  contractSignedDate?: string;
  submittedContentCount: number;
  approvedContentCount: number;
  notes?: string;
  creatorProfile?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    primaryPlatform?: string;
  };
}
