
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

export interface MockInvitation {
  id: string;
  project_id: string;
  project_name: string;
  brand_name: string;
  brand_logo?: string;
  status: 'invited' | 'accepted' | 'declined';
  agreed_amount: number;
  currency: string;
  content_requirements: {
    posts_count: number;
    video_length?: string;
    platforms: string[];
    hashtags?: string[];
    mentions?: string[];
  };
  campaign_details: {
    objective: string;
    timeline: string;
    usage_rights: string;
    exclusivity: boolean;
    deliverables: string[];
  };
  invitation_date: string;
  response_date?: string;
  notes?: string;
}

export const useInvitationSimulation = () => {
  const { user, creatorProfile } = useUnifiedAuth();
  const [invitations, setInvitations] = useState<MockInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Generate mock invitations
  const generateMockInvitations = (): MockInvitation[] => {
    const mockData = [
      {
        id: 'inv-001',
        project_id: 'proj-001',
        project_name: 'Summer Fashion Collection Launch',
        brand_name: 'StyleCo',
        brand_logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
        status: 'invited' as const,
        agreed_amount: 2500,
        currency: 'USD',
        content_requirements: {
          posts_count: 3,
          video_length: '30-60 seconds',
          platforms: ['Instagram', 'TikTok'],
          hashtags: ['#SummerStyle', '#StyleCoPartner'],
          mentions: ['@styleco_official']
        },
        campaign_details: {
          objective: 'Drive brand awareness and summer collection sales',
          timeline: '2-week campaign duration',
          usage_rights: '6 months usage rights for ads',
          exclusivity: false,
          deliverables: ['3 Instagram Reels', '2 TikTok videos', '1 story series']
        },
        invitation_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'We love your aesthetic and think you\'d be perfect for our summer campaign!'
      },
      {
        id: 'inv-002',
        project_id: 'proj-002',
        project_name: 'Tech Product Review Campaign',
        brand_name: 'TechNova',
        brand_logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center',
        status: 'invited' as const,
        agreed_amount: 3200,
        currency: 'USD',
        content_requirements: {
          posts_count: 2,
          platforms: ['YouTube', 'Instagram'],
          hashtags: ['#TechReview', '#TechNovaPartner'],
          mentions: ['@technova']
        },
        campaign_details: {
          objective: 'Authentic product review and demonstration',
          timeline: '3-week campaign with specific posting dates',
          usage_rights: '12 months usage rights',
          exclusivity: true,
          deliverables: ['1 YouTube review video', '1 Instagram Reel', 'Story highlights']
        },
        invitation_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Exclusive partnership opportunity with our latest product line.'
      },
      {
        id: 'inv-003',
        project_id: 'proj-003',
        project_name: 'Wellness Brand Partnership',
        brand_name: 'PureWell',
        brand_logo: 'https://images.unsplash.com/photo-1544947958-a40e1ece9b95?w=100&h=100&fit=crop&crop=center',
        status: 'invited' as const,
        agreed_amount: 1800,
        currency: 'USD',
        content_requirements: {
          posts_count: 4,
          platforms: ['Instagram', 'TikTok'],
          hashtags: ['#WellnessJourney', '#PureWellPartner'],
          mentions: ['@purewell_official']
        },
        campaign_details: {
          objective: 'Promote wellness lifestyle and product integration',
          timeline: '4-week ongoing partnership',
          usage_rights: '3 months usage rights',
          exclusivity: false,
          deliverables: ['4 Instagram posts', '2 TikTok videos', 'Weekly stories']
        },
        invitation_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Long-term partnership potential with monthly campaigns.'
      }
    ];

    return mockData;
  };

  useEffect(() => {
    if (user && creatorProfile) {
      // Simulate loading delay
      setTimeout(() => {
        setInvitations(generateMockInvitations());
        setIsLoading(false);
      }, 1000);
    }
  }, [user, creatorProfile]);

  const acceptInvitation = async (invitationId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [invitationId]: true }));

      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) throw new Error('Invitation not found');

      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create campaign entry
      const { error: campaignError } = await supabase
        .from('projects_new')
        .insert({
          id: invitation.project_id,
          name: invitation.project_name,
          brand_id: user?.id, // In real system, this would be the actual brand ID
          status: 'active',
          budget: invitation.agreed_amount,
          currency: invitation.currency,
          platforms: invitation.content_requirements.platforms,
          brief_data: {
            objective: invitation.campaign_details.objective,
            deliverables: invitation.campaign_details.deliverables,
            content_requirements: invitation.content_requirements
          },
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

      if (campaignError) console.warn('Campaign creation error:', campaignError);

      // Create deal entry
      const { error: dealError } = await supabase
        .from('creator_deals')
        .insert({
          id: `deal-${invitationId}`,
          project_id: invitation.project_id,
          creator_id: user?.id,
          deal_value: invitation.agreed_amount,
          status: 'accepted',
          individual_requirements: invitation.content_requirements,
          responded_at: new Date().toISOString()
        });

      if (dealError) console.warn('Deal creation error:', dealError);

      // Update invitation status
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { 
                ...inv, 
                status: 'accepted' as const, 
                response_date: new Date().toISOString() 
              }
            : inv
        )
      );

      toast.success('Campaign accepted successfully!', {
        description: `${invitation.project_name} is now active in your dashboard.`
      });

    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation', {
        description: 'Please try again.'
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  const declineInvitation = async (invitationId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [invitationId]: true }));

      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) throw new Error('Invitation not found');

      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update invitation status
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { 
                ...inv, 
                status: 'declined' as const, 
                response_date: new Date().toISOString() 
              }
            : inv
        )
      );

      toast.success('Invitation declined', {
        description: `You have declined the ${invitation.project_name} campaign.`
      });

    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error('Failed to decline invitation', {
        description: 'Please try again.'
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  return {
    invitations,
    isLoading,
    actionLoading,
    acceptInvitation,
    declineInvitation
  };
};
