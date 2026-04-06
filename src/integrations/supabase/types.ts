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
          additional_driver_signature: string | null
          agency: string | null
          agency_branch: string | null
          agent_collected: number | null
          agent_commission: number | null
          agent_email: string | null
          agent_name: string | null
          booked_by: string | null
          booking_data: Json | null
          booking_reference: string | null
          booking_status: string | null
          booking_total: number | null
          booking_type: string | null
          brand: string | null
          car_id: string | null
          company_name: string | null
          converted_from: string | null
          created_at: string
          created_by: string | null
          customer_address: string | null
          customer_age: number | null
          customer_country: string | null
          customer_dob: string | null
          customer_email: string | null
          customer_fax: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_license_number: string | null
          customer_mobile: string | null
          customer_phone: string | null
          customer_postcode: string | null
          customer_state: string | null
          customer_suburb: string | null
          daily_rate: number | null
          date_booked: string | null
          date_closed: string | null
          dropoff_date: string
          dropoff_location_id: string | null
          dropoff_location_name: string | null
          dropoff_time: string
          extra_fee_1: string | null
          extra_fee_1_value: number | null
          extra_fee_10: string | null
          extra_fee_10_value: number | null
          extra_fee_2: string | null
          extra_fee_2_value: number | null
          extra_fee_3: string | null
          extra_fee_3_value: number | null
          extra_fee_4: string | null
          extra_fee_4_value: number | null
          extra_fee_5: string | null
          extra_fee_5_value: number | null
          extra_fee_6: string | null
          extra_fee_6_value: number | null
          extra_fee_7: string | null
          extra_fee_7_value: number | null
          extra_fee_8: string | null
          extra_fee_8_value: number | null
          extra_fee_9: string | null
          extra_fee_9_value: number | null
          extras_total: number | null
          fuel_in: string | null
          fuel_out: string | null
          hired_by: string | null
          hirer_signature: string | null
          id: string
          import_data: Json | null
          import_file_name: string | null
          import_row_count: number | null
          insurance_fee: number | null
          insurance_options: Json | null
          insurance_total: number | null
          kms_in: string | null
          kms_out: string | null
          license_exp_date: string | null
          license_issued: string | null
          local_address: string | null
          mailing_list: string | null
          no_travelling: number | null
          notes: string | null
          occupation: string | null
          payment_intent_id: string | null
          payment_method: string | null
          payment_status: string | null
          pickup_date: string
          pickup_location_id: string | null
          pickup_location_name: string | null
          pickup_time: string
          processed_at: string | null
          rcm_customer_id: string | null
          rcm_ref_no: string | null
          reference_no: string | null
          referral_name: string | null
          referrals: string | null
          reservation_reference: string | null
          sales_tax: number | null
          selected_extras: Json | null
          signed_at: string | null
          signed_by_name: string | null
          source: string | null
          special_requirements: string | null
          state_tax: number | null
          total_amount: number | null
          total_days: number
          total_extra_inc_insurance: number | null
          transmission: string | null
          updated_at: string
          uploaded_at: string | null
          user_id: string | null
          vehicle_category: string | null
          vehicle_id: string | null
          vehicle_name: string | null
          vehicle_rego: string | null
          vehicle_total: number | null
          vehicle_type: string | null
          youngest_driver: number | null
        }
        Insert: {
          additional_driver_signature?: string | null
          agency?: string | null
          agency_branch?: string | null
          agent_collected?: number | null
          agent_commission?: number | null
          agent_email?: string | null
          agent_name?: string | null
          booked_by?: string | null
          booking_data?: Json | null
          booking_reference?: string | null
          booking_status?: string | null
          booking_total?: number | null
          booking_type?: string | null
          brand?: string | null
          car_id?: string | null
          company_name?: string | null
          converted_from?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_age?: number | null
          customer_country?: string | null
          customer_dob?: string | null
          customer_email?: string | null
          customer_fax?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_license_number?: string | null
          customer_mobile?: string | null
          customer_phone?: string | null
          customer_postcode?: string | null
          customer_state?: string | null
          customer_suburb?: string | null
          daily_rate?: number | null
          date_booked?: string | null
          date_closed?: string | null
          dropoff_date: string
          dropoff_location_id?: string | null
          dropoff_location_name?: string | null
          dropoff_time: string
          extra_fee_1?: string | null
          extra_fee_1_value?: number | null
          extra_fee_10?: string | null
          extra_fee_10_value?: number | null
          extra_fee_2?: string | null
          extra_fee_2_value?: number | null
          extra_fee_3?: string | null
          extra_fee_3_value?: number | null
          extra_fee_4?: string | null
          extra_fee_4_value?: number | null
          extra_fee_5?: string | null
          extra_fee_5_value?: number | null
          extra_fee_6?: string | null
          extra_fee_6_value?: number | null
          extra_fee_7?: string | null
          extra_fee_7_value?: number | null
          extra_fee_8?: string | null
          extra_fee_8_value?: number | null
          extra_fee_9?: string | null
          extra_fee_9_value?: number | null
          extras_total?: number | null
          fuel_in?: string | null
          fuel_out?: string | null
          hired_by?: string | null
          hirer_signature?: string | null
          id?: string
          import_data?: Json | null
          import_file_name?: string | null
          import_row_count?: number | null
          insurance_fee?: number | null
          insurance_options?: Json | null
          insurance_total?: number | null
          kms_in?: string | null
          kms_out?: string | null
          license_exp_date?: string | null
          license_issued?: string | null
          local_address?: string | null
          mailing_list?: string | null
          no_travelling?: number | null
          notes?: string | null
          occupation?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date: string
          pickup_location_id?: string | null
          pickup_location_name?: string | null
          pickup_time: string
          processed_at?: string | null
          rcm_customer_id?: string | null
          rcm_ref_no?: string | null
          reference_no?: string | null
          referral_name?: string | null
          referrals?: string | null
          reservation_reference?: string | null
          sales_tax?: number | null
          selected_extras?: Json | null
          signed_at?: string | null
          signed_by_name?: string | null
          source?: string | null
          special_requirements?: string | null
          state_tax?: number | null
          total_amount?: number | null
          total_days: number
          total_extra_inc_insurance?: number | null
          transmission?: string | null
          updated_at?: string
          uploaded_at?: string | null
          user_id?: string | null
          vehicle_category?: string | null
          vehicle_id?: string | null
          vehicle_name?: string | null
          vehicle_rego?: string | null
          vehicle_total?: number | null
          vehicle_type?: string | null
          youngest_driver?: number | null
        }
        Update: {
          additional_driver_signature?: string | null
          agency?: string | null
          agency_branch?: string | null
          agent_collected?: number | null
          agent_commission?: number | null
          agent_email?: string | null
          agent_name?: string | null
          booked_by?: string | null
          booking_data?: Json | null
          booking_reference?: string | null
          booking_status?: string | null
          booking_total?: number | null
          booking_type?: string | null
          brand?: string | null
          car_id?: string | null
          company_name?: string | null
          converted_from?: string | null
          created_at?: string
          created_by?: string | null
          customer_address?: string | null
          customer_age?: number | null
          customer_country?: string | null
          customer_dob?: string | null
          customer_email?: string | null
          customer_fax?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_license_number?: string | null
          customer_mobile?: string | null
          customer_phone?: string | null
          customer_postcode?: string | null
          customer_state?: string | null
          customer_suburb?: string | null
          daily_rate?: number | null
          date_booked?: string | null
          date_closed?: string | null
          dropoff_date?: string
          dropoff_location_id?: string | null
          dropoff_location_name?: string | null
          dropoff_time?: string
          extra_fee_1?: string | null
          extra_fee_1_value?: number | null
          extra_fee_10?: string | null
          extra_fee_10_value?: number | null
          extra_fee_2?: string | null
          extra_fee_2_value?: number | null
          extra_fee_3?: string | null
          extra_fee_3_value?: number | null
          extra_fee_4?: string | null
          extra_fee_4_value?: number | null
          extra_fee_5?: string | null
          extra_fee_5_value?: number | null
          extra_fee_6?: string | null
          extra_fee_6_value?: number | null
          extra_fee_7?: string | null
          extra_fee_7_value?: number | null
          extra_fee_8?: string | null
          extra_fee_8_value?: number | null
          extra_fee_9?: string | null
          extra_fee_9_value?: number | null
          extras_total?: number | null
          fuel_in?: string | null
          fuel_out?: string | null
          hired_by?: string | null
          hirer_signature?: string | null
          id?: string
          import_data?: Json | null
          import_file_name?: string | null
          import_row_count?: number | null
          insurance_fee?: number | null
          insurance_options?: Json | null
          insurance_total?: number | null
          kms_in?: string | null
          kms_out?: string | null
          license_exp_date?: string | null
          license_issued?: string | null
          local_address?: string | null
          mailing_list?: string | null
          no_travelling?: number | null
          notes?: string | null
          occupation?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date?: string
          pickup_location_id?: string | null
          pickup_location_name?: string | null
          pickup_time?: string
          processed_at?: string | null
          rcm_customer_id?: string | null
          rcm_ref_no?: string | null
          reference_no?: string | null
          referral_name?: string | null
          referrals?: string | null
          reservation_reference?: string | null
          sales_tax?: number | null
          selected_extras?: Json | null
          signed_at?: string | null
          signed_by_name?: string | null
          source?: string | null
          special_requirements?: string | null
          state_tax?: number | null
          total_amount?: number | null
          total_days?: number
          total_extra_inc_insurance?: number | null
          transmission?: string | null
          updated_at?: string
          uploaded_at?: string | null
          user_id?: string | null
          vehicle_category?: string | null
          vehicle_id?: string | null
          vehicle_name?: string | null
          vehicle_rego?: string | null
          vehicle_total?: number | null
          vehicle_type?: string | null
          youngest_driver?: number | null
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
