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
    }
  }
} 