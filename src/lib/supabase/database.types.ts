export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      delivery_zones: {
        Row: {
          base_delivery_fee_cents: number
          department_name: string
          free_shipping_threshold_cents: number | null
          id: string
          is_deliverable: boolean
          min_order_cents: number
          postal_code_prefix: string
        }
        Insert: {
          base_delivery_fee_cents?: number
          department_name: string
          free_shipping_threshold_cents?: number | null
          id?: string
          is_deliverable?: boolean
          min_order_cents?: number
          postal_code_prefix: string
        }
        Update: {
          base_delivery_fee_cents?: number
          department_name?: string
          free_shipping_threshold_cents?: number | null
          id?: string
          is_deliverable?: boolean
          min_order_cents?: number
          postal_code_prefix?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          access_constraints: Json | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_date: string | null
          delivery_fee_cents: number
          delivery_slot: string | null
          id: string
          items: Json
          order_number: string
          shipping_address: Json
          status: string
          stripe_payment_intent_id: string | null
          subtotal_cents: number
          total_cents: number
          user_id: string | null
        }
        Insert: {
          access_constraints?: Json | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_date?: string | null
          delivery_fee_cents: number
          delivery_slot?: string | null
          id?: string
          items: Json
          order_number: string
          shipping_address: Json
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal_cents: number
          total_cents: number
          user_id?: string | null
        }
        Update: {
          access_constraints?: Json | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_date?: string | null
          delivery_fee_cents?: number
          delivery_slot?: string | null
          id?: string
          items?: Json
          order_number?: string
          shipping_address?: Json
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal_cents?: number
          total_cents?: number
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          shipping_address: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          shipping_address?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          shipping_address?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          category: string
          created_at: string
          description: string | null
          humidity_rate: number | null
          id: string
          image_url: string
          is_active: boolean
          name: string
          packaging: string
          short_description: string | null
          slug: string
          species: string[] | null
          stock_quantity: number
          unit_price_cents: number
          volume_stere: number | null
          weight_kg: number | null
          wood_length_cm: number | null
        }
        Insert: {
          badge?: string | null
          category: string
          created_at?: string
          description?: string | null
          humidity_rate?: number | null
          id?: string
          image_url: string
          is_active?: boolean
          name: string
          packaging: string
          short_description?: string | null
          slug: string
          species?: string[] | null
          stock_quantity?: number
          unit_price_cents: number
          volume_stere?: number | null
          weight_kg?: number | null
          wood_length_cm?: number | null
        }
        Update: {
          badge?: string | null
          category?: string
          created_at?: string
          description?: string | null
          humidity_rate?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          packaging?: string
          short_description?: string | null
          slug?: string
          species?: string[] | null
          stock_quantity?: number
          unit_price_cents?: number
          volume_stere?: number | null
          weight_kg?: number | null
          wood_length_cm?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_order_by_id: {
        Args: {
          p_order_id: string
        }
        Returns: Database["public"]["Tables"]["orders"]["Row"][]
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

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type DeliveryZone = Database["public"]["Tables"]["delivery_zones"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
