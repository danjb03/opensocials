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
        ]
      }
      creator_profiles: {
        Row: {
          access_token: string | null
          account_id: string
          bio: string | null
          connected_at: string | null
          created_at: string | null
          email: string | null
          engagement_metrics: Json | null
          expires_in: number | null
          id: string
          metadata: Json | null
          name: string | null
          platform: string | null
          profile_id: string | null
          refresh_token: string | null
          stats: Json | null
          status: string | null
          token_expires_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          access_token?: string | null
          account_id: string
          bio?: string | null
          connected_at?: string | null
          created_at?: string | null
          email?: string | null
          engagement_metrics?: Json | null
          expires_in?: number | null
          id?: string
          metadata?: Json | null
          name?: string | null
          platform?: string | null
          profile_id?: string | null
          refresh_token?: string | null
          stats?: Json | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          access_token?: string | null
          account_id?: string
          bio?: string | null
          connected_at?: string | null
          created_at?: string | null
          email?: string | null
          engagement_metrics?: Json | null
          expires_in?: number | null
          id?: string
          metadata?: Json | null
          name?: string | null
          platform?: string | null
          profile_id?: string | null
          refresh_token?: string | null
          stats?: Json | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "social_accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_crm_creators_view"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "social_accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
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
          display_name: string | null
          email: string | null
          engagement_rate: string | null
          first_name: string | null
          follower_count: string | null
          id: string
          industry: string | null
          instagram_connected: boolean | null
          is_complete: boolean | null
          is_profile_complete: boolean | null
          last_name: string | null
          linkedin_connected: boolean | null
          logo_url: string | null
          primary_platform: string | null
          profile_type: string | null
          role: string | null
          show_analytics: boolean | null
          show_instagram: boolean | null
          show_linkedin: boolean | null
          show_location: boolean | null
          show_tiktok: boolean | null
          show_youtube: boolean | null
          status: string | null
          tiktok_connected: boolean | null
          updated_at: string | null
          website: string | null
          youtube_connected: boolean | null
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
          display_name?: string | null
          email?: string | null
          engagement_rate?: string | null
          first_name?: string | null
          follower_count?: string | null
          id: string
          industry?: string | null
          instagram_connected?: boolean | null
          is_complete?: boolean | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          linkedin_connected?: boolean | null
          logo_url?: string | null
          primary_platform?: string | null
          profile_type?: string | null
          role?: string | null
          show_analytics?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          show_location?: boolean | null
          show_tiktok?: boolean | null
          show_youtube?: boolean | null
          status?: string | null
          tiktok_connected?: boolean | null
          updated_at?: string | null
          website?: string | null
          youtube_connected?: boolean | null
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
          display_name?: string | null
          email?: string | null
          engagement_rate?: string | null
          first_name?: string | null
          follower_count?: string | null
          id?: string
          industry?: string | null
          instagram_connected?: boolean | null
          is_complete?: boolean | null
          is_profile_complete?: boolean | null
          last_name?: string | null
          linkedin_connected?: boolean | null
          logo_url?: string | null
          primary_platform?: string | null
          profile_type?: string | null
          role?: string | null
          show_analytics?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          show_location?: boolean | null
          show_tiktok?: boolean | null
          show_youtube?: boolean | null
          status?: string | null
          tiktok_connected?: boolean | null
          updated_at?: string | null
          website?: string | null
          youtube_connected?: boolean | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "social_metrics_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          | { original_project_id: string }
          | {
              original_project_id: string
              new_start_date: string
              new_end_date: string
            }
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
    }
    Enums: {
      app_role: "creator" | "brand" | "admin" | "super_admin"
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
      app_role: ["creator", "brand", "admin", "super_admin"],
    },
  },
} as const
