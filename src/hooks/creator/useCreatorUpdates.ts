
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

interface CreatorUpdate {
  id: string;
  type: 'payment' | 'approval' | 'deadline' | 'invitation' | 'content_feedback';
  title: string;
  description: string;
  time: string;
  badge: string;
  project_name?: string;
  project_id?: string;
}

export const useCreatorUpdates = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-updates', user?.id],
    queryFn: async (): Promise<CreatorUpdate[]> => {
      if (!user?.id) return [];

      const updates: CreatorUpdate[] = [];

      // Get recent project invitations with project details
      const { data: invitations } = await supabase
        .from('project_creators')
        .select(`
          id,
          status,
          invitation_date,
          response_date,
          project_id
        `)
        .eq('creator_id', user.id)
        .order('invitation_date', { ascending: false })
        .limit(3);

      if (invitations) {
        // Get project details separately
        const projectIds = invitations.map(inv => inv.project_id).filter(Boolean);
        
        let projectsData: any[] = [];
        if (projectIds.length > 0) {
          // Try projects_new first, then fallback to projects
          const { data: newProjects } = await supabase
            .from('projects_new')
            .select('id, name')
            .in('id', projectIds);
          
          if (newProjects && newProjects.length > 0) {
            projectsData = newProjects;
          } else {
            const { data: oldProjects } = await supabase
              .from('projects')
              .select('id, name')
              .in('id', projectIds);
            
            if (oldProjects) {
              projectsData = oldProjects;
            }
          }
        }

        invitations.forEach((invitation) => {
          const project = projectsData.find(p => p.id === invitation.project_id);
          const projectName = project?.name || 'Unknown Project';

          if (invitation.status === 'invited') {
            updates.push({
              id: `invitation-${invitation.id}`,
              type: 'invitation',
              title: 'New campaign invitation',
              description: `You've been invited to "${projectName}" campaign.`,
              time: new Date(invitation.invitation_date).toLocaleDateString(),
              badge: 'Invitation',
              project_name: projectName,
              project_id: invitation.project_id
            });
          } else if (invitation.status === 'accepted' && invitation.response_date) {
            updates.push({
              id: `accepted-${invitation.id}`,
              type: 'approval',
              title: 'Campaign accepted',
              description: `You accepted the "${projectName}" campaign invitation.`,
              time: new Date(invitation.response_date).toLocaleDateString(),
              badge: 'Accepted',
              project_name: projectName,
              project_id: invitation.project_id
            });
          }
        });
      }

      // Get recent campaign notifications
      const { data: notifications } = await supabase
        .from('campaign_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notifications) {
        notifications.forEach((notification) => {
          let type: CreatorUpdate['type'] = 'approval';
          if (notification.notification_type.includes('payment')) type = 'payment';
          if (notification.notification_type.includes('deadline')) type = 'deadline';
          if (notification.notification_type.includes('feedback')) type = 'content_feedback';

          updates.push({
            id: `notification-${notification.id}`,
            type,
            title: notification.title,
            description: notification.message,
            time: new Date(notification.created_at).toLocaleDateString(),
            badge: notification.notification_type.charAt(0).toUpperCase() + notification.notification_type.slice(1)
          });
        });
      }

      // Sort all updates by most recent first
      return updates
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
    },
    enabled: !!user?.id,
  });
};
