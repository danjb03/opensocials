
export type ProjectFormValues = {
  name: string;
  campaign_type: "single" | "weekly" | "monthly" | "retainer";
  start_date: Date;
  end_date: Date;
  budget: string;
  currency: "USD" | "GBP" | "EUR";
  content_requirements: {
    videos?: { quantity: number };
    stories?: { quantity: number };
    posts?: { quantity: number };
  };
  platforms: string[];
  creative_guidelines?: File[];
  usage_duration: "3_months" | "12_months" | "perpetual";
  whitelisting: boolean;
  exclusivity?: string;
  audience_focus?: string;
  campaign_objective: "awareness" | "engagement" | "conversions";
  draft_approval: boolean;
  submission_deadline?: Date;
  payment_structure: "upfront" | "50_50" | "on_delivery";
  description?: string;
};

export interface ContentRequirements {
  videos?: { quantity: number };
  stories?: { quantity: number };
  posts?: { quantity: number };
  brief_uploaded?: boolean;
  brief_files?: string[];
  [key: string]: unknown; // Add index signature to make it compatible with Json type
}

// Add CampaignStep type to fix the error
export type CampaignStep = {
  id: string;
  label: string;
  icon: "FileText" | "Users" | "Flag" | "Calendar" | "Globe" | "BarChart2";
};
