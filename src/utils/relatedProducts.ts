import { getRelatedProductsLocal } from '../lib/collections';

export async function getRelatedProducts(
  currentProduct: { id: number; pd_cat_id?: number | null; brand_id?: number | null },
  limit: number = 4
) {
  return getRelatedProductsLocal(currentProduct, limit);
} 