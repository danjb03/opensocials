export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agency_users: {
        Row: {
          agency_id: string
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      brand_creator_connections: {
        Row: {
          brand_id: string
          created_at: string | null
          creator_id: string
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          creator_id: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "fk_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "fk_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "fk_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "fk_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_creator_favorites: {
        Row: {
          brand_id: string
          created_at: string
          creator_id: string
          id: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          creator_id: string
          id?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          creator_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_brand_creator_favorites_brand"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      brand_profiles: {
        Row: {
          brand_bio: string | null
          brand_goal: string | null
          budget_range: string | null
          campaign_focus: string[] | null
          company_name: string | null
          created_at: string | null
          feature_flags: Json | null
          industry: string | null
          logo_url: string | null
          r4_spend_grade: string | null
          updated_at: string | null
          user_id: string
          version: number | null
          website_url: string | null
        }
        Insert: {
          brand_bio?: string | null
          brand_goal?: string | null
          budget_range?: string | null
          campaign_focus?: string[] | null
          company_name?: string | null
          created_at?: string | null
          feature_flags?: Json | null
          industry?: string | null
          logo_url?: string | null
          r4_spend_grade?: string | null
          updated_at?: string | null
          user_id: string
          version?: number | null
          website_url?: string | null
        }
        Update: {
          brand_bio?: string | null
          brand_goal?: string | null
          budget_range?: string | null
          campaign_focus?: string[] | null
          company_name?: string | null
          created_at?: string | null
          feature_flags?: Json | null
          industry?: string | null
          logo_url?: string | null
          r4_spend_grade?: string | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      campaign_content: {
        Row: {
          campaign_id: string
          content_type: string
          created_at: string | null
          creator_id: string
          description: string | null
          feedback: string | null
          id: string
          platform: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          content_type: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          feedback?: string | null
          id?: string
          platform: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          content_type?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          feedback?: string | null
          id?: string
          platform?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_content_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_content_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "slim_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_content_files: {
        Row: {
          content_id: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          file_url: string
          id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_content_files_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "campaign_content"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_reviews: {
        Row: {
          ai_analysis: Json | null
          ai_decision: string | null
          ai_issues: Json | null
          ai_recommendations: Json | null
          ai_score: number | null
          created_at: string | null
          human_decision: string | null
          id: string
          project_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          updated_at: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_decision?: string | null
          ai_issues?: Json | null
          ai_recommendations?: Json | null
          ai_score?: number | null
          created_at?: string | null
          human_decision?: string | null
          id?: string
          project_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_decision?: string | null
          ai_issues?: Json | null
          ai_recommendations?: Json | null
          ai_score?: number | null
          created_at?: string | null
          human_decision?: string | null
          id?: string
          project_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "campaign_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "campaign_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_rule_violations: {
        Row: {
          auto_detected: boolean | null
          campaign_review_id: string
          created_at: string | null
          description: string | null
          id: string
          rule_id: string | null
          rule_name: string
          severity: string | null
          violation_type: string
        }
        Insert: {
          auto_detected?: boolean | null
          campaign_review_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          rule_id?: string | null
          rule_name: string
          severity?: string | null
          violation_type: string
        }
        Update: {
          auto_detected?: boolean | null
          campaign_review_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          rule_id?: string | null
          rule_name?: string
          severity?: string | null
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_rule_violations_campaign_review_id_fkey"
            columns: ["campaign_review_id"]
            isOneToOne: false
            referencedRelation: "campaign_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_rule_violations_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "r4_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      connected_accounts: {
        Row: {
          account_id: string
          connected_at: string | null
          id: string
          platform: string
          user_id: string
          workplatform_id: string
        }
        Insert: {
          account_id: string
          connected_at?: string | null
          id?: string
          platform: string
          user_id: string
          workplatform_id: string
        }
        Update: {
          account_id?: string
          connected_at?: string | null
          id?: string
          platform?: string
          user_id?: string
          workplatform_id?: string
        }
        Relationships: []
      }
      creator_deals: {
        Row: {
          created_at: string
          creator_feedback: string | null
          creator_id: string
          deal_value: number
          id: string
          individual_requirements: Json | null
          invited_at: string
          paid_at: string | null
          payment_status: string
          project_id: string
          responded_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_feedback?: string | null
          creator_id: string
          deal_value: number
          id?: string
          individual_requirements?: Json | null
          invited_at?: string
          paid_at?: string | null
          payment_status?: string
          project_id: string
          responded_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_feedback?: string | null
          creator_id?: string
          deal_value?: number
          id?: string
          individual_requirements?: Json | null
          invited_at?: string
          paid_at?: string | null
          payment_status?: string
          project_id?: string
          responded_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_deals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "creator_deals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "slim_creator_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "creator_deals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_new"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_industries: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      creator_industry_tags: {
        Row: {
          creator_id: string | null
          id: string
          industry_id: string | null
        }
        Insert: {
          creator_id?: string | null
          id?: string
          industry_id?: string | null
        }
        Update: {
          creator_id?: string | null
          id?: string
          industry_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_industry_tags_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "creator_industry_tags_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "creator_industry_tags_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_industry_tags_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "creator_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_creator_industry_tags_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "fk_creator_industry_tags_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "fk_creator_industry_tags_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_creator_industry_tags_industry"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "creator_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          audience_location: Json | null
          audience_size: number | null
          audience_type: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          content_type: string | null
          content_types: string[] | null
          created_at: string | null
          creator_type: string | null
          engagement_rate: number | null
          first_name: string | null
          follower_count: number | null
          id: string
          industries: string[] | null
          is_profile_complete: boolean | null
          last_name: string | null
          platforms: string[] | null
          primary_platform: string | null
          social_connections: Json | null
          social_handles: Json | null
          updated_at: string | null
          user_id: string
          username: string | null
          visibility_settings: Json | null
        }
        Insert: {
          audience_location?: Json | null
          audience_size?: number | null
          audience_type?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          content_type?: string | null
          content_types?: string[] | null
          created_at?: string | null
          creator_type?: string | null
          engagement_rate?: number | null
          first_name?: string | null
          follower_count?: number | null
          id?: string
          industries?: string[] | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          platforms?: string[] | null
          primary_platform?: string | null
          social_connections?: Json | null
          social_handles?: Json | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          visibility_settings?: Json | null
        }
        Update: {
          audience_location?: Json | null
          audience_size?: number | null
          audience_type?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          content_type?: string | null
          content_types?: string[] | null
          created_at?: string | null
          creator_type?: string | null
          engagement_rate?: number | null
          first_name?: string | null
          follower_count?: number | null
          id?: string
          industries?: string[] | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          platforms?: string[] | null
          primary_platform?: string | null
          social_connections?: Json | null
          social_handles?: Json | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          visibility_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_types: {
        Row: {
          description: string | null
          id: string
          slug: string
          type_name: string
        }
        Insert: {
          description?: string | null
          id?: string
          slug: string
          type_name: string
        }
        Update: {
          description?: string | null
          id?: string
          slug?: string
          type_name?: string
        }
        Relationships: []
      }
      deal_earnings: {
        Row: {
          amount: number
          creator_id: string
          deal_id: string
          earned_at: string | null
          id: string
        }
        Insert: {
          amount: number
          creator_id: string
          deal_id: string
          earned_at?: string | null
          id?: string
        }
        Update: {
          amount?: number
          creator_id?: string
          deal_id?: string
          earned_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_earnings_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          brand_id: string
          campaign_type: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          feedback: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
          value: number
        }
        Insert: {
          brand_id: string
          campaign_type?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          feedback?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string | null
          value: number
        }
        Update: {
          brand_id?: string
          campaign_type?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          feedback?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      deauth_logs: {
        Row: {
          account_id: string
          created_at: string
          error_message: string | null
          id: string
          platform: string
          status: string
        }
        Insert: {
          account_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          platform: string
          status: string
        }
        Update: {
          account_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          platform?: string
          status?: string
        }
        Relationships: []
      }
      interest_registrations: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone_number: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone_number?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone_number?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      invite_logs: {
        Row: {
          email: string
          error_message: string | null
          id: string
          role: string
          sent_at: string | null
          status: string
          triggered_by: string | null
        }
        Insert: {
          email: string
          error_message?: string | null
          id?: string
          role: string
          sent_at?: string | null
          status?: string
          triggered_by?: string | null
        }
        Update: {
          email?: string
          error_message?: string | null
          id?: string
          role?: string
          sent_at?: string | null
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      pricing_floors: {
        Row: {
          campaign_type: string
          created_at: string | null
          id: string
          min_price: number
          tier: string
          updated_at: string | null
        }
        Insert: {
          campaign_type: string
          created_at?: string | null
          id?: string
          min_price: number
          tier: string
          updated_at?: string | null
        }
        Update: {
          campaign_type?: string
          created_at?: string | null
          id?: string
          min_price?: number
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          audience_location: Json | null
          audience_type: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          brand_bio: string | null
          brand_goal: string | null
          budget_range: string | null
          company_name: string | null
          content_type: string | null
          created_at: string | null
          creator_tier: string | null
          creator_type: string | null
          display_name: string | null
          email: string | null
          engagement_rate: string | null
          feature_flags: Json | null
          first_name: string | null
          flagged: boolean | null
          follower_count: string | null
          has_seen_creator_intro: boolean | null
          has_seen_intro: boolean | null
          id: string
          industries: string[] | null
          industry: string | null
          instagram_connected: boolean | null
          instagram_handle: string | null
          is_complete: boolean | null
          is_profile_complete: boolean | null
          last_name: string | null
          linkedin_connected: boolean | null
          logo_url: string | null
          name: string | null
          primary_platform: string | null
          profile_type: string | null
          r4_recommendations: Json | null
          r4_score: number | null
          role: string | null
          show_analytics: boolean | null
          show_instagram: boolean | null
          show_linkedin: boolean | null
          show_location: boolean | null
          show_tiktok: boolean | null
          show_youtube: boolean | null
          status: string | null
          tiktok_connected: boolean | null
          tiktok_handle: string | null
          updated_at: string | null
          version: number | null
          website: string | null
          youtube_connected: boolean | null
          youtube_handle: string | null
        }
        Insert: {
          audience_location?: Json | null
          audience_type?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          brand_bio?: string | null
          brand_goal?: string | null
          budget_range?: string | null
          company_name?: string | null
          content_type?: string | null
          created_at?: string | null
          creator_tier?: string | null
          creator_type?: string | null
          display_name?: string | null
          email?: string | null
          engagement_rate?: string | null
          feature_flags?: Json | null
          first_name?: string | null
          flagged?: boolean | null
          follower_count?: string | null
          has_seen_creator_intro?: boolean | null
          has_seen_intro?: boolean | null
          id: string
          industries?: string[] | null
          industry?: string | null
          instagram_connected?: boolean | null
          instagram_handle?: string | null
          is_complete?: boolean | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          linkedin_connected?: boolean | null
          logo_url?: string | null
          name?: string | null
          primary_platform?: string | null
          profile_type?: string | null
          r4_recommendations?: Json | null
          r4_score?: number | null
          role?: string | null
          show_analytics?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          show_location?: boolean | null
          show_tiktok?: boolean | null
          show_youtube?: boolean | null
          status?: string | null
          tiktok_connected?: boolean | null
          tiktok_handle?: string | null
          updated_at?: string | null
          version?: number | null
          website?: string | null
          youtube_connected?: boolean | null
          youtube_handle?: string | null
        }
        Update: {
          audience_location?: Json | null
          audience_type?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          brand_bio?: string | null
          brand_goal?: string | null
          budget_range?: string | null
          company_name?: string | null
          content_type?: string | null
          created_at?: string | null
          creator_tier?: string | null
          creator_type?: string | null
          display_name?: string | null
          email?: string | null
          engagement_rate?: string | null
          feature_flags?: Json | null
          first_name?: string | null
          flagged?: boolean | null
          follower_count?: string | null
          has_seen_creator_intro?: boolean | null
          has_seen_intro?: boolean | null
          id?: string
          industries?: string[] | null
          industry?: string | null
          instagram_connected?: boolean | null
          instagram_handle?: string | null
          is_complete?: boolean | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          linkedin_connected?: boolean | null
          logo_url?: string | null
          name?: string | null
          primary_platform?: string | null
          profile_type?: string | null
          r4_recommendations?: Json | null
          r4_score?: number | null
          role?: string | null
          show_analytics?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          show_location?: boolean | null
          show_tiktok?: boolean | null
          show_youtube?: boolean | null
          status?: string | null
          tiktok_connected?: boolean | null
          tiktok_handle?: string | null
          updated_at?: string | null
          version?: number | null
          website?: string | null
          youtube_connected?: boolean | null
          youtube_handle?: string | null
        }
        Relationships: []
      }
      project_creators: {
        Row: {
          agreed_amount: number | null
          approved_content_count: number | null
          content_requirements: Json | null
          contract_signed_date: string | null
          created_at: string | null
          creator_id: string | null
          currency: string | null
          id: string
          invitation_date: string | null
          notes: string | null
          payment_structure: Json | null
          project_id: string | null
          response_date: string | null
          status: string | null
          submitted_content_count: number | null
          updated_at: string | null
        }
        Insert: {
          agreed_amount?: number | null
          approved_content_count?: number | null
          content_requirements?: Json | null
          contract_signed_date?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          id?: string
          invitation_date?: string | null
          notes?: string | null
          payment_structure?: Json | null
          project_id?: string | null
          response_date?: string | null
          status?: string | null
          submitted_content_count?: number | null
          updated_at?: string | null
        }
        Update: {
          agreed_amount?: number | null
          approved_content_count?: number | null
          content_requirements?: Json | null
          contract_signed_date?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          id?: string
          invitation_date?: string | null
          notes?: string | null
          payment_structure?: Json | null
          project_id?: string | null
          response_date?: string | null
          status?: string | null
          submitted_content_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "project_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "project_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_creators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_creators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "slim_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_drafts: {
        Row: {
          brand_id: string | null
          created_at: string | null
          current_step: number | null
          draft_data: Json | null
          id: string
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          current_step?: number | null
          draft_data?: Json | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          current_step?: number | null
          draft_data?: Json | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_drafts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "project_drafts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "project_drafts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          audience_focus: string | null
          brand_id: string | null
          budget: number | null
          campaign_objective: string | null
          campaign_type: string
          content_requirements: Json | null
          created_at: string | null
          currency: string | null
          description: string | null
          draft_approval: boolean | null
          end_date: string
          exclusivity: string | null
          id: string
          is_priority: boolean | null
          is_template: boolean | null
          name: string
          payment_structure: string | null
          platforms: string[] | null
          start_date: string
          status: string | null
          submission_deadline: string | null
          usage_duration: string | null
          whitelisting: boolean | null
        }
        Insert: {
          audience_focus?: string | null
          brand_id?: string | null
          budget?: number | null
          campaign_objective?: string | null
          campaign_type: string
          content_requirements?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          draft_approval?: boolean | null
          end_date: string
          exclusivity?: string | null
          id?: string
          is_priority?: boolean | null
          is_template?: boolean | null
          name: string
          payment_structure?: string | null
          platforms?: string[] | null
          start_date: string
          status?: string | null
          submission_deadline?: string | null
          usage_duration?: string | null
          whitelisting?: boolean | null
        }
        Update: {
          audience_focus?: string | null
          brand_id?: string | null
          budget?: number | null
          campaign_objective?: string | null
          campaign_type?: string
          content_requirements?: Json | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          draft_approval?: boolean | null
          end_date?: string
          exclusivity?: string | null
          id?: string
          is_priority?: boolean | null
          is_template?: boolean | null
          name?: string
          payment_structure?: string | null
          platforms?: string[] | null
          start_date?: string
          status?: string | null
          submission_deadline?: string | null
          usage_duration?: string | null
          whitelisting?: boolean | null
        }
        Relationships: []
      }
      projects_new: {
        Row: {
          brand_id: string | null
          budget: number | null
          campaign_type: string | null
          content_requirements: Json | null
          created_at: string | null
          currency: string | null
          current_step: number | null
          deliverables: Json | null
          description: string | null
          end_date: string | null
          id: string
          messaging_guidelines: string | null
          name: string
          objective: string | null
          platforms: string[] | null
          review_priority: string | null
          review_status: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          budget?: number | null
          campaign_type?: string | null
          content_requirements?: Json | null
          created_at?: string | null
          currency?: string | null
          current_step?: number | null
          deliverables?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          messaging_guidelines?: string | null
          name: string
          objective?: string | null
          platforms?: string[] | null
          review_priority?: string | null
          review_status?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          budget?: number | null
          campaign_type?: string | null
          content_requirements?: Json | null
          created_at?: string | null
          currency?: string | null
          current_step?: number | null
          deliverables?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          messaging_guidelines?: string | null
          name?: string
          objective?: string | null
          platforms?: string[] | null
          review_priority?: string | null
          review_status?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_new_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "projects_new_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "projects_new_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      r4_enforcement_logs: {
        Row: {
          action_taken: Json | null
          context: Json | null
          id: string
          rule_id: string | null
          target_id: string
          target_type: string
          triggered_at: string | null
        }
        Insert: {
          action_taken?: Json | null
          context?: Json | null
          id?: string
          rule_id?: string | null
          target_id: string
          target_type: string
          triggered_at?: string | null
        }
        Update: {
          action_taken?: Json | null
          context?: Json | null
          id?: string
          rule_id?: string | null
          target_id?: string
          target_type?: string
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r4_enforcement_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "r4_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      r4_flags: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: boolean | null
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value?: boolean | null
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: boolean | null
        }
        Relationships: []
      }
      r4_rule_sandbox: {
        Row: {
          created_at: string | null
          id: string
          rule_action: Json
          rule_condition: Json
          rule_description: string | null
          rule_name: string
          test_result: Json | null
          tested_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rule_action: Json
          rule_condition: Json
          rule_description?: string | null
          rule_name: string
          test_result?: Json | null
          tested_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rule_action?: Json
          rule_condition?: Json
          rule_description?: string | null
          rule_name?: string
          test_result?: Json | null
          tested_at?: string | null
        }
        Relationships: []
      }
      r4_rules: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          priority: number | null
          rule_action: Json
          rule_condition: Json
          rule_description: string | null
          rule_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          priority?: number | null
          rule_action: Json
          rule_condition: Json
          rule_description?: string | null
          rule_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          priority?: number | null
          rule_action?: Json
          rule_condition?: Json
          rule_description?: string | null
          rule_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          count: number
          created_at: string | null
          id: string
          identifier: string
          window_start: string
        }
        Insert: {
          action: string
          count?: number
          created_at?: string | null
          id?: string
          identifier: string
          window_start: string
        }
        Update: {
          action?: string
          count?: number
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_metrics: {
        Row: {
          data: Json
          fetched_at: string | null
          id: string
          social_account_id: string | null
        }
        Insert: {
          data: Json
          fetched_at?: string | null
          id?: string
          social_account_id?: string | null
        }
        Update: {
          data?: Json
          fetched_at?: string | null
          id?: string
          social_account_id?: string | null
        }
        Relationships: []
      }
      social_profiles: {
        Row: {
          creator_id: string | null
          engagement_rate: number | null
          error_message: string | null
          follower_count: number | null
          id: string
          last_synced: string | null
          platform: string
          status: string | null
          username: string
        }
        Insert: {
          creator_id?: string | null
          engagement_rate?: number | null
          error_message?: string | null
          follower_count?: number | null
          id?: string
          last_synced?: string | null
          platform: string
          status?: string | null
          username: string
        }
        Update: {
          creator_id?: string | null
          engagement_rate?: number | null
          error_message?: string | null
          follower_count?: number | null
          id?: string
          last_synced?: string | null
          platform?: string
          status?: string | null
          username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_crm_brands_view: {
        Row: {
          active_deals: number | null
          brand_id: string | null
          budget_range: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          industry: string | null
          last_active_at: string | null
          status: string | null
          total_deals: number | null
        }
        Relationships: []
      }
      admin_crm_creators_view: {
        Row: {
          active_deals: number | null
          created_at: string | null
          creator_id: string | null
          email: string | null
          engagement_rate: string | null
          first_name: string | null
          follower_count: string | null
          last_active_at: string | null
          last_name: string | null
          primary_platform: string | null
          status: string | null
          total_deals: number | null
        }
        Relationships: []
      }
      creator_deal_view: {
        Row: {
          created_at: string | null
          creator_feedback: string | null
          creator_id: string | null
          deal_value: number | null
          id: string | null
          individual_requirements: Json | null
          invited_at: string | null
          paid_at: string | null
          payment_status: string | null
          project_id: string | null
          responded_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_feedback?: string | null
          creator_id?: string | null
          deal_value?: number | null
          id?: string | null
          individual_requirements?: Json | null
          invited_at?: string | null
          paid_at?: string | null
          payment_status?: string | null
          project_id?: string | null
          responded_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_feedback?: string | null
          creator_id?: string | null
          deal_value?: number | null
          id?: string | null
          individual_requirements?: Json | null
          invited_at?: string | null
          paid_at?: string | null
          payment_status?: string | null
          project_id?: string | null
          responded_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_deals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "creator_deals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "slim_creator_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "creator_deals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_new"
            referencedColumns: ["id"]
          },
        ]
      }
      slim_creator_profiles: {
        Row: {
          audience_location: Json | null
          avatar_url: string | null
          engagement_rate: number | null
          first_name: string | null
          follower_count: number | null
          id: string | null
          industries: string[] | null
          is_profile_complete: boolean | null
          last_name: string | null
          primary_platform: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          audience_location?: Json | null
          avatar_url?: string | null
          engagement_rate?: number | null
          first_name?: string | null
          follower_count?: number | null
          id?: string | null
          industries?: string[] | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          primary_platform?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          audience_location?: Json | null
          avatar_url?: string | null
          engagement_rate?: number | null
          first_name?: string | null
          follower_count?: number | null
          id?: string | null
          industries?: string[] | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          primary_platform?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      slim_projects: {
        Row: {
          brand_id: string | null
          budget: number | null
          campaign_type: string | null
          currency: string | null
          end_date: string | null
          id: string | null
          is_priority: boolean | null
          name: string | null
          platforms: string[] | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          brand_id?: string | null
          budget?: number | null
          campaign_type?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string | null
          is_priority?: boolean | null
          name?: string | null
          platforms?: string[] | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          brand_id?: string | null
          budget?: number | null
          campaign_type?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string | null
          is_priority?: boolean | null
          name?: string | null
          platforms?: string[] | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      tier_averages: {
        Row: {
          average_offer: number | null
          campaign_type: string | null
          creator_tier: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_user_role: {
        Args: { user_id: string; role_type: string }
        Returns: undefined
      }
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      duplicate_project: {
        Args:
          | Record<PropertyKey, never>
          | { original_project_id: string }
          | {
              original_project_id: string
              new_start_date: string
              new_end_date: string
            }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_agency: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_agency_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_belongs_to_agency: {
        Args: { user_id: string; agency_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "creator" | "brand" | "admin" | "super_admin" | "agency"
      content_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "published"
        | "archived"
      project_creator_status:
        | "invited"
        | "accepted"
        | "declined"
        | "contracted"
        | "in_progress"
        | "submitted"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["creator", "brand", "admin", "super_admin", "agency"],
      content_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "published",
        "archived",
      ],
      project_creator_status: [
        "invited",
        "accepted",
        "declined",
        "contracted",
        "in_progress",
        "submitted",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
