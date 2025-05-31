export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      brand_profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      creator_deals: {
        Row: {
          created_at: string | null
          creator_feedback: string | null
          creator_id: string | null
          gross_value: number | null
          id: string
          individual_requirements: Json | null
          invited_at: string | null
          net_value: number | null
          paid_at: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          project_id: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["deal_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_feedback?: string | null
          creator_id?: string | null
          gross_value?: number | null
          id?: string
          individual_requirements?: Json | null
          invited_at?: string | null
          net_value?: number | null
          paid_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          project_id?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["deal_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_feedback?: string | null
          creator_id?: string | null
          gross_value?: number | null
          id?: string
          individual_requirements?: Json | null
          invited_at?: string | null
          net_value?: number | null
          paid_at?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          project_id?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["deal_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_deals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
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
      creator_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_content: {
        Row: {
          comments: number | null
          content_type: string | null
          created_at: string | null
          description: string | null
          engagement_rate: number | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          likes: number | null
          platform: string | null
          project_creator_id: string | null
          published_date: string | null
          published_url: string | null
          review_date: string | null
          review_notes: string | null
          reviewer_id: string | null
          shares: number | null
          status: Database["public"]["Enums"]["content_status"] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          comments?: number | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          engagement_rate?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          likes?: number | null
          platform?: string | null
          project_creator_id?: string | null
          published_date?: string | null
          published_url?: string | null
          review_date?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          shares?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          comments?: number | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          engagement_rate?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          likes?: number | null
          platform?: string | null
          project_creator_id?: string | null
          published_date?: string | null
          published_url?: string | null
          review_date?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          shares?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_content_project_creator_id_fkey"
            columns: ["project_creator_id"]
            isOneToOne: false
            referencedRelation: "project_creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_content_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_creator_payments: {
        Row: {
          amount: number
          completed_date: string | null
          created_at: string | null
          currency: string | null
          id: string
          milestone: string | null
          payment_method: string | null
          payment_provider_id: string | null
          payment_provider_status: string | null
          processed_date: string | null
          project_creator_id: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          completed_date?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          milestone?: string | null
          payment_method?: string | null
          payment_provider_id?: string | null
          payment_provider_status?: string | null
          processed_date?: string | null
          project_creator_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          completed_date?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          milestone?: string | null
          payment_method?: string | null
          payment_provider_id?: string | null
          payment_provider_status?: string | null
          processed_date?: string | null
          project_creator_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_creator_payments_project_creator_id_fkey"
            columns: ["project_creator_id"]
            isOneToOne: false
            referencedRelation: "project_creators"
            referencedColumns: ["id"]
          },
        ]
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
          status: Database["public"]["Enums"]["project_creator_status"] | null
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
          status?: Database["public"]["Enums"]["project_creator_status"] | null
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
          status?: Database["public"]["Enums"]["project_creator_status"] | null
          submitted_content_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
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
            referencedRelation: "projects_new"
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
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_new: {
        Row: {
          allocated_budget: number | null
          allows_rolling_invitations: boolean | null
          brand_id: string | null
          campaign_type: string | null
          content_requirements: Json | null
          created_at: string | null
          current_step: number | null
          deliverables: Json | null
          description: string | null
          end_date: string | null
          id: string
          messaging_guidelines: string | null
          name: string
          objective: Database["public"]["Enums"]["campaign_objective"] | null
          payment_terms: Json | null
          platforms: string[] | null
          remaining_budget: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          total_budget: number | null
          total_creator_budget: number | null
          updated_at: string | null
        }
        Insert: {
          allocated_budget?: number | null
          allows_rolling_invitations?: boolean | null
          brand_id?: string | null
          campaign_type?: string | null
          content_requirements?: Json | null
          created_at?: string | null
          current_step?: number | null
          deliverables?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          messaging_guidelines?: string | null
          name: string
          objective?: Database["public"]["Enums"]["campaign_objective"] | null
          payment_terms?: Json | null
          platforms?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          total_budget?: number | null
          total_creator_budget?: number | null
          updated_at?: string | null
        }
        Update: {
          allocated_budget?: number | null
          allows_rolling_invitations?: boolean | null
          brand_id?: string | null
          campaign_type?: string | null
          content_requirements?: Json | null
          created_at?: string | null
          current_step?: number | null
          deliverables?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          messaging_guidelines?: string | null
          name?: string
          objective?: Database["public"]["Enums"]["campaign_objective"] | null
          payment_terms?: Json | null
          platforms?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          total_budget?: number | null
          total_creator_budget?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_new_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
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
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          project_id: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["deal_status"] | null
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
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          project_id?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["deal_status"] | null
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
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          project_id?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["deal_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_deals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
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
    }
    Functions: {
      send_email: {
        Args: { to_email: string; email_subject: string; email_content: string }
        Returns: boolean
      }
    }
    Enums: {
      campaign_objective:
        | "brand_awareness"
        | "product_launch"
        | "sales_drive"
        | "engagement"
        | "conversions"
      content_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "published"
        | "archived"
      deal_status:
        | "pending"
        | "invited"
        | "accepted"
        | "declined"
        | "completed"
        | "cancelled"
      payment_status: "pending" | "processing" | "paid" | "failed" | "completed" | "cancelled"
      project_creator_status:
        | "invited"
        | "accepted"
        | "declined"
        | "contracted"
        | "in_progress"
        | "submitted"
        | "completed"
        | "cancelled"
      project_status: "draft" | "active" | "paused" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; name: string; owner: string; metadata: Json }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_legacy_v1: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v1_optimised: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v2: {
        Args: {
          prefix: string
          bucket_name: string
          limits?: number
          levels?: number
          start_after?: string
        }
        Returns: {
          key: string
          name: string
          id: string
          updated_at: string
          created_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      campaign_objective: [
        "brand_awareness",
        "product_launch",
        "sales_drive",
        "engagement",
        "conversions",
      ],
      content_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "published",
        "archived",
      ],
      deal_status: [
        "pending",
        "invited",
        "accepted",
        "declined",
        "completed",
        "cancelled",
      ],
      payment_status: ["pending", "processing", "paid", "failed", "completed", "cancelled"],
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
      project_status: ["draft", "active", "paused", "completed", "cancelled"],
    },
  },
  storage: {
    Enums: {},
  },
} as const

