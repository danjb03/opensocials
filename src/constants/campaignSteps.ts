
import { CampaignStep } from '@/types/project';

// Campaign progress steps
export const CAMPAIGN_STEPS: CampaignStep[] = [
  { id: 'create', label: 'Campaign Created', icon: 'FileText' },
  { id: 'talent', label: 'Talent Matchmaking', icon: 'Users' },
  { id: 'planning', label: 'Creative Planning', icon: 'Flag' },
  { id: 'content', label: 'Content Creation', icon: 'Calendar' },
  { id: 'live', label: 'Campaign Live', icon: 'Globe' },
  { id: 'reporting', label: 'Performance Reporting', icon: 'BarChart2' },
];

// Map project status to campaign step
export const statusStepMap: Record<string, number> = {
  'draft': 1,
  'new': 1,
  'under_review': 2,
  'awaiting_approval': 3,
  'creators_assigned': 3,
  'in_progress': 4,
  'completed': 6
};

// Map step to project status
export const stepStatusMap: Record<number, string> = {
  1: 'new',
  2: 'under_review',
  3: 'awaiting_approval',
  4: 'creators_assigned', 
  5: 'in_progress',
  6: 'completed'
};
