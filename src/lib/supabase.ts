import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API functions for products
export const productAPI = {
  async getProducts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, price, original_price, image_url')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getProductsByCategory(categorySlug: string, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name, slug),
        brands(name, slug)
      `)
      .eq('categories.slug', categorySlug)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getProductsByBrand(brandSlug: string, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug),
        brands!inner(name, slug)
      `)
      .eq('brands.slug', brandSlug)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }
}; 