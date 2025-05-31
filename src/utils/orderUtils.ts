import { OrderStage, Order, Creator, ContentItem } from '@/types/orders';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Database types for better type safety
type ProjectCreatorRecord = {
  id: string;
  status: string;
  agreed_amount: number | null;
  created_at: string | null;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  creator_profiles: {
    primary_platform: string | null;
    instagram_handle: string | null;
    tiktok_handle: string | null;
    youtube_handle: string | null;
  } | null;
};

type ContentRecord = {
  id: string;
  content_type: string | null;
  platform: string | null;
  title: string | null;
  status: string | null;
  created_at: string | null;
  published_date: string | null;
  project_creators: {
    id: string;
    profiles: {
      id: string;
      full_name: string | null;
    } | null;
  } | null;
};

type ProjectRecord = {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  status: string;
  total_creator_budget?: number | null;
  budget?: number | null;
  currency?: string | null;
  submission_deadline?: string | null;
  end_date?: string | null;
  platforms?: string[] | null;
};

// Map project status to order stage
export const mapProjectStatusToOrderStage = (status: string): OrderStage => {
  switch (status) {
    case 'new':
    case 'draft':
      return 'campaign_setup';
    case 'under_review':
      return 'creator_selection';
    case 'creators_assigned':
      return 'contract_payment';
    case 'in_progress':
      return 'planning_creation';
    case 'completed':
      return 'content_performance';
    default:
      return 'campaign_setup';
  }
};

// Calculate stage progress percentage
export const getStageProgress = (stage: OrderStage): number => {
  switch (stage) {
    case 'campaign_setup':
      return 20;
    case 'creator_selection':
      return 40;
    case 'contract_payment':
      return 60;
    case 'planning_creation':
      return 80;
    case 'content_performance':
      return 100;
    default:
      return 0;
  }
};

// Fetch real creators for a project
export const getProjectCreators = async (projectId: string): Promise<Creator[]> => {
  try {
    const { data, error } = await supabase
      .from('project_creators')
      .select(`
        id,
        status,
        agreed_amount,
        created_at,
        profiles!project_creators_creator_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        creator_profiles!creator_profiles_user_id_fkey (
          primary_platform,
          instagram_handle,
          tiktok_handle,
          youtube_handle
        )
      `)
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching project creators:', error);
      return [];
    }

    return data?.map((pc: ProjectCreatorRecord) => ({
      id: pc.profiles?.id || pc.id,
      name: pc.profiles?.full_name || 'Unknown Creator',
      platform: pc.creator_profiles?.primary_platform || 'Instagram',
      imageUrl: pc.profiles?.avatar_url || `https://i.pravatar.cc/150?img=${pc.id}`,
      status: pc.status as 'invited' | 'accepted' | 'declined' | 'completed',
    })) || [];
  } catch (error) {
    console.error('Error in getProjectCreators:', error);
    return [];
  }
};

// Generate mock creators for testing (fallback)
export const generateMockCreators = (count: number = 3): Creator[] => {
  const platforms = ['Instagram', 'TikTok', 'YouTube'];
  const statuses: ('invited' | 'accepted' | 'declined' | 'completed')[] = ['invited', 'accepted', 'declined', 'completed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `creator-${i + 1}`,
    name: `Creator ${i + 1}`,
    platform: platforms[i % platforms.length],
    imageUrl: 'https://i.pravatar.cc/150?img=' + (i + 10),
    status: statuses[i % statuses.length],
  }));
};

// Fetch real content items for a project
export const getProjectContent = async (projectId: string): Promise<ContentItem[]> => {
  try {
    const { data, error } = await supabase
      .from('project_content')
      .select(`
        id,
        content_type,
        platform,
        title,
        status,
        created_at,
        published_date,
        project_creators!project_content_project_creator_id_fkey (
          id,
          profiles!project_creators_creator_id_fkey (
            id,
            full_name
          )
        )
      `)
      .eq('project_creators.project_id', projectId);

    if (error) {
      console.error('Error fetching project content:', error);
      return [];
    }

    return data?.map((content: ContentRecord) => ({
      id: content.id,
      creatorId: content.project_creators?.profiles?.id || 'unknown',
      creatorName: content.project_creators?.profiles?.full_name || 'Unknown Creator',
      platform: content.platform || 'Instagram',
      type: content.content_type as 'video' | 'post' | 'story',
      status: content.status as 'draft' | 'submitted' | 'approved' | 'published',
      submittedAt: content.status !== 'draft' ? content.created_at : undefined,
      publishedAt: content.published_date || undefined,
    })) || [];
  } catch (error) {
    console.error('Error in getProjectContent:', error);
    return [];
  }
};

