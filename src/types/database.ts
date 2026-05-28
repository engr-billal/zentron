export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brand_profiles: {
        Row: {
          billing_country: string | null
          company_name: string
          created_at: string
          default_audience_bands: Database["public"]["Enums"]["audience_size_band"][]
          default_niches: string[]
          default_platforms: string[]
          id: string
          industry: string | null
          logo_url: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          team_size: Database["public"]["Enums"]["team_size"] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          billing_country?: string | null
          company_name: string
          created_at?: string
          default_audience_bands?: Database["public"]["Enums"]["audience_size_band"][]
          default_niches?: string[]
          default_platforms?: string[]
          id: string
          industry?: string | null
          logo_url?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          team_size?: Database["public"]["Enums"]["team_size"] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          billing_country?: string | null
          company_name?: string
          created_at?: string
          default_audience_bands?: Database["public"]["Enums"]["audience_size_band"][]
          default_niches?: string[]
          default_platforms?: string[]
          id?: string
          industry?: string | null
          logo_url?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          team_size?: Database["public"]["Enums"]["team_size"] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brief_invitations: {
        Row: {
          brief_id: string
          created_at: string
          creator_id: string
          invited_at: string
          match_score: number
          responded_at: string | null
          status: Database["public"]["Enums"]["invitation_status"]
          updated_at: string
        }
        Insert: {
          brief_id: string
          created_at?: string
          creator_id: string
          invited_at?: string
          match_score: number
          responded_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Update: {
          brief_id?: string
          created_at?: string
          creator_id?: string
          invited_at?: string
          match_score?: number
          responded_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brief_invitations_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brief_invitations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      briefs: {
        Row: {
          brand_id: string
          budget_max_cents: number | null
          budget_min_cents: number | null
          created_at: string
          currency: string | null
          deliverables: Json
          exclusivity: string | null
          id: string
          niche: string | null
          objective: string | null
          platforms: string[]
          status: Database["public"]["Enums"]["brief_status"]
          target_audience: Json
          title: string
          updated_at: string
          usage_rights: string | null
        }
        Insert: {
          brand_id: string
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          created_at?: string
          currency?: string | null
          deliverables?: Json
          exclusivity?: string | null
          id?: string
          niche?: string | null
          objective?: string | null
          platforms?: string[]
          status?: Database["public"]["Enums"]["brief_status"]
          target_audience?: Json
          title: string
          updated_at?: string
          usage_rights?: string | null
        }
        Update: {
          brand_id?: string
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          created_at?: string
          currency?: string | null
          deliverables?: Json
          exclusivity?: string | null
          id?: string
          niche?: string | null
          objective?: string | null
          platforms?: string[]
          status?: Database["public"]["Enums"]["brief_status"]
          target_audience?: Json
          title?: string
          updated_at?: string
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          brand_id: string
          brief_id: string
          cancelled_at: string | null
          cancelled_reason: string | null
          created_at: string
          creator_id: string
          currency: string
          end_date: string | null
          exclusivity: string | null
          id: string
          scope: string
          signed_brand_at: string | null
          signed_creator_at: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"]
          title: string
          total_fee_cents: number
          updated_at: string
          usage_rights: string | null
        }
        Insert: {
          brand_id: string
          brief_id: string
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string
          creator_id: string
          currency?: string
          end_date?: string | null
          exclusivity?: string | null
          id?: string
          scope: string
          signed_brand_at?: string | null
          signed_creator_at?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          title: string
          total_fee_cents: number
          updated_at?: string
          usage_rights?: string | null
        }
        Update: {
          brand_id?: string
          brief_id?: string
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string
          creator_id?: string
          currency?: string
          end_date?: string | null
          exclusivity?: string | null
          id?: string
          scope?: string
          signed_brand_at?: string | null
          signed_creator_at?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          title?: string
          total_fee_cents?: number
          updated_at?: string
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_platforms: {
        Row: {
          audience_health_score: number
          avg_engagement_rate: number
          created_at: string
          creator_id: string
          followers: number
          handle: string
          id: string
          platform: Database["public"]["Enums"]["creator_platform_type"]
          updated_at: string
          verified: boolean
        }
        Insert: {
          audience_health_score?: number
          avg_engagement_rate?: number
          created_at?: string
          creator_id: string
          followers?: number
          handle: string
          id?: string
          platform: Database["public"]["Enums"]["creator_platform_type"]
          updated_at?: string
          verified?: boolean
        }
        Update: {
          audience_health_score?: number
          avg_engagement_rate?: number
          created_at?: string
          creator_id?: string
          followers?: number
          handle?: string
          id?: string
          platform?: Database["public"]["Enums"]["creator_platform_type"]
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "creator_platforms_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          base_rate_cents: number | null
          bio: string | null
          created_at: string
          currency: string | null
          handle: string
          id: string
          languages: string[]
          niches: string[]
          primary_platform: Database["public"]["Enums"]["creator_platform_type"]
          updated_at: string
        }
        Insert: {
          base_rate_cents?: number | null
          bio?: string | null
          created_at?: string
          currency?: string | null
          handle: string
          id: string
          languages?: string[]
          niches?: string[]
          primary_platform: Database["public"]["Enums"]["creator_platform_type"]
          updated_at?: string
        }
        Update: {
          base_rate_cents?: number | null
          bio?: string | null
          created_at?: string
          currency?: string | null
          handle?: string
          id?: string
          languages?: string[]
          niches?: string[]
          primary_platform?: Database["public"]["Enums"]["creator_platform_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_scores: {
        Row: {
          algo_version: string
          audience_size_band: Database["public"]["Enums"]["audience_size_band"]
          computed_at: string
          creator_id: string
          currency: string
          engagement_score: number
          final_score: number
          niche_multiplier: number
          niche_score: number
          platform_score: number
          suggested_max_cents: number
          suggested_min_cents: number
          track_record_score: number
        }
        Insert: {
          algo_version?: string
          audience_size_band: Database["public"]["Enums"]["audience_size_band"]
          computed_at?: string
          creator_id: string
          currency?: string
          engagement_score: number
          final_score: number
          niche_multiplier: number
          niche_score: number
          platform_score: number
          suggested_max_cents: number
          suggested_min_cents: number
          track_record_score: number
        }
        Update: {
          algo_version?: string
          audience_size_band?: Database["public"]["Enums"]["audience_size_band"]
          computed_at?: string
          creator_id?: string
          currency?: string
          engagement_score?: number
          final_score?: number
          niche_multiplier?: number
          niche_score?: number
          platform_score?: number
          suggested_max_cents?: number
          suggested_min_cents?: number
          track_record_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "creator_scores_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: true
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          amount_cents: number
          approved_at: string | null
          contract_id: string
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          released_at: string | null
          sequence: number
          status: Database["public"]["Enums"]["milestone_status"]
          submitted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          approved_at?: string | null
          contract_id: string
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          released_at?: string | null
          sequence: number
          status?: Database["public"]["Enums"]["milestone_status"]
          submitted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          approved_at?: string | null
          contract_id?: string
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          released_at?: string | null
          sequence?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          submitted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      audience_size_band: "nano" | "micro" | "mid" | "macro" | "mega"
      brief_status: "draft" | "open" | "closed"
      contract_status:
        | "draft"
        | "pending_creator"
        | "active"
        | "declined"
        | "cancelled"
        | "completed"
      creator_platform_type:
        | "instagram"
        | "youtube"
        | "tiktok"
        | "podcast"
        | "twitter"
        | "linkedin"
      invitation_status: "invited" | "opted_in" | "declined" | "expired"
      milestone_status:
        | "pending"
        | "submitted"
        | "approved"
        | "rejected"
        | "released"
      subscription_tier: "free" | "scale"
      team_size: "1-10" | "11-50" | "51-200" | "200+"
      user_role: "brand" | "creator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      audience_size_band: ["nano", "micro", "mid", "macro", "mega"],
      brief_status: ["draft", "open", "closed"],
      contract_status: [
        "draft",
        "pending_creator",
        "active",
        "declined",
        "cancelled",
        "completed",
      ],
      creator_platform_type: [
        "instagram",
        "youtube",
        "tiktok",
        "podcast",
        "twitter",
        "linkedin",
      ],
      invitation_status: ["invited", "opted_in", "declined", "expired"],
      milestone_status: [
        "pending",
        "submitted",
        "approved",
        "rejected",
        "released",
      ],
      subscription_tier: ["free", "scale"],
      team_size: ["1-10", "11-50", "51-200", "200+"],
      user_role: ["brand", "creator", "admin"],
    },
  },
} as const
