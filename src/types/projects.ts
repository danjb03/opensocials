
export type Project = {
  id: string;
  name: string;
  campaign_type: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  platforms: string[];
  status: string;
  is_priority: boolean;
};

export type ProjectStatus = 'new' | 'under_review' | 'awaiting_approval' | 'creators_assigned' | 'in_progress' | 'completed';

export const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'awaiting_approval', label: 'Awaiting Approval' },
  { value: 'creators_assigned', label: 'Creators Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

export const statusColors: Record<ProjectStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  under_review: 'bg-purple-100 text-purple-800',
  awaiting_approval: 'bg-yellow-100 text-yellow-800',
  creators_assigned: 'bg-green-100 text-green-800',
  in_progress: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-gray-100 text-gray-800'
};

export const campaignTypeOptions = [
  'Single',
  'Weekly',
  'Monthly',
  '12-Month Retainer',
  'Evergreen'
];
