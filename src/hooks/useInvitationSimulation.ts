
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

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

const mockInvitations: MockInvitation[] = [
  {
    id: 'mock-inv-001',
    project_id: 'mock-proj-001',
    project_name: 'Summer Fashion Collection Launch',
    brand_name: 'StyleCo',
    brand_logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
    status: 'invited',
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
      objective: 'Drive brand awareness and summer collection sales through authentic creator content',
      timeline: '2-week campaign duration with flexible posting schedule',
      usage_rights: '6 months usage rights for paid advertising',
      exclusivity: false,
      deliverables: [
        '3 Instagram Reels showcasing outfits',
        '2 TikTok videos with styling tips',
        '1 Instagram story series'
      ]
    },
    invitation_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'We love your aesthetic and think you would be perfect for our summer campaign! Your style aligns perfectly with our brand values.'
  },
  {
    id: 'mock-inv-002',
    project_id: 'mock-proj-002',
    project_name: 'Tech Product Review Campaign',
    brand_name: 'TechNova',
    brand_logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center',
    status: 'invited',
    agreed_amount: 3200,
    currency: 'USD',
    content_requirements: {
      posts_count: 2,
      platforms: ['YouTube', 'Instagram'],
      hashtags: ['#TechReview', '#TechNovaPartner'],
      mentions: ['@technova']
    },
    campaign_details: {
      objective: 'Authentic product review and demonstration of our latest smartphone',
      timeline: '3-week campaign with specific posting dates provided',
      usage_rights: '12 months usage rights including website and social media',
      exclusivity: true,
      deliverables: [
        '1 YouTube review video (8-12 minutes)',
        '1 Instagram Reel unboxing',
        'Instagram story highlights'
      ]
    },
    invitation_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Exclusive partnership opportunity with our latest product line. We were impressed by your tech review content and would love to collaborate!'
  },
  {
    id: 'mock-inv-003',
    project_id: 'mock-proj-003',
    project_name: 'Wellness Brand Partnership',
    brand_name: 'PureWell',
    brand_logo: 'https://images.unsplash.com/photo-1544947958-a40e1ece9b95?w=100&h=100&fit=crop&crop=center',
    status: 'invited',
    agreed_amount: 1800,
    currency: 'USD',
    content_requirements: {
      posts_count: 4,
      platforms: ['Instagram', 'TikTok'],
      hashtags: ['#WellnessJourney', '#PureWellPartner'],
      mentions: ['@purewell_official']
    },
    campaign_details: {
      objective: 'Promote wellness lifestyle and product integration into daily routines',
      timeline: '4-week ongoing partnership with weekly check-ins',
      usage_rights: '3 months usage rights for social media only',
      exclusivity: false,
      deliverables: [
        '4 Instagram posts featuring products',
        '2 TikTok wellness routine videos',
        'Weekly story updates'
      ]
    },
    invitation_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Long-term partnership potential with monthly campaigns. Your wellness content resonates with our audience and we see great synergy!'
  }
];

export const useInvitationSimulation = () => {
  const { user } = useUnifiedAuth();
  const [invitations, setInvitations] = useState<MockInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load initial mock data and any stored state
    const loadInvitations = () => {
      const stored = localStorage.getItem('mock-invitations-state');
      if (stored) {
        try {
          const parsedStored = JSON.parse(stored);
          setInvitations(parsedStored);
        } catch (e) {
          console.error('Error parsing stored invitations:', e);
          setInvitations([...mockInvitations]);
        }
      } else {
        setInvitations([...mockInvitations]);
      }
      setIsLoading(false);
    };

    loadInvitations();
  }, []);

  // Save state to localStorage whenever invitations change
  useEffect(() => {
    if (invitations.length > 0) {
      localStorage.setItem('mock-invitations-state', JSON.stringify(invitations));
    }
  }, [invitations]);

  const createDatabaseRecords = async (invitation: MockInvitation) => {
    if (!user?.id) return;

    try {
      // First create a project record
      const { data: project, error: projectError } = await supabase
        .from('projects_new')
        .insert({
          name: invitation.project_name,
          brand_id: 'mock-brand-' + invitation.id, // Mock brand ID
          budget: invitation.agreed_amount,
          currency: invitation.currency,
          campaign_type: 'Single',
          status: 'active',
          platforms: invitation.content_requirements.platforms,
          deliverables: {
            requirements: invitation.campaign_details.deliverables,
            posts_count: invitation.content_requirements.posts_count
          },
          objective: invitation.campaign_details.objective,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          review_status: 'approved'
        })
        .select()
        .single();

      if (projectError) {
        console.error('Error creating project:', projectError);
        return;
      }

      // Then create a creator deal
      const { error: dealError } = await supabase
        .from('creator_deals')
        .insert({
          project_id: project.id,
          creator_id: user.id,
          deal_value: invitation.agreed_amount,
          status: 'accepted',
          payment_status: 'pending',
          individual_requirements: {
            platforms: invitation.content_requirements.platforms,
            posts_count: invitation.content_requirements.posts_count,
            deliverables: invitation.campaign_details.deliverables
          }
        });

      if (dealError) {
        console.error('Error creating deal:', dealError);
      }

      console.log('✅ Successfully created database records for accepted invitation');
    } catch (error) {
      console.error('Error creating database records:', error);
    }
  };

  const acceptInvitation = async (invitationId: string) => {
    setActionLoading(prev => ({ ...prev, [invitationId]: true }));
    
    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) return;

      // Update the invitation status
      const updatedInvitations = invitations.map(inv =>
        inv.id === invitationId
          ? { 
              ...inv, 
              status: 'accepted' as const, 
              response_date: new Date().toISOString() 
            }
          : inv
      );
      
      setInvitations(updatedInvitations);

      // Create database records for the accepted invitation
      await createDatabaseRecords({
        ...invitation,
        status: 'accepted',
        response_date: new Date().toISOString()
      });

      console.log(`✅ Accepted invitation: ${invitationId}`);
    } catch (error) {
      console.error('Error accepting invitation:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  const declineInvitation = async (invitationId: string) => {
    setActionLoading(prev => ({ ...prev, [invitationId]: true }));
    
    try {
      const updatedInvitations = invitations.map(inv =>
        inv.id === invitationId
          ? { 
              ...inv, 
              status: 'declined' as const, 
              response_date: new Date().toISOString() 
            }
          : inv
      );
      
      setInvitations(updatedInvitations);
      console.log(`❌ Declined invitation: ${invitationId}`);
    } catch (error) {
      console.error('Error declining invitation:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  console.log('🎯 useInvitationSimulation returning:', {
    invitations: invitations.length,
    isLoading,
    actionLoading: Object.keys(actionLoading).length
  });

  return {
    invitations,
    isLoading,
    actionLoading,
    acceptInvitation,
    declineInvitation
  };
};
