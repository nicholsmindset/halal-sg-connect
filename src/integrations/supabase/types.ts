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
          email: string | null
          features: string[] | null
          halal_certified: boolean | null
          id: string | null
          images: string[] | null
          is_premium: boolean | null
          latitude: number | null
          longitude: number | null
          name: string | null
          phone: string | null
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
          email?: string | null
          features?: string[] | null
          halal_certified?: boolean | null
          id?: string | null
          images?: string[] | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
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
          email?: string | null
          features?: string[] | null
          halal_certified?: boolean | null
          id?: string | null
          images?: string[] | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
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
      [_ in never]: never
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
