
import { Project } from '@/types/projects';
import { Order } from '@/types/orders';
import { projectToOrderSync } from '@/utils/orderUtils';

export const useProjectTransforms = (projects: Project[]) => {
  // Transform projects to orders for pipeline view
  const orders: Order[] = projects.map(project => projectToOrderSync(project));

  // Transform projects to campaign rows for dashboard
  const campaignRows = projects.map((project) => ({
    project_id: project.id,
    project_name: project.name,
    project_status: project.status,
    start_date: project.start_date || null,
    end_date: project.end_date || null,
    budget: project.budget,
    currency: project.currency,
    deal_id: null,
    deal_status: null,
    deal_value: null,
    creator_name: null,
    avatar_url: null,
    engagement_rate: null,
    primary_platform: null
  }));

  return {
    orders,
    campaignRows
  };
};
