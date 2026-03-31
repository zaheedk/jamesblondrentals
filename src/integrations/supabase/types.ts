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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_articles: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          meta_description: string | null
          meta_title: string | null
          page_title: string | null
          published: boolean
          read_time: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          page_title?: string | null
          published?: boolean
          read_time?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          page_title?: string | null
          published?: boolean
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_feedback: {
        Row: {
          booking_reference: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          id: string
          rating: number
          suggestions: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_reference?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          rating: number
          suggestions?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_reference?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          rating?: number
          suggestions?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_reference: string | null
          booking_status: string | null
          created_at: string
          customer_address: string | null
          customer_age: number | null
          customer_email: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_license_number: string | null
          customer_phone: string | null
          daily_rate: number | null
          dropoff_date: string
          dropoff_location_id: string | null
          dropoff_location_name: string | null
          dropoff_time: string
          extras_total: number | null
          id: string
          insurance_options: Json | null
          insurance_total: number | null
          notes: string | null
          payment_intent_id: string | null
          payment_method: string | null
          payment_status: string | null
          pickup_date: string
          pickup_location_id: string | null
          pickup_location_name: string | null
          pickup_time: string
          reservation_reference: string | null
          selected_extras: Json | null
          special_requirements: string | null
          total_amount: number | null
          total_days: number
          updated_at: string
          user_id: string | null
          vehicle_category: string | null
          vehicle_id: string | null
          vehicle_name: string | null
          vehicle_total: number | null
          vehicle_type: string | null
        }
        Insert: {
          booking_reference?: string | null
          booking_status?: string | null
          created_at?: string
          customer_address?: string | null
          customer_age?: number | null
          customer_email?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_license_number?: string | null
          customer_phone?: string | null
          daily_rate?: number | null
          dropoff_date: string
          dropoff_location_id?: string | null
          dropoff_location_name?: string | null
          dropoff_time: string
          extras_total?: number | null
          id?: string
          insurance_options?: Json | null
          insurance_total?: number | null
          notes?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date: string
          pickup_location_id?: string | null
          pickup_location_name?: string | null
          pickup_time: string
          reservation_reference?: string | null
          selected_extras?: Json | null
          special_requirements?: string | null
          total_amount?: number | null
          total_days: number
          updated_at?: string
          user_id?: string | null
          vehicle_category?: string | null
          vehicle_id?: string | null
          vehicle_name?: string | null
          vehicle_total?: number | null
          vehicle_type?: string | null
        }
        Update: {
          booking_reference?: string | null
          booking_status?: string | null
          created_at?: string
          customer_address?: string | null
          customer_age?: number | null
          customer_email?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_license_number?: string | null
          customer_phone?: string | null
          daily_rate?: number | null
          dropoff_date?: string
          dropoff_location_id?: string | null
          dropoff_location_name?: string | null
          dropoff_time?: string
          extras_total?: number | null
          id?: string
          insurance_options?: Json | null
          insurance_total?: number | null
          notes?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date?: string
          pickup_location_id?: string | null
          pickup_location_name?: string | null
          pickup_time?: string
          reservation_reference?: string | null
          selected_extras?: Json | null
          special_requirements?: string | null
          total_amount?: number | null
          total_days?: number
          updated_at?: string
          user_id?: string | null
          vehicle_category?: string | null
          vehicle_id?: string | null
          vehicle_name?: string | null
          vehicle_total?: number | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          customer_id: string | null
          dob: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          license_country: string | null
          license_expiry: string | null
          license_number: string | null
          mobile: string | null
          passport_number: string | null
          phone: string | null
          postcode: string | null
          state_province: string | null
          suburb: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string | null
          dob?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          license_country?: string | null
          license_expiry?: string | null
          license_number?: string | null
          mobile?: string | null
          passport_number?: string | null
          phone?: string | null
          postcode?: string | null
          state_province?: string | null
          suburb?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string | null
          dob?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          license_country?: string | null
          license_expiry?: string | null
          license_number?: string | null
          mobile?: string | null
          passport_number?: string | null
          phone?: string | null
          postcode?: string | null
          state_province?: string | null
          suburb?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      low_cost_rental_blogs: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          meta_description: string | null
          meta_title: string | null
          published: boolean
          read_time: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          read_time?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          provider: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          provider?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          provider?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rental_agreements: {
        Row: {
          additional_driver_signature: string | null
          booking_data: Json
          created_at: string
          created_by: string | null
          fuel_in: string | null
          fuel_out: string | null
          hirer_signature: string | null
          id: string
          kms_in: string | null
          kms_out: string | null
          notes: string | null
          reservation_ref: string
          signed_at: string | null
          signed_by_name: string | null
          updated_at: string
          vehicle_rego: string | null
        }
        Insert: {
          additional_driver_signature?: string | null
          booking_data?: Json
          created_at?: string
          created_by?: string | null
          fuel_in?: string | null
          fuel_out?: string | null
          hirer_signature?: string | null
          id?: string
          kms_in?: string | null
          kms_out?: string | null
          notes?: string | null
          reservation_ref: string
          signed_at?: string | null
          signed_by_name?: string | null
          updated_at?: string
          vehicle_rego?: string | null
        }
        Update: {
          additional_driver_signature?: string | null
          booking_data?: Json
          created_at?: string
          created_by?: string | null
          fuel_in?: string | null
          fuel_out?: string | null
          hirer_signature?: string | null
          id?: string
          kms_in?: string | null
          kms_out?: string | null
          notes?: string | null
          reservation_ref?: string
          signed_at?: string | null
          signed_by_name?: string | null
          updated_at?: string
          vehicle_rego?: string | null
        }
        Relationships: []
      }
      uploaded_bookings: {
        Row: {
          booking_reference: string | null
          booking_status: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          data: Json
          dropoff_date: string | null
          dropoff_location: string | null
          file_name: string
          id: string
          pickup_date: string | null
          pickup_location: string | null
          processed_at: string | null
          row_count: number | null
          total_amount: number | null
          updated_at: string
          uploaded_at: string
          vehicle_category: string | null
          vehicle_type: string | null
        }
        Insert: {
          booking_reference?: string | null
          booking_status?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          data: Json
          dropoff_date?: string | null
          dropoff_location?: string | null
          file_name: string
          id?: string
          pickup_date?: string | null
          pickup_location?: string | null
          processed_at?: string | null
          row_count?: number | null
          total_amount?: number | null
          updated_at?: string
          uploaded_at?: string
          vehicle_category?: string | null
          vehicle_type?: string | null
        }
        Update: {
          booking_reference?: string | null
          booking_status?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          data?: Json
          dropoff_date?: string | null
          dropoff_location?: string | null
          file_name?: string
          id?: string
          pickup_date?: string | null
          pickup_location?: string | null
          processed_at?: string | null
          row_count?: number | null
          total_amount?: number | null
          updated_at?: string
          uploaded_at?: string
          vehicle_category?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_rental_rates: {
        Row: {
          created_at: string
          daily_rate: number | null
          id: string
          rental_period_days: number
          scraped_at: string
          updated_at: string
          vehicle_category: string
          website_name: string
        }
        Insert: {
          created_at?: string
          daily_rate?: number | null
          id?: string
          rental_period_days: number
          scraped_at?: string
          updated_at?: string
          vehicle_category: string
          website_name: string
        }
        Update: {
          created_at?: string
          daily_rate?: number | null
          id?: string
          rental_period_days?: number
          scraped_at?: string
          updated_at?: string
          vehicle_category?: string
          website_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_email: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
