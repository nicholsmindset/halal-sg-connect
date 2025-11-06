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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          address: string | null
          categories: string[] | null
          category_slugs: string[] | null
          created_at: string | null
          description: string | null
          district: string | null
          email: string | null
          features: string[] | null
          halal_certified: boolean | null
          id: string
          images: string[] | null
          is_premium: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          phone: string | null
          planning_area: string | null
          price_range: string | null
          property_district_code: string | null
          rating: number | null
          review_count: number | null
          slug: string
          updated_at: string | null
          verification_status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          categories?: string[] | null
          category_slugs?: string[] | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          features?: string[] | null
          halal_certified?: boolean | null
          id?: string
          images?: string[] | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          phone?: string | null
          planning_area?: string | null
          price_range?: string | null
          property_district_code?: string | null
          rating?: number | null
          review_count?: number | null
          slug: string
          updated_at?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          categories?: string[] | null
          category_slugs?: string[] | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          features?: string[] | null
          halal_certified?: boolean | null
          id?: string
          images?: string[] | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          planning_area?: string | null
          price_range?: string | null
          property_district_code?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          updated_at?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          title: string | null
          content: string
          photos: string[] | null
          helpful_count: number
          not_helpful_count: number
          view_count: number
          verified_purchase: boolean
          visit_date: string | null
          business_response: string | null
          business_response_at: string | null
          business_responder_id: string | null
          status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'hidden'
          moderation_notes: string | null
          moderated_by: string | null
          moderated_at: string | null
          flag_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          title?: string | null
          content: string
          photos?: string[] | null
          helpful_count?: number
          not_helpful_count?: number
          view_count?: number
          verified_purchase?: boolean
          visit_date?: string | null
          business_response?: string | null
          business_response_at?: string | null
          business_responder_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'flagged' | 'hidden'
          moderation_notes?: string | null
          moderated_by?: string | null
          moderated_at?: string | null
          flag_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          content?: string
          photos?: string[] | null
          helpful_count?: number
          not_helpful_count?: number
          view_count?: number
          verified_purchase?: boolean
          visit_date?: string | null
          business_response?: string | null
          business_response_at?: string | null
          business_responder_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'flagged' | 'hidden'
          moderation_notes?: string | null
          moderated_by?: string | null
          moderated_at?: string | null
          flag_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      review_votes: {
        Row: {
          id: string
          review_id: string
          user_id: string
          vote_type: 'helpful' | 'not_helpful'
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          vote_type: 'helpful' | 'not_helpful'
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          vote_type?: 'helpful' | 'not_helpful'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          }
        ]
      }
      review_statistics: {
        Row: {
          business_id: string
          total_reviews: number
          average_rating: number
          rating_5_count: number
          rating_4_count: number
          rating_3_count: number
          rating_2_count: number
          rating_1_count: number
          total_helpful_votes: number
          verified_reviews_count: number
          reviews_with_photos_count: number
          avg_response_time_hours: number | null
          response_rate: number | null
          last_review_date: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          total_reviews?: number
          average_rating?: number
          rating_5_count?: number
          rating_4_count?: number
          rating_3_count?: number
          rating_2_count?: number
          rating_1_count?: number
          total_helpful_votes?: number
          verified_reviews_count?: number
          reviews_with_photos_count?: number
          avg_response_time_hours?: number | null
          response_rate?: number | null
          last_review_date?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          total_reviews?: number
          average_rating?: number
          rating_5_count?: number
          rating_4_count?: number
          rating_3_count?: number
          rating_2_count?: number
          rating_1_count?: number
          total_helpful_votes?: number
          verified_reviews_count?: number
          reviews_with_photos_count?: number
          avg_response_time_hours?: number | null
          response_rate?: number | null
          last_review_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_statistics_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      user_review_statistics: {
        Row: {
          user_id: string
          total_reviews: number
          total_helpful_votes: number
          total_photos_uploaded: number
          average_rating_given: number
          review_streak_days: number
          longest_streak_days: number
          last_review_date: string | null
          level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
          badges: string[] | null
          points: number
          rank: number | null
          updated_at: string
        }
        Insert: {
          user_id: string
          total_reviews?: number
          total_helpful_votes?: number
          total_photos_uploaded?: number
          average_rating_given?: number
          review_streak_days?: number
          longest_streak_days?: number
          last_review_date?: string | null
          level?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
          badges?: string[] | null
          points?: number
          rank?: number | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_reviews?: number
          total_helpful_votes?: number
          total_photos_uploaded?: number
          average_rating_given?: number
          review_streak_days?: number
          longest_streak_days?: number
          last_review_date?: string | null
          level?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
          badges?: string[] | null
          points?: number
          rank?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_url: string
          content: Json
          created_at: string | null
          filters: Json
          h1_title: string
          id: string
          is_published: boolean | null
          meta_description: string
          page_type: string
          schema_markup: Json | null
          slug: string
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          canonical_url: string
          content?: Json
          created_at?: string | null
          filters?: Json
          h1_title: string
          id?: string
          is_published?: boolean | null
          meta_description: string
          page_type: string
          schema_markup?: Json | null
          slug: string
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          canonical_url?: string
          content?: Json
          created_at?: string | null
          filters?: Json
          h1_title?: string
          id?: string
          is_published?: boolean | null
          meta_description?: string
          page_type?: string
          schema_markup?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      business_search_view: {
        Row: {
          address: string | null
          categories: string[] | null
          category_slugs: string[] | null
          created_at: string | null
          description: string | null
          district: string | null
          features: string[] | null
          halal_certified: boolean | null
          id: string | null
          images: string[] | null
          is_premium: boolean | null
          latitude: number | null
          longitude: number | null
          name: string | null
          planning_area: string | null
          price_range: string | null
          property_district_code: string | null
          rating: number | null
          review_count: number | null
          slug: string | null
          updated_at: string | null
          verification_status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          categories?: string[] | null
          category_slugs?: string[] | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          features?: string[] | null
          halal_certified?: boolean | null
          id?: string | null
          images?: string[] | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          planning_area?: string | null
          price_range?: string | null
          property_district_code?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          updated_at?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          categories?: string[] | null
          category_slugs?: string[] | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          features?: string[] | null
          halal_certified?: boolean | null
          id?: string | null
          images?: string[] | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          planning_area?: string | null
          price_range?: string | null
          property_district_code?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          updated_at?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_business_owner: {
        Args: { _business_id: string; _user_id: string }
        Returns: boolean
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
    Enums: {},
  },
} as const
