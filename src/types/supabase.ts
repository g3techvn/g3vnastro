export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          original_price: number | null
          image_url: string | null
          video_url: string | null
          rating: number | null
          sold_count: number | null
          status: string
          created_at: string
          updated_at: string
          brand_id: string | null
          category_id: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          original_price?: number | null
          image_url?: string | null
          video_url?: string | null
          rating?: number | null
          sold_count?: number | null
          status?: string
          created_at?: string
          updated_at?: string
          brand_id?: string | null
          category_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          original_price?: number | null
          image_url?: string | null
          video_url?: string | null
          rating?: number | null
          sold_count?: number | null
          status?: string
          created_at?: string
          updated_at?: string
          brand_id?: string | null
          category_id?: string | null
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          salutation: string
          full_name: string
          phone: string
          email: string | null
          address: string
          order_note: string | null
          voucher_code: string | null
          payment_method: string
          total_amount: number
          shipping_fee: number
          status: string
          processing_status: string
          payment_status: string
          shipping_status: string
          internal_note: string | null
          processed_at: string | null
          paid_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          cancelled_at: string | null
          cancel_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          salutation: string
          full_name: string
          phone: string
          email?: string | null
          address: string
          order_note?: string | null
          voucher_code?: string | null
          payment_method: string
          total_amount: number
          shipping_fee: number
          status?: string
          processing_status?: string
          payment_status?: string
          shipping_status?: string
          internal_note?: string | null
          processed_at?: string | null
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          salutation?: string
          full_name?: string
          phone?: string
          email?: string | null
          address?: string
          order_note?: string | null
          voucher_code?: string | null
          payment_method?: string
          total_amount?: number
          shipping_fee?: number
          status?: string
          processing_status?: string
          payment_status?: string
          shipping_status?: string
          internal_note?: string | null
          processed_at?: string | null
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | number
          product_name: string
          variant_id: string | number | null
          variant_name: string | null
          variant_options: any | null
          quantity: number
          price: number
          original_price: number | null
          image_url: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string | number
          product_name: string
          variant_id?: string | number | null
          variant_name?: string | null
          variant_options?: any | null
          quantity: number
          price: number
          original_price?: number | null
          image_url?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | number
          product_name?: string
          variant_id?: string | number | null
          variant_name?: string | null
          variant_options?: any | null
          quantity?: number
          price?: number
          original_price?: number | null
          image_url?: string | null
        }
      }
    }
  }
} 