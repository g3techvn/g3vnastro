// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sale_price?: number;
  image_url?: string;
  gallery_urls?: string[];
  stock_quantity?: number;
  sold_count?: number;
  category_id?: string;
  brand_id?: string;
  sectors?: string[];
  features?: string[];
  specifications?: Record<string, any>;
  is_featured?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
  brands?: Brand;
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