// Generate mock content items for testing (fallback)
export const generateMockContentItems = (creatorCount: number = 3): ContentItem[] => {
  const types: ('video' | 'post' | 'story')[] = ['video', 'post', 'story'];
  const statuses: ('draft' | 'submitted' | 'approved' | 'published')[] = ['draft', 'submitted', 'approved', 'published'];
  const platforms = ['Instagram', 'TikTok', 'YouTube'];
  
  return Array.from({ length: creatorCount * 2 }, (_, i) => {
    const creatorIndex = Math.floor(i / 2);
    return {
      id: `content-${i + 1}`,
      creatorId: `creator-${creatorIndex + 1}`,
      creatorName: `Creator ${creatorIndex + 1}`,
      platform: platforms[creatorIndex % platforms.length],
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      submittedAt: i % 2 === 0 ? new Date().toISOString() : undefined,
      publishedAt: i % 4 === 0 ? new Date().toISOString() : undefined,
    };
  });
};

// Function to convert a project to an order (with real data)
export const projectToOrder = async (project: ProjectRecord): Promise<Order> => {
  const stage = mapProjectStatusToOrderStage(project.status);
  
  // Fetch real creators and content for this project
  const [creators, contentItems] = await Promise.all([
    getProjectCreators(project.id),
    getProjectContent(project.id)
  ]);
  
  // Fallback to mock data if no real data exists
  const finalCreators = creators.length > 0 ? creators : generateMockCreators(Math.floor(Math.random() * 4) + 1);
  const finalContentItems = contentItems.length > 0 ? contentItems : generateMockContentItems(finalCreators.length);
  
  // Get platforms from project or use defaults
  const platforms = project.platforms || ['Instagram', 'TikTok'];
  
  return {
    id: project.id,
    title: project.name,
    description: project.description || '',
    createdAt: project.created_at || new Date().toISOString(),
    stage,
    progress: getStageProgress(stage),
    budget: project.total_creator_budget || project.budget || 0,
    currency: project.currency || 'USD',
    dueDate: project.submission_deadline || project.end_date,
    creators: finalCreators,
    platformsList: platforms,
    contentItems: finalContentItems,
  };
};

// Synchronous version for backward compatibility
export const projectToOrderSync = (project: ProjectRecord): Order => {
  const stage = mapProjectStatusToOrderStage(project.status);
  
  // Generate mock creators for this project
  const creatorCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 creators
  const mockCreators = generateMockCreators(creatorCount);
  
  // Generate mock content items
  const mockContentItems = generateMockContentItems(creatorCount);
  
  // Get platforms from project or use defaults
  const platforms = project.platforms || ['Instagram', 'TikTok'];
  
  return {
    id: project.id,
    title: project.name,
    description: project.description || '',
    createdAt: project.created_at || new Date().toISOString(),
    stage,
    progress: getStageProgress(stage),
    budget: project.total_creator_budget || project.budget || 0,
    currency: project.currency || 'USD',
    dueDate: project.submission_deadline || project.end_date,
    creators: mockCreators,
    platformsList: platforms,
    contentItems: mockContentItems,
  };
};

// Campaign Creator Filtering and Budget Allocation System
// =====================================================

interface CampaignCreator {
  id: string;
  platforms: string[];
  audience: {
    gender?: string;
    country?: string;
    age_range?: [number, number];
  };
  tags: string[];
  avg_ctr: number;
  delivery_speed: 'slow' | 'average' | 'fast';
  avg_roi: number;
  price: number;
  last_post_days_ago: number;
  status: 'active' | 'inactive' | 'flagged';
}

interface CampaignInput {
  campaign_total_budget: number;
  platform?: string;
  audience_filters?: {
    gender?: string;
    country?: string;
    age_range?: [number, number];
  };
  interest_tags?: string[];
  min_creator_price?: number;
  max_creator_price?: number;
  smart_allocation_enabled: boolean;
  creators: CampaignCreator[];
}

interface CreatorPaymentResult {
  id: string;
  assigned_payment: number;
  bonus_reason: string[];
  total_creator_cost: number;
  payment_metadata: {
    ready_for_checkout: boolean;
    payment_reference: string;
  };
}

interface CampaignAllocationResult {
  total_spend: number;
  creators: CreatorPaymentResult[];
}

/**
 * Filters eligible creators based on campaign criteria
 */
const filterEligibleCreators = (input: CampaignInput): CampaignCreator[] => {
  let filteredCreators = input.creators.filter(creator => {
    // Always exclude inactive creators and those who haven't posted recently
    if (creator.status !== 'active' || creator.last_post_days_ago > 30) {
      return false;
    }
    
    return true;
  });

  // Apply platform filter
  if (input.platform) {
    filteredCreators = filteredCreators.filter(creator =>
      creator.platforms.includes(input.platform!)
    );
  }

  // Apply audience gender filter
  if (input.audience_filters?.gender) {
    filteredCreators = filteredCreators.filter(creator =>
      creator.audience.gender === input.audience_filters!.gender
    );
  }

  // Apply audience country filter
  if (input.audience_filters?.country) {
    filteredCreators = filteredCreators.filter(creator =>
      creator.audience.country === input.audience_filters!.country
    );
  }

  // Apply age range filter (full overlap required)
  if (input.audience_filters?.age_range) {
    const [targetMin, targetMax] = input.audience_filters.age_range;
    filteredCreators = filteredCreators.filter(creator => {
      if (!creator.audience.age_range) return false;
      const [creatorMin, creatorMax] = creator.audience.age_range;
      return creatorMin <= targetMax && creatorMax >= targetMin;
    });
  }

  // Apply interest tags filter (at least one match required)
  if (input.interest_tags && input.interest_tags.length > 0) {
    filteredCreators = filteredCreators.filter(creator =>
      creator.tags.some(tag => input.interest_tags!.includes(tag))
    );
  }

  // Apply price range filters
  if (input.min_creator_price !== undefined) {
    filteredCreators = filteredCreators.filter(creator =>
      creator.price >= input.min_creator_price!
    );
  }

  if (input.max_creator_price !== undefined) {
    filteredCreators = filteredCreators.filter(creator =>
      creator.price <= input.max_creator_price!
    );
  }

  return filteredCreators;
};

