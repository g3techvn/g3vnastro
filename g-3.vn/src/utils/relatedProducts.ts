import { supabase } from '../lib/supabase';

export async function getRelatedProducts(
  currentProduct: any,
  limit: number = 4
): Promise<any[]> {
  try {
    // Get products with same category or brand
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', currentProduct.id)
      .or(`pd_cat_id.eq.${currentProduct.pd_cat_id},brand_id.eq.${currentProduct.brand_id}`)
      .limit(limit);

    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }

    // If we don't have enough products, get random products
    if (!products || products.length < limit) {
      const { data: randomProducts, error: randomError } = await supabase
        .from('products')
        .select('*')
        .neq('id', currentProduct.id)
        .limit(limit - (products?.length || 0));

      if (randomError) {
        console.error('Error fetching random products:', randomError);
        return products || [];
      }

      return [...(products || []), ...(randomProducts || [])];
    }

    return products || [];
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
} 