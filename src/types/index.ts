// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  price: number;
  original_price?: number;
  sale_price?: number;
  discount_percentage?: number;
  image_url?: string;
  image_square_url?: string;
  gallery_url?: string;
  gallery_urls?: string[];
  gallery_array?: string[];
  video_url?: string;
  stock_quantity?: number;
  sold_count?: number;
  category_id?: string;
  category_name?: string;
  brand_id?: string;
  brand?: string | Brand;
  brand_slug?: string;
  sectors?: string[];
  features?: string[];
  tinh_nang?: string[];
  loi_ich?: string[];
  huong_dan?: string[];
  thong_so_ky_thuat?: any;
  specifications?: Record<string, any>;
  variants?: ProductVariant[];
  is_featured?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
  brands?: Brand;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  sku?: string;
  stock_quantity?: number;
  is_default?: boolean;
  attributes?: Record<string, any>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// Filter types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'popular';
  search?: string;
}

// Pagination types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Response types
export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
} 