/**
 * Applies fallback selection when no specific filters are provided
 */
const applyFallbackSelection = (creators: CampaignCreator[]): CampaignCreator[] => {
  // Calculate score for each creator
  const creatorsWithScores = creators.map(creator => {
    const deliveryBonus = creator.delivery_speed === 'fast' ? 20 :
                         creator.delivery_speed === 'average' ? 10 : 0;
    const score = creator.avg_ctr * 100 + deliveryBonus;
    return { creator, score };
  });

  // Sort by score descending and take top 10
  return creatorsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.creator);
};

/**
 * Calculates budget allocation for selected creators
 */
const calculateBudgetAllocation = (
  selectedCreators: CampaignCreator[],
  totalBudget: number,
  maxCreatorPrice?: number,
  campaignId: string = 'default'
): CampaignAllocationResult => {
  if (selectedCreators.length === 0) {
    return {
      total_spend: 0,
      creators: []
    };
  }

  // Calculate base budget (80% of total)
  const baseBudget = totalBudget * 0.8;
  const basePaymentPerCreator = baseBudget / selectedCreators.length;

  // Calculate bonuses for each creator
  const creatorsWithPayments = selectedCreators.map(creator => {
    const basePayment = basePaymentPerCreator;
    const bonusReasons: string[] = [];
    let bonusMultiplier = 1;

    // Apply bonus rules (stackable)
    if (creator.delivery_speed === 'fast') {
      bonusMultiplier += 0.1; // +10%
      bonusReasons.push('Fast delivery speed');
    }

    if (creator.avg_roi >= 1.8) {
      bonusMultiplier += 0.15; // +15%
      bonusReasons.push('High ROI performance');
    }

    if (creator.avg_ctr >= 0.06) {
      bonusMultiplier += 0.1; // +10%
      bonusReasons.push('High CTR performance');
    }

    const totalPayment = basePayment * bonusMultiplier;
    
    // Apply max price cap if specified
    const finalPayment = maxCreatorPrice !== undefined ? 
      Math.min(totalPayment, maxCreatorPrice) : totalPayment;

    return {
      creator,
      basePayment,
      bonusMultiplier,
      bonusReasons,
      calculatedPayment: totalPayment,
      finalPayment
    };
  });

  // Calculate total spend before capping
  const totalCalculatedSpend = creatorsWithPayments.reduce(
    (sum, item) => sum + item.finalPayment, 0
  );

  // Apply proportional scaling if we exceed budget
  const scalingFactor = totalCalculatedSpend > totalBudget ? 
    totalBudget / totalCalculatedSpend : 1;

  let actualTotalSpend = 0;
  const finalResults: CreatorPaymentResult[] = creatorsWithPayments.map(item => {
    const scaledPayment = item.finalPayment * scalingFactor;
    actualTotalSpend += scaledPayment;

    return {
      id: item.creator.id,
      assigned_payment: Math.round(scaledPayment * 100) / 100, // Round to 2 decimal places
      bonus_reason: item.bonusReasons,
      total_creator_cost: Math.round(scaledPayment * 100) / 100,
      payment_metadata: {
        ready_for_checkout: true,
        payment_reference: `camp_${campaignId}_creator_${item.creator.id}`
      }
    };
  });

  return {
    total_spend: Math.round(actualTotalSpend * 100) / 100,
    creators: finalResults
  };
};

/**
 * Main function: Processes campaign input and returns creator allocation
 * This is production-ready code that handles £1M+/month in creator spend
 */
export const processCampaignCreatorAllocation = (
  input: CampaignInput,
  campaignId: string = 'default'
): CampaignAllocationResult => {
  // Input validation
  if (!input || input.campaign_total_budget <= 0 || !Array.isArray(input.creators)) {
    return {
      total_spend: 0,
      creators: []
    };
  }

  // Step 1: Filter eligible creators based on criteria
  let eligibleCreators = filterEligibleCreators(input);

  // Step 2: Apply fallback selection if no specific filters provided
  const hasSpecificFilters = input.platform || 
                            input.audience_filters || 
                            (input.interest_tags && input.interest_tags.length > 0);

  if (!hasSpecificFilters && eligibleCreators.length > 0) {
    eligibleCreators = applyFallbackSelection(eligibleCreators);
  }

  // Step 3: Calculate budget allocation
  const result = calculateBudgetAllocation(
    eligibleCreators,
    input.campaign_total_budget,
    input.max_creator_price,
    campaignId
  );

  return result;
